# 📚 Frontend Upgrades - Guía de Migración

## Estado Actual

**Completado:**
- ✅ TypeScript configurado (tsconfig.json + path mapping)
- ✅ Zustand instalado (v4+)
- ✅ Store global creado con todos los estados
- ✅ Error Boundary implementado
- ✅ Custom hooks para casos de uso comunes

**Instalado:** zustand

## 📂 Estructura Nueva

```
src/
├── types/
│   └── index.ts           ← Tipos centralizados
├── store/
│   └── index.ts           ← Zustand store + hooks personalizados
├── hooks/
│   └── index.ts           ← Custom hooks reutilizables
├── Components/
│   └── ErrorBoundary/
│       └── index.tsx      ← Error Boundary component
└── [resto estructura existente]
```

## 🔄 Migración del Context API a Zustand

### Antes (Context API)

```javascript
// Context/index.jsx
export const AppContext = createContext();
const [state, setState] = useState({...});
return <AppContext.Provider value={{state, setState}}>{children}</AppContext.Provider>

// Componente
const { state, setState } = useContext(AppContext);
```

### Después (Zustand)

```typescript
// store/index.ts
export const useAppStore = create<AppStore>()(...)

// Componente
const { cart, addToCart } = useAppStore((state) => ({
  cart: state.cart,
  addToCart: state.addToCart,
}));
// O usar hook personalizado
const cart = useShoppingCart();
```

## 🛠️ Próximos Pasos

### 1. Actualizar App.jsx a App.tsx

```typescript
import ErrorBoundary from '@components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      {/* Tu contenido */}
    </ErrorBoundary>
  );
}
```

### 2. Migrar Componentes (Gradualmente)

Orden recomendado:
1. Componentes sin props → TypeScript puro
2. Componentes con props → Agregar tipos
3. Componentes con estado local → Usar hooks
4. Componentes con Context → Reemplazar con Zustand

### 3. Ejemplos de Migración

**Antes:**
```javascript
// Navbar.jsx
import { useContext } from 'react';
import { AppContext } from '@context/index';

export default function Navbar() {
  const { state } = useContext(AppContext);
  return <nav>{state.isMenuOpen && <Menu />}</nav>;
}
```

**Después:**
```typescript
// Navbar.tsx
import { useUIState } from '@hooks/index';

export default function Navbar() {
  const { modals } = useUIState();
  return <nav>{modals.menu && <Menu />}</nav>;
}
```

## 📦 Store - Uso por Dominio

### Auth
```typescript
import { useAuth } from '@store/index';

const { user, token, isAuthenticated, logout } = useAuth();
```

### Cart
```typescript
import { useCart } from '@store/index';

const { cart, addToCart, getCartTotal, removeFromCart } = useCart();
```

### UI
```typescript
import { useUI } from '@store/index';

const { isMenuOpen, toggleMenu, closeAllModals } = useUI();
```

### Filters
```typescript
import { useFilters } from '@store/index';

const { filters, search, filterByCategory } = useFilters();
```

## 🎣 Custom Hooks Disponibles

### useShoppingCart()
```typescript
const { items, total, count, addToCart, removeFromCart } = useShoppingCart();
```

### useSearch()
```typescript
const { filters, search, filterByCategory, filterByPrice } = useSearch();
```

### useFilteredProducts()
```typescript
const filtered = useFilteredProducts(products);
```

### useUIState()
```typescript
const { modals, toggle, closeAll } = useUIState();
```

### useFormValidation()
```typescript
const { values, handleChange, handleSubmit } = useFormValidation(
  { email: '', password: '' },
  async (values) => { /* submit */ }
);
```

## 🚀 Ventajas de esta Setup

| Aspecto | Beneficio |
|--------|----------|
| TypeScript | Type safety, mejor autocompletion, menos bugs |
| Zustand | Store más simple que Redux, mejor rendimiento |
| Error Boundary | Catch de errores en UI, fallback amigable |
| Custom Hooks | Lógica reutilizable, código limpio |
| Path Mapping | Imports limpios (@components, @types, etc) |

## ⚠️ Consideraciones

1. **LocalStorage**: El store persiste `cart`, `orders`, `token`, `user` automáticamente
2. **DevTools**: Redux DevTools habilitado en desarrollo para debugging
3. **Performance**: Zustand usa selectors para evitar re-renders innecesarios
4. **Error Handling**: ErrorBoundary solo captura errores de rendering, no de eventos

## 📝 Archivos a Actualizar

Próximamente:
- [ ] `App.jsx` → `App.tsx` (agregar ErrorBoundary)
- [ ] `main.jsx` → `main.tsx`
- [ ] `Pages/App/index.jsx` → TypeScript
- [ ] `Components/Navbar/index.jsx` → TypeScript
- [ ] `Components/Card/index.jsx` → TypeScript
- [ ] Eliminar `Context/index.jsx` cuando esté todo migrado

## 🧪 Testing

### Antes de merge:
```bash
npm run build   # Verificar que compila sin errores
npm run dev     # Verificar que funciona en desarrollo
```

### Validar:
- [x] No hay errores de tipos
- [x] App se inicia correctamente
- [x] ErrorBoundary se muestra si hay error
- [x] Zustand store funciona (verificar en Redux DevTools)
- [x] LocalStorage persiste datos

## 📚 Referencias

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [TypeScript React](https://www.typescriptlang.org/docs/handbook/react.html)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**Estado:** ✅ Infraestructura lista para migración

**Próximo paso:** Convertir App.jsx y componentes principales a TypeScript
