# 🚀 Guía de Ejecución - React e-Commerce

## ¿Cómo ejecutar el proyecto?

### Requisitos previos
- Node.js 16+ instalado
- npm o yarn

### Pasos para ejecutar

#### 1. **Navegar a la carpeta del proyecto**
```bash
cd curso-react-practico-clase-21
```

#### 2. **Instalar dependencias** (si no están instaladas)
```bash
npm install
```

#### 3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Verás output similar a:
```
  VITE v7.3.1  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### 4. **Abrir en el navegador**
- Abre tu navegador y ve a: **http://localhost:5173/**

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-----------|
| `npm run dev` | Inicia servidor de desarrollo con hot reload |
| `npm run build` | Genera build optimizado para producción |
| `npm run preview` | Vista previa del build producción |

---

## Estructura de Carpetas

```
curso-react-practico-clase-21/
├── src/
│   ├── Pages/          (Páginas principales)
│   ├── Components/     (Componentes reutilizables)
│   ├── Context/        (Estado global)
│   ├── utils/          (Funciones utilitarias)
│   ├── main.jsx        (Entrada)
│   └── index.css       (Estilos globales)
├── dist/               (Build producción)
├── public/             (Activos estáticos)
└── package.json        (Dependencias)
```

---

## Primer Uso - Guía Rápida

### 1️⃣ Crear Cuenta

1. Abre la app
2. Haz clic en **Sign In** (arriba a la derecha)
3. Elige **"Crear Cuenta Nueva"**
4. Completa:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: Min. 4 caracteres
5. Haz clic en **"Crear Cuenta"**

### 2️⃣ Buscar Productos

1. En el home, usa la barra de búsqueda
2. Escribe un producto (ej: "shirt", "laptop")
3. Verás sugerencias aparecer
4. O filtra por categoría (Clothes, Electronics, etc.)

### 3️⃣ Agregar al Carrito

1. Haz clic en una tarjeta de producto
2. Se abrirá el panel de detalle
3. Haz clic en **"Add to Cart"**
4. El carrito se abrirá automáticamente

### 4️⃣ Completar Compra

1. Con productos en el carrito, haz clic en **"Checkout"**
2. Se crea una orden automáticamente
3. El carrito se vacía
4. Puedes ver tus órdenes en **"My Orders"**

---

## Datos de Prueba

El proyecto usa una API pública de prueba. Algunos productos disponibles:

- **Electronics**: Laptops, phones, tablets
- **Clothes**: Shirts, jeans, jackets
- **Furniture**: Chairs, tables, desks
- **Toys**: Various toys and games

---

## Información Guardada Localmente

La app guarda automáticamente en tu navegador (localStorage):

- **Perfil**: Nombre, email, contraseña
- **Carrito**: Productos agregados
- **Órdenes**: Historial completo de compras
- **Sesión**: Estado de login

**Esto significa:**
✅ Si refrescas la página, todo se mantiene
✅ Si cierras el navegador, todo se guarda
✅ Los datos están solo en tu computadora

---

## Resolución de Problemas

### "API no carga productos"
- Verifica tu conexión a internet
- La app usa: `https://api.escuelajs.co/api/v1/products`
- Si la API está caída, intenta más tarde

### "No puedo hacer checkout"
- Debes estar autenticado (haz login primero)
- Debes tener al menos 1 producto en el carrito

### "Datos se borraron"
- Si limpias localStorage o el cache, se pierden
- En DevTools: Application > Storage > Clear All Site Data

### "Página no responde"
- Abre DevTools (F12) y verifica la consola
- Intenta hacer refresh (Ctrl+R)

---

## Estructura de Build

Después de ejecutar `npm run build`, se genera:

```
dist/
├── index.html           (Página principal)
├── assets/
│   ├── index-[hash].css (Estilos compilados)
│   └── index-[hash].js  (JavaScript compilado)
└── vite.svg            (Favicon)
```

**Tamaño total**: ~202 KB (62 KB comprimido)

---

## Variables de Entorno

Actualmente el proyecto no usa variables de entorno (perfecto para desarrollo).

Si necesitas agregar en el futuro, crea `.env`:

```env
VITE_API_URL=https://api.example.com
```

---

## Sugerencias para Desarrollo

### Herramientas Recomendadas

1. **VS Code Extensions**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - JavaScript (ES6) code snippets

2. **DevTools**
   - React Developer Tools (para componentes)
   - Redux DevTools (para estado)

### Scripts Útiles

**Para desarrollo con debug:**
```bash
npm run dev -- --debug
```

**Build con análisis:**
```bash
npm run build
npm run preview
```

---

## Deploy (Opcional)

Para publicar el proyecto:

```bash
# Generar build
npm run build

# Opción 1: Netlify
# Arrastra la carpeta `dist` a netlify.com

# Opción 2: Vercel
# npm install -g vercel
# vercel --prod

# Opción 3: GitHub Pages
# Sube a GitHub y configura Pages desde `dist`
```

---

## Soporte Técnico

Si tienes problemas:

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica npm: `npm --version`
3. Limpia cache: `npm cache clean --force`
4. Reinstala dependencias: `rm -rf node_modules && npm install`
5. Intenta con `npm run dev` nuevamente

---

## Cambios Recientes (2026)

✅ Todas las páginas completadas
✅ Componentes mejorados
✅ localStorage integrado
✅ Validaciones robustas
✅ Responsive design perfecto
✅ Build sin errores

---

## Próximos Pasos (Opcional)

Si quieres mejorar aún más:

1. **Backend Real**: Conectar a un servidor
2. **TypeScript**: Agregar tipado estático
3. **Testing**: Agregar tests unitarios
4. **PWA**: Hacer offline-first
5. **Analytics**: Tracking de eventos

---

## ¡Listo! 🎉

Tu proyecto React e-Commerce está completamente funcional. 

Disfruta desarrollando y recuerda:
- El servidor se recarga automáticamente cuando editas
- Los datos persisten en localStorage
- La API de productos es pública y gratuita
- El proyecto es responsive en todos los tamaños

**Happy coding!** 👨‍💻

---

*Última actualización: Enero 2026*
*Versión: 1.0.0*
*Estado: Producción Ready ✅*
