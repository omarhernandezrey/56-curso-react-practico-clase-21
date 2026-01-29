# Sistema de Autenticación Profesional

## 📋 Descripción General

Sistema de autenticación local completo implementado con React Context API, localStorage y validaciones robustas.

## 🏗️ Arquitectura

### Context API (`src/Context/index.jsx`)

El sistema central de estado con las siguientes características:

#### Estados de Autenticación
- `account`: Objeto con datos del usuario o `null`
- `isAuthenticated`: Booleano que indica si hay sesión activa
- `loading`: Estado de carga durante inicialización

#### Funciones de Autenticación
```javascript
login(accountData)     // Inicia sesión
logout()              // Cierra sesión y limpia el carrito
```

#### Persistencia
- **Almacenamiento**: localStorage con prefijo `shopi_`
- **Claves centralizadas**: STORAGE_KEYS object
- **Auto-sincronización**: useEffect hooks para persistencia automática
- **Manejo de errores**: Try-catch en todas las operaciones de almacenamiento

#### Características de Seguridad
- Separación clara entre `isAuthenticated` (booleano) y `account` (datos)
- Validación de estado en componentes protegidos
- Funciones de lectura/escritura con manejo de errores

### Formulario de Autenticación (`src/Pages/SignIn/index.jsx`)

#### Características
- ✅ **Validación de Email**: Regex pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- ✅ **Validación de Contraseña**: Mínimo 4 caracteres
- ✅ **Validación de Nombre**: Mínimo 2 caracteres
- ✅ **Confirmación de Contraseña**: Validación de coincidencia
- ✅ **Mensajes de Error/Éxito**: Estados visuales en el UI
- ✅ **Redirección Automática**: Si ya está autenticado
- ✅ **Loading State**: Desabilita inputs durante procesamiento

#### Flujos
1. **Login**: Valida email/contraseña contra cuenta guardada
2. **Registro**: Crea nueva cuenta con validaciones
3. **Cambio de Vista**: Toggle entre login y registro

#### Mensajes de Feedback
- Errores: "El email no es válido", "Las contraseñas no coinciden", etc.
- Éxito: "¡Login exitoso! Redirigiendo..."
- Automático: Redirección después de 1000-1500ms

## 🔐 Rutas Protegidas

Implementadas en `src/Pages/App/index.jsx`:

```
/my-account   → Requiere autenticación
/my-orders    → Requiere autenticación
/my-order     → Requiere autenticación
/sign-in      → Acceso público (pero redirige si autenticado)
```

Componentes que verifican autenticación:
- `MyAccount`: Valida `context.isAuthenticated && context.account`
- `CheckoutSideMenu`: Valida antes de checkout
- `App Routes`: Usa `Navigate` para redireccionamiento

## 💾 Datos Guardados

### localStorage Keys
```javascript
{
  'shopi_account': { name, email, password },
  'shopi_is_authenticated': true/false,
  'shopi_cart_products': [...],
  'shopi_orders': [...]
}
```

## 🎯 Flujo de Uso

### 1. Primer Acceso
```
Usuario → SignIn (registro) → Context.login() → localStorage → Home
```

### 2. Sesión Existente
```
App inicia → Context carga localStorage → Ruta protegida accesible
```

### 3. Logout
```
Usuario → Click "Sign Out" → Context.logout() → localStorage actualizado → Home
```

### 4. Cierre de Navegador
```
Usuario cierra navegador → localStorage persiste → Siguiente sesión recupera datos
```

## 🛡️ Validaciones

### Cliente (Frontend)
✅ Email válido (regex)
✅ Contraseña mínimo 4 chars
✅ Nombre mínimo 2 chars
✅ Contraseñas coinciden
✅ Campos no vacíos
✅ Cuenta debe existir para login

### Componentes Actualizados
1. **SignIn**: ✅ Usa `login()` y `logout()` del Context
2. **App**: ✅ Valida `isAuthenticated` para rutas
3. **MyAccount**: ✅ Redirige si no autenticado, usa `logout()`
4. **CheckoutSideMenu**: ✅ Valida antes de checkout

## 📦 Mejoras Implementadas

Desde el sistema anterior:

| Aspecto | Anterior | Nuevo |
|--------|----------|-------|
| Estado Auth | Objeto vacío `{}` | Booleano `isAuthenticated` |
| Funciones | `setSignOut()`, `setAccount()` | `login()`, `logout()` |
| localStorage | Lectura directa en componentes | Abstracción en Context |
| Errores | `alert()` | Mensajes en UI |
| Persistencia | Manual | Automática (useEffect) |
| Datos sensibles | Sin validación | Validación completa |

## 🚀 Compilación

✅ Build exitoso sin errores
✅ 0 warnings de compilación
✅ Desarrollo: `npm run dev` (sin errores)

## 📝 Notas

- Las contraseñas se guardan en texto plano en localStorage (solo para desarrollo)
- Para producción, implementar:
  - Hash de contraseñas (bcrypt)
  - JWT tokens
  - HTTPS
  - Backend authentication

## 🧪 Testing Manual

1. **Crear cuenta**: Email y contraseña válidos
2. **Login**: Usar mismas credenciales
3. **Editar perfil**: MyAccount
4. **Logout**: Botón Sign Out
5. **Protegidas**: Intentar acceder sin autenticación
6. **Checkout**: Solo con autenticación

---

**Estado**: ✅ Completo y funcional
**Último update**: Implementación profesional del sistema
