# 🛍️ E-Commerce Frontend Profesional con React

Aplicación e-commerce completa construida con **React 18**, **Tailwind CSS**, **React Router v6** y **Context API** con un sistema de autenticación profesional.

## ✨ Características Implementadas

### 🔐 Sistema de Autenticación Profesional
- ✅ Registro con validaciones (email, contraseña, nombre)
- ✅ Login seguro con credenciales
- ✅ Rutas protegidas (`/my-account`, `/my-orders`, `/my-order`)
- ✅ Gestión de sesión con Context API
- ✅ Persistencia en localStorage
- ✅ Sign out funcional

### 🛒 Carrito de Compras
- ✅ Agregar/eliminar productos
- ✅ Vista sidebar derecha
- ✅ Total de productos y precio
- ✅ Checkout protegido (requiere autenticación)
- ✅ Historial de órdenes

### 📦 Catálogo de Productos
- ✅ API integrada (escuelajs.co)
- ✅ Grid responsive de productos
- ✅ Búsqueda por título
- ✅ Filtrado por categoría

### 👤 Página de Perfil
- ✅ Ver información de cuenta
- ✅ Editar nombre, email, contraseña
- ✅ Sign out

### 📱 Diseño Responsive
- ✅ Mobile first
- ✅ Navbar adaptable
- ✅ Menú bottom para móvil

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm run dev

# Build para producción
npm run build
```

Abrir: http://localhost:5173/

## 📚 Documentación

### Sistema de Autenticación
- **[AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md)** - Guía técnica
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Casos de prueba
- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Mejores prácticas
- **[SUMMARY.md](./SUMMARY.md)** - Resumen ejecutivo

## 🛠️ Stack Tecnológico

- React 18
- React Router v6
- Context API
- Tailwind CSS
- Heroicons
- Vite 7.3.1

## 🔐 Validaciones

- **Email**: Formato válido (regex)
- **Contraseña**: Mínimo 4 caracteres
- **Nombre**: Mínimo 2 caracteres
- **Confirmación**: Coincidencia exacta

## 🧪 Testing

Ver **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** para instrucciones completas.

## 📊 Storage

```javascript
localStorage keys:
- shopi_account
- shopi_is_authenticated
- shopi_cart_products
- shopi_orders
```

## ✅ Estado del Proyecto

✅ Completo a nivel de frontend
✅ Documentación exhaustiva
✅ Listo para testing
⚠️ Requiere backend para producción

---

**Versión**: 1.0.0 | **Status**: ✅ Listo para usar
