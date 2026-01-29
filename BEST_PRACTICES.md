# Mejores Prácticas - Sistema de Autenticación

## 🎯 Principios Implementados

### 1. Separación de Responsabilidades

#### Context (`src/Context/index.jsx`)
- Gestiona estado global de autenticación
- Maneja persistencia en localStorage
- Proporciona funciones de login/logout
- Inicializa estado al cargar la app

#### SignIn (`src/Pages/SignIn/index.jsx`)
- UI del formulario
- Validaciones de entrada
- Feedback visual al usuario
- Orquesta login/registro

#### Rutas (`src/Pages/App/index.jsx`)
- Define qué rutas requieren autenticación
- Usa estado del Context para decidir acceso
- Redirige automáticamente

---

### 2. Estado Inmutable

```javascript
// ✅ Correcto: crear nuevo objeto
context.login(newAccount)

// ❌ Evitar: mutar localStorage directamente
localStorage.setItem('account', JSON.stringify(data))
```

El Context es la única fuente de verdad.

---

### 3. Validación en Múltiples Niveles

```javascript
// Nivel 1: HTML5 (required, type="email")
<input type="email" required />

// Nivel 2: JavaScript (regex, longitud)
if (!validateEmail(email)) { }

// Nivel 3: Lógica (cuenta existe, contraseña correcta)
if (account.email !== email) { }
```

---

### 4. Manejo de Errores Robusto

```javascript
try {
  // Operación
} catch (err) {
  console.error('Error:', err)
  setError('Mensaje amigable para usuario')
}
```

Todos los accesos a localStorage tienen try-catch.

---

### 5. Estados Visuales Clara

| Estado | Elemento | Apariencia |
|--------|----------|-----------|
| Cargando | Inputs | `disabled:opacity-50` |
| Error | div | `bg-red-100 text-red-700` |
| Éxito | div | `bg-green-100 text-green-700` |
| Inactivo | Botón | Gris normal |
| Activo | Botón | Negro con hover |

---

## 🏗️ Arquitectura de Capas

```
User Interface
    ↓ (eventos)
SignIn Component
    ↓ (valida)
Context.login()
    ↓ (persiste)
localStorage
    ↓ (retrieve)
App Routes
    ↓ (protege)
Protected Pages
```

---

## 🔐 Seguridad

### Implementado ✅
- Validación de entrada (regex, longitud)
- Verificación de sesión activa
- Redirección de rutas protegidas
- Try-catch en operaciones críticas

### Para Producción ⚠️
Necesario implementar:
- Hash de contraseñas (bcrypt, argon2)
- JWT tokens con expiración
- HTTPS obligatorio
- Backend authentication
- Rate limiting (prevenir ataques de fuerza bruta)
- CORS policies
- CSRF tokens

---

## 🧠 Flujo de Estados

### Inicialización
```
App monta
  ↓
Context inicia useEffect
  ↓
Lee localStorage
  ↓
Establece: account, isAuthenticated, cartProducts, orders
  ↓
loading = false
  ↓
Componentes se renderizan con datos correctos
```

### Login
```
Usuario completa form
  ↓
SignIn valida inputs
  ↓
Verifica credenciales
  ↓
Context.login(account)
  ↓
setAccount(account)
setIsAuthenticated(true)
  ↓
useEffect persiste a localStorage
  ↓
Redirección a home
```

### Logout
```
Usuario click "Sign Out"
  ↓
Context.logout()
  ↓
setAccount(null)
setIsAuthenticated(false)
setCartProducts([])
  ↓
useEffect persiste cambios
  ↓
Redirección a home
```

---

## 📊 Estructura de Datos

### Account Object
```javascript
{
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "test1234"
}
```

### localStorage Keys
```javascript
{
  shopi_account: Account | null,
  shopi_is_authenticated: boolean,
  shopi_cart_products: Product[],
  shopi_orders: Order[]
}
```

---

## ✅ Validaciones

### Email
```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

✅ valido@example.com
✅ nombre.apellido@empresa.co.uk
❌ invalidemail
❌ @example.com
❌ email@
```

### Contraseña
```javascript
length >= 4

✅ test1234
✅ 1234
❌ 123
❌ (vacío)
```

### Nombre
```javascript
trim().length >= 2

✅ Juan
✅ María González
❌ A
❌ (espacios)
```

---

## 🎨 UI/UX Improvements

### Feedback Inmediato
- Error/éxito aparece antes de redirigir
- Inputs se deshabilitan durante procesamiento
- Botón muestra estado de carga

### Mensajes Claros
```
❌ "El email no es válido"
✅ "¡Login exitoso! Redirigiendo..."
```

No usar:
```
❌ "Error 400"
❌ "Invalid input"
❌ Generic errors
```

### Redirecciones Suaves
```javascript
// Esperar a mostrar mensaje antes de redirigir
setTimeout(() => navigate('/'), 1000)
```

---

## 🚀 Optimizaciones

### Performance
- No re-renders innecesarios (Context está bien estructurado)
- localStorage acceso mínimo (al inicializar y cambiar state)
- Componentes pequeños y enfocados

### UX
- Form reset en caso de error
- Cambio automático de vista (login ↔ registro)
- Redirección automática si ya autenticado

---

## 📝 Mejores Prácticas Aplicadas

| Práctica | Ubicación | Beneficio |
|----------|-----------|-----------|
| DRY (Don't Repeat Yourself) | STORAGE_KEYS const | Una fuente de verdad |
| Single Responsibility | Separación por componente | Mantenibilidad |
| Error Handling | Try-catch blocks | Estabilidad |
| Input Validation | Múltiples niveles | Seguridad |
| State Management | Context API | Sincronización |
| Async Patterns | useEffect, setTimeout | Feedback claro |
| Accessibility | htmlFor, aria-label | Usabilidad |
| Responsive | Tailwind classes | Mobile-first |

---

## 🔧 Configuración Recomendada

### .env (para el futuro)
```env
VITE_API_URL=http://localhost:3000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_SESSION_TIMEOUT=3600000
```

### vite.config.js
```javascript
// Configurar CORS proxy para desarrollo
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

---

## 🧪 Testing Estrategia

### Unit Tests (ideales para el futuro)
```javascript
describe('validateEmail', () => {
  it('debe aceptar emails válidos', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  
  it('debe rechazar emails inválidos', () => {
    expect(validateEmail('invalidemail')).toBe(false)
  })
})
```

### Integration Tests
- Login → Redireccionamiento → Home
- Logout → Limpiar localStorage → Redireccionamiento

### E2E Tests (Cypress/Playwright)
- Flujo completo desde registro
- Persistencia entre sesiones

---

## 📚 Referencias y Recursos

### React Context API
- Documentación oficial: https://react.dev/reference/react/useContext
- Patrones recomendados

### Validación
- Regex patterns: https://regexr.com
- HTML5 validation: https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation

### Seguridad
- OWASP: https://owasp.org/www-project-top-ten/
- Auth0 best practices

---

## ✨ Próximos Pasos (Opcional)

1. **Backend Integration**
   - Reemplazar localStorage con API calls
   - Implementar JWT tokens

2. **Enhanced Security**
   - Hash de contraseñas
   - Refresh tokens
   - Rate limiting

3. **Features Adicionales**
   - "Remember me"
   - "Forgot password"
   - Two-factor authentication
   - Social login

4. **Monitoring**
   - Error tracking (Sentry)
   - Analytics
   - Performance monitoring

---

**Versión**: 1.0
**Último update**: Implementación profesional
**Estado**: Listo para producción (con los cambios recomendados)
