# 📐 ESTÁNDARES DE CÓDIGO - Guía Profesional

**Equipo**: Desarrollo Profesional
**Vigencia**: Desde FASE 0
**Propósito**: Garantizar calidad y consistencia en todo el código

---

## 1. JAVASCRIPT/TYPESCRIPT

### Naming Conventions
```javascript
// ✅ CORRECTO
const maxRetries = 3;              // Variables: camelCase
const MAX_TIMEOUT = 5000;          // Constantes: UPPER_SNAKE_CASE
function calculateTotal() {}       // Funciones: camelCase
class UserService {}               // Clases: PascalCase
const isActive = true;             // Booleanos: is/has/can prefix

// ❌ INCORRECTO
const max_retries = 3;             // Snake case
const maxretries = 3;              // Sin separación
function calculatetotal() {}       // Lowercase
class userservice {}               // Lowercase
```

### Funciones
```javascript
// ✅ CORRECTO - Función pura y simple
function calculatePrice(quantity, unitPrice) {
  return quantity * unitPrice;
}

// ✅ CORRECTO - Con documentación
/**
 * Calcula el total de una orden
 * @param {number} quantity - Cantidad de items
 * @param {number} unitPrice - Precio por unidad
 * @returns {number} Total calculado
 */
function calculateTotal(quantity, unitPrice) {
  return quantity * unitPrice;
}

// ❌ INCORRECTO - Múltiples responsabilidades
function calculateAndUpdatePrice(quantity, price) {
  const total = quantity * price;
  saveToDatabase(total);  // ¡No hacer esto!
  return total;
}
```

### Tipos y Interfaces
```typescript
// ✅ CORRECTO
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

type UserResponse = {
  success: boolean;
  data: User;
  message: string;
};

// ❌ INCORRECTO
interface user {  // Lowercase
  ID: string;    // UPPER_CASE
  email_address: string;  // snake_case
}
```

---

## 2. REACT

### Componentes
```javascript
// ✅ CORRECTO - Componente funcional
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <h1>{user?.name}</h1>
    </div>
  );
}

// ✅ CORRECTO - Props con tipos
interface UserProfileProps {
  userId: string;
  onLoad?: (user: User) => void;
}

export function UserProfile({ userId, onLoad }: UserProfileProps) {
  // ...
}

// ❌ INCORRECTO
export default function userProfile() {  // PascalCase!
  // ❌ Props desestructurados sin tipo
  return ...
}
```

### Hooks
```javascript
// ✅ CORRECTO
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
const [user, setUser] = useState<User | null>(null);

// ❌ INCORRECTO
const [status, setStatus] = useState();  // Sin tipo
const [user, setUser] = useState();      // Sin valor inicial
```

---

## 3. ARCHIVO Y CARPETA

```
src/
├─ Components/          # Componentes reutilizables
│  ├─ Button/
│  │  ├─ index.tsx
│  │  └─ Button.test.tsx
│  └─ Card/
├─ Pages/              # Páginas completas
├─ hooks/              # Custom hooks
├─ utils/              # Funciones utilitarias
├─ services/           # API calls
├─ types/              # Tipos TypeScript
├─ styles/             # Estilos globales
└─ App.tsx

// ✅ CORRECTO: Carpeta por componente
Components/Button/
├─ index.tsx          # Exporta el componente
└─ Button.test.tsx    # Test del componente

// ❌ INCORRECTO: Muchos archivos en raíz
src/
├─ Button.tsx
├─ Card.tsx
├─ Form.tsx
├─ Input.tsx
```

---

## 4. COMMITS Y GIT

### Mensaje de Commit
```
// ✅ CORRECTO
git commit -m "feat: Agregar validación de email en formulario"
git commit -m "fix: Corregir bug en cálculo de total"
git commit -m "docs: Actualizar guía de instalación"
git commit -m "refactor: Extraer lógica de autenticación"
git commit -m "test: Agregar tests para UserService"

// ❌ INCORRECTO
git commit -m "cambios"
git commit -m "fix stuff"
git commit -m "wip"
```

### Tipos de Commit
```
feat:    Nueva funcionalidad
fix:     Bug fix
docs:    Cambios en documentación
style:   Cambios de formato (sin cambiar lógica)
refactor: Cambios de código sin cambiar funcionalidad
test:    Agregar o actualizar tests
chore:   Cambios en build, dependencias, etc.
perf:    Mejoras de performance
```

---

## 5. TESTING

### Estructura de Tests
```javascript
// ✅ CORRECTO
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      
      // Act
      const user = UserService.createUser(userData);
      
      // Assert
      expect(user.id).toBeDefined();
      expect(user.name).toBe('John');
    });

    it('should throw error with invalid email', () => {
      const userData = { name: 'John', email: 'invalid' };
      expect(() => UserService.createUser(userData)).toThrow();
    });
  });
});

// ❌ INCORRECTO
test('test 1', () => {
  const user = createUser({ name: 'John', email: 'john@example.com' });
  const result = user; // ¿Qué assert hacer?
});
```

---

## 6. ERRORES Y EXCEPCIONES

```javascript
// ✅ CORRECTO
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  validateEmail(email);
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn(`Validation failed: ${error.message}`);
  } else {
    logger.error('Unexpected error:', error);
  }
}

// ❌ INCORRECTO
try {
  // ...
} catch (e) {  // Variable genérica 'e'
  console.log(e);  // console.log en producción
}
```

---

## 7. COMENTARIOS

```javascript
// ✅ CORRECTO
/**
 * Calcula el IVA de un monto
 * @param {number} amount - Monto sin IVA
 * @returns {number} Monto con IVA incluido
 */
function calculateTax(amount: number): number {
  return amount * 0.21;
}

// ❌ INCORRECTO
// calculate tax - muy vago
function calculateTax(amount) {
  // multiply by 21% - comentario innecesario
  return amount * 0.21;
}
```

---

## 8. LINTER Y FORMATTER

### ESLint
```json
{
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Prettier
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
```

---

## ✅ CHECKLIST ANTES DE COMMIT

- [ ] Código pasa linter (`npm run lint`)
- [ ] Código está formateado (`npm run format`)
- [ ] Tests pasan (`npm test`)
- [ ] Coverage >= 80%
- [ ] Sin console.log en producción
- [ ] Nombres claros (sin `x`, `temp`, `data`)
- [ ] Funciones <= 20 líneas
- [ ] Commits con mensaje descriptivo

---

**VIGENTE DESDE**: 29 de Enero 2026
**REVISAR**: Cada sprint
