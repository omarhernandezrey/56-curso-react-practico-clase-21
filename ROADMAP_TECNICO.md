# 🗺️ ROADMAP TÉCNICO - PLATAFORMA SAAS ECOMMERCE

**Este documento define exactamente qué se construye y en qué orden**

---

## 📅 TIMELINE GENERAL

```
Mes 1-2: FASE 1 (MVP) ........................ Tienda funcional básica
Mes 2-3: FASE 2 (Personalización) ........... Editor de temas
Mes 3-4: FASE 3 (Pagos) ..................... Integraciones reales
Mes 4-5: FASE 4 (Analytics) ................. Reportes y gráficos
Mes 5-6: FASE 5 (Optimización) .............. Performance y SEO
```

---

# FASE 1: MVP (Mes 1-2)

## Sprint 1.1: Setup & Infraestructura (Semana 1)

### Backend Setup
```bash
# Crear proyecto Node
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken
npm install postgresql prisma
npm install multer sharp aws-sdk
npm install -D nodemon typescript @types/express
```

### Estructura
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── products.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── productController.ts
│   ├── models/
│   │   └── User.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── services/
│   │   ├── imageService.ts
│   │   └── emailService.ts
│   └── app.ts
├── .env
├── .env.example
└── package.json
```

### Base de Datos (Prisma Schema)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String
  firstName       String
  lastName        String
  store           Store?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Store {
  id              String   @id @default(cuid())
  owner           User     @relation(fields: [ownerId], references: [id])
  ownerId         String   @unique
  name            String
  slug            String   @unique
  plan            String   @default("basico")
  categories      Category[]
  products        Product[]
  orders          Order[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Category {
  id              String   @id @default(cuid())
  store           Store    @relation(fields: [storeId], references: [id])
  storeId         String
  name            String
  slug            String
  orden           Int      @default(0)
  productos       Product[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([storeId, slug])
}

model Product {
  id              String   @id @default(cuid())
  store           Store    @relation(fields: [storeId], references: [id])
  storeId         String
  category        Category @relation(fields: [categoryId], references: [id])
  categoryId      String
  nombre          String
  slug            String
  descripcion     String   @db.Text
  precio          Float
  descuento       Float    @default(0)
  precioFinal     Float
  sku             String
  stock           Int      @default(0)
  imagenes        Image[]
  imagenPrincipal String?
  activo          Boolean  @default(true)
  destacado       Boolean  @default(false)
  enOferta        Boolean  @default(false)
  ordenItems      OrderItem[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([storeId, slug])
}

model Image {
  id              String   @id @default(cuid())
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  url             String
  urlMiniatura    String?
  tamano          Int
  createdAt       DateTime @default(now())
}

model Order {
  id              String   @id @default(cuid())
  store           Store    @relation(fields: [storeId], references: [id])
  storeId         String
  numeroOrden     String   @unique
  clienteNombre   String
  clienteEmail    String
  clienteTelefono String
  total           Float
  subtotal        Float
  impuesto        Float
  costoEnvio      Float
  items           OrderItem[]
  estado          String   @default("pendiente")
  estadoPago      String   @default("pendiente")
  direccion       String   @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model OrderItem {
  id              String   @id @default(cuid())
  order           Order    @relation(fields: [orderId], references: [id])
  orderId         String
  product         Product  @relation(fields: [productId], references: [id])
  productId       String
  cantidad        Int
  precioUnitario  Float
  subtotal        Float
}
```

### Frontend Setup
```bash
# Crear proyecto Vite React (ya lo tienes, pero actualizar)
npm install react-router-dom axios zustand @tanstack/react-query
npm install -D typescript @types/react @types/react-dom
```

### Tareas
- [ ] Repositorio Git creado
- [ ] Backend inicializado
- [ ] Base de datos PostgreSQL configurada
- [ ] Prisma migrations iniciales
- [ ] Frontend actualizado
- [ ] Variables de entorno definidas
- [ ] Docker opcional (para desarrollo)

---

## Sprint 1.2: Autenticación Backend (Semana 1-2)

### Endpoints
```
POST   /api/auth/register      Registrar usuario
POST   /api/auth/login         Login usuario
POST   /api/auth/refresh       Refrescar token
POST   /api/auth/logout        Logout
GET    /api/auth/me            Datos del usuario
```

### Implementar
```typescript
// src/routes/auth.ts
POST /register
- Body: { email, password, firstName, lastName, businessName }
- Validar email único
- Hash contraseña
- Crear usuario y tienda
- Enviar email confirmación
- Return: { token, refreshToken, user }

POST /login
- Body: { email, password }
- Validar credenciales
- Generar JWT token
- Return: { token, refreshToken, user }

POST /refresh
- Body: { refreshToken }
- Validar refresh token
- Generar nuevo token
- Return: { token }

GET /me (requires auth)
- Retorna datos usuario autenticado
```

### Middleware
```typescript
// src/middleware/auth.ts
- Verificar JWT token en header Authorization
- Extraer userId del token
- Añadir usuario al request
- Si token expirado, rechazar con 401
```

### Tareas
- [ ] POST /register implementado y testeado
- [ ] POST /login implementado y testeado
- [ ] Middleware de autenticación
- [ ] JWT tokens funcionando
- [ ] Refresh tokens implementados
- [ ] Contraseñas hasheadas correctamente

---

## Sprint 1.3: CRUD Básico de Productos (Semana 2)

### Endpoints
```
POST   /api/stores/{storeId}/products          Crear producto
GET    /api/stores/{storeId}/products          Listar productos
GET    /api/stores/{storeId}/products/{id}     Ver detalles
PUT    /api/stores/{storeId}/products/{id}     Editar producto
DELETE /api/stores/{storeId}/products/{id}     Eliminar producto
```

### Implementar
```typescript
POST /api/stores/{storeId}/products
- Body: { nombre, descripcion, precio, descuento, categoryId, sku, stock }
- Validaciones
- Crear producto
- Return: producto creado

GET /api/stores/{storeId}/products
- Query params: { page, limit, categoryId, search }
- Pagination
- Filtros
- Return: array de productos + total

GET /api/stores/{storeId}/products/{id}
- Return: producto completo con imágenes

PUT /api/stores/{storeId}/products/{id}
- Body: datos actualizados
- Validar propiedad de tienda
- Actualizar
- Return: producto actualizado

DELETE /api/stores/{storeId}/products/{id}
- Validar propiedad de tienda
- Eliminar imágenes asociadas
- Eliminar producto
- Return: { success: true }
```

### Tareas
- [ ] CRUD productos implementado
- [ ] Validaciones de datos
- [ ] Autorización (solo admin de tienda)
- [ ] Paginación
- [ ] Filtros por categoría

---

## Sprint 1.4: Upload de Imágenes (Semana 2-3)

### Implementar
```typescript
POST /api/stores/{storeId}/products/{id}/images
- Recibir archivo multipart
- Validar tipo (JPG, PNG, WebP)
- Validar tamaño (max 5MB)
- Redimensionar con Sharp
- Subir a AWS S3
- Guardar URL en BD
- Return: { url, id }

POST /api/upload
- Recibir archivo
- Procesar
- Subir a S3
- Return URL
```

### Configuración S3
```javascript
// .env
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=mi-bucket
```

### Utilidades
```typescript
// src/services/imageService.ts
- uploadToS3(file): Sube a S3
- resizeImage(file): Redimensiona
- optimizeImage(file): Comprime
- generateThumbnail(url): Genera miniatura
```

### Tareas
- [ ] AWS S3 configurado
- [ ] Multer setup
- [ ] Sharp configurado
- [ ] Upload funciona
- [ ] Imágenes optimizadas
- [ ] URLs generadas correctamente

---

## Sprint 1.5: Frontend - Autenticación (Semana 2-3)

### Componentes
```
/src
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx
├── components/
│   └── ProtectedRoute.jsx
└── context/
    └── AuthContext.jsx
```

### Implementar
```jsx
// LoginPage
- Form: email, password
- Submit a /api/auth/login
- Guard token en localStorage
- Redirige a dashboard

// RegisterPage
- Form: email, password, firstName, lastName, businessName
- Submit a /api/auth/register
- Email confirmación
- Redirige a login

// ProtectedRoute
- Verifica token
- Si no token → redirige a login
- Si válido → permite acceso

// Dashboard
- Bienvenida con nombre tienda
- Menu principal:
  - Productos
  - Órdenes
  - Configuración
  - Mis datos
```

### Context
```typescript
// AuthContext
- user: User | null
- token: string | null
- login(email, password)
- register(data)
- logout()
- isAuthenticated: boolean
```

### Tareas
- [ ] LoginPage completo
- [ ] RegisterPage completo
- [ ] AuthContext implementado
- [ ] ProtectedRoute funciona
- [ ] Dashboard básico

---

## Sprint 1.6: Frontend - Tienda Pública (Semana 3)

### Páginas
```
/
- HomePage: Productos destacados
- Navbar: Logo, categorías, search, carrito
- Footer: Básico

/products
- ProductsPage: Grid de productos
- Filtros por categoría
- Search

/products/{id}
- ProductDetailPage: Detalles
- Galería de imágenes
- Agregar al carrito

/cart
- CartPage: Listado de productos
- Editar cantidades
- Total
- Checkout (simple sin pago por ahora)
```

### Implementar
```jsx
// HomePage
- Fetch productos destacados
- Mostrar grid
- Links a categorías

// ProductsPage
- Fetch todos los productos
- Filtros
- Search
- Paginación

// ProductDetailPage
- Fetch producto por ID
- Galería de imágenes
- Botón "Agregar al carrito"
- Manejo de cantidad

// CartPage
- Items desde localStorage (Zustand store)
- Mostrar total
- Botón "Ir a checkout"

// Navbar
- Logo desde tienda config
- Categorías dinámicas
- Search
- Ícono carrito con cantidad

// Footer
- Links básicos
```

### Context/Store (Zustand)
```typescript
// store/cartStore.ts
- items: CartItem[]
- addItem(product, quantity)
- removeItem(productId)
- updateQuantity(productId, quantity)
- clearCart()
- getTotalPrice()

// store/productStore.ts
- products: Product[]
- categories: Category[]
- fetchProducts()
- fetchCategories()
- searchProducts(term)
```

### Tareas
- [ ] HomePage con productos
- [ ] ProductsPage con filtros
- [ ] ProductDetailPage
- [ ] CartPage
- [ ] Navbar dinámico
- [ ] Footer
- [ ] Search funciona
- [ ] Filtros funcionan

---

## Sprint 1.7: Checkout Básico (Semana 3-4)

### Página Checkout
```
Paso 1: Datos del cliente
- Nombre
- Email
- Teléfono

Paso 2: Dirección de envío
- Calle
- Ciudad
- Código postal
- País

Paso 3: Método de envío (simulado por ahora)
- Envío estándar ($5)
- Envío express ($10)

Paso 4: Revisión
- Resumen de productos
- Total
- Botón "Confirmar pedido"
```

### Backend
```
POST /api/stores/{storeId}/orders
- Body: { productos, cliente, direccion, metodoEnvio }
- Validar stock
- Crear orden
- Reducir stock
- Generar número de orden único
- Return: { id, numeroOrden }

GET /api/stores/{storeId}/orders
- Return: todas las órdenes (requiere auth)

GET /api/stores/{storeId}/orders/{id}
- Return: detalles orden
```

### Tareas
- [ ] CheckoutPage con steps
- [ ] POST /orders implementado
- [ ] Número de orden único generado
- [ ] Stock se reduce
- [ ] Confirmación de orden
- [ ] Email de confirmación (mock por ahora)

---

## Sprint 1.8: Admin Dashboard Básico (Semana 4)

### Páginas Admin
```
/admin
- Dashboard principal
- Resumen de ventas
- Últimas órdenes

/admin/productos
- Tabla de productos
- Botones: Crear, Editar, Eliminar

/admin/ordenes
- Tabla de órdenes
- Estado actual
- Link a detalles

/admin/configuracion
- Datos de negocio
- Métodos de envío
- Métodos de pago (mock)
```

### Implementar
```jsx
// AdminLayout
- Sidebar con navegación
- Contenido principal
- Logo y nombre tienda

// DashboardAdmin
- Resumen de ventas (total, cantidad órdenes)
- Últimas órdenes (tabla)
- Productos con bajo stock

// ProductosAdmin
- Tabla con todos los productos
- Columnas: Nombre, Precio, Stock, Acciones
- Botón: Crear producto nuevo
- Acciones: Editar, Eliminar

// ProductoForm
- Formulario para crear/editar
- Campos: nombre, descripción, precio, stock, categoría
- Upload de imágenes (drag & drop)
- Preview de imágenes
- Submit → POST /products o PUT /products/{id}

// OrdenesAdmin
- Tabla con órdenes
- Filtros: Estado, fecha
- Link a detalles orden
- Estado actual

// OrdenDetalle
- Información completa orden
- Productos ordenados
- Datos del cliente
- Dirección
- Dropdown para cambiar estado

// ConfiguracionAdmin
- Formulario con datos del negocio
- Nombre tienda
- Descripción
- Logo upload
- Teléfono, email
- Métodos de envío (simples por ahora)
```

### Tareas
- [ ] AdminLayout completo
- [ ] DashboardAdmin con resumen
- [ ] ProductosAdmin con tabla
- [ ] ProductoForm funciona
- [ ] Upload de imágenes
- [ ] OrdenesAdmin
- [ ] OrdenDetalle
- [ ] ConfiguracionAdmin

---

## Sprint 1.9: Testing y Pulido (Semana 4)

### Testing
- [ ] Tests de autenticación
- [ ] Tests de productos (CRUD)
- [ ] Tests de órdenes
- [ ] Tests de carrito
- [ ] Tests de checkout

### Pulido
- [ ] Manejo de errores uniforme
- [ ] Mensajes de error claros
- [ ] Loading states
- [ ] Validación de formularios
- [ ] Responsive design mobile
- [ ] Accesibilidad básica

### Documentation
- [ ] README actualizado
- [ ] Setup instructions
- [ ] Variábles de entorno documentadas
- [ ] API documentation

### Tareas
- [ ] Tests escritos
- [ ] Error handling implementado
- [ ] UI polished
- [ ] Mobile responsive
- [ ] Documentación actualizada

---

## Sprint 1.10: Deploy MVP (Semana 4)

### Preparación
- [ ] Variables de entorno configuradas
- [ ] Secrets seguros
- [ ] Base de datos migrada
- [ ] S3 configurado
- [ ] SSL certificate

### Deploy Backend
- Opción 1: Railway.app (recomendado para empezar)
- Opción 2: DigitalOcean
- Opción 3: Heroku

### Deploy Frontend
- Vercel (automático desde GitHub)
- O Netlify

### Tareas
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Domain configurado
- [ ] Email funciona
- [ ] Tests en producción

---

## ✅ FIN FASE 1

**MVP Funcional:**
- ✅ Sistema de autenticación
- ✅ CRUD de productos
- ✅ Upload de imágenes
- ✅ Tienda pública
- ✅ Carrito y checkout
- ✅ Gestión básica de órdenes
- ✅ Admin dashboard básico
- ✅ Deploy funcional

**Lo que NO incluye (para Fase 2+):**
- Pagos reales
- Personalización de temas
- Reportes avanzados
- 2FA
- Notificaciones por email (básico)

---

# FASE 2: PERSONALIZACIÓN (Mes 2-3)

## Sprint 2.1: Sistema de Temas (Semana 1-2)

### Backend
```
PUT /api/stores/{storeId}/theme
- Body: { colorPrincipal, colorSecundario, colorBotones }
- Actualizar en BD
- Return: tienda actualizada

PUT /api/stores/{storeId}/configuracion
- Editar nombre, descripción, logo
- Upload nuevo logo
```

### Frontend
```jsx
// SettingsTheme
- Color picker para colores
- Preview en tiempo real
- Save button
- Muestra resultado en tienda pública

// CustomizationPanel
- Editar nombre tienda
- Upload logo
- Editar datos de contacto
- Footer personalizado
```

### Tareas
- [ ] Campos de color en Store model
- [ ] Endpoints de theme
- [ ] Theme picker UI
- [ ] Preview de cambios
- [ ] Tienda pública respeta temas

---

## Sprint 2.2: Editor de "Quiénes Somos" (Semana 2-3)

### Backend
```
GET /api/stores/{storeId}/quienes-somos
PUT /api/stores/{storeId}/quienes-somos
- Título, subtítulo, contenido, misión, visión, valores
- Fotos upload
```

### Frontend
```jsx
// AboutUsEditor
- WYSIWYG editor para contenido
- Upload de fotos (galería)
- Preview en tiempo real
- Save changes

// Sobre Nosotros (Página pública)
- Muestra información editada
- Galería de fotos
- Diseño profesional
```

### Tareas
- [ ] Modelo About Us
- [ ] WYSIWYG editor integrado
- [ ] Página pública de About Us
- [ ] Foto gallery
- [ ] Preview funciona

---

## Sprint 2.3: Página Contacto (Semana 3)

### Backend
```
POST /api/stores/{storeId}/contact
- Body: { nombre, email, mensaje }
- Validaciones
- Enviar email al admin
- Guardar en BD (opcional)
```

### Frontend
```jsx
// ContactPage
- Formulario: Nombre, Email, Mensaje
- Validación
- Submit
- Mensaje de éxito

// ContactForm Component
- Reutilizable
- Integrado en diferentes páginas
```

### Tareas
- [ ] Modelo Contact Message
- [ ] Email service para contacto
- [ ] ContactPage
- [ ] Validación formulario
- [ ] Email enviado correctamente

---

## ✅ FIN FASE 2

**Funcionalidades Agregadas:**
- ✅ Sistema de temas/colores
- ✅ Editor de "Quiénes Somos"
- ✅ Página de contacto
- ✅ Customización básica

---

# FASE 3: PAGOS REALES (Mes 3-4)

## Sprint 3.1: Integración Stripe (Semana 1-2)

### Setup
```
npm install stripe
```

### Backend
```
POST /api/payment/create-intent
- Body: { amount, orderId }
- Crear payment intent en Stripe
- Return: clientSecret

POST /api/payment/confirm
- Webhook de Stripe
- Confirmar pago
- Actualizar orden a pagada
```

### Frontend
```jsx
// CheckoutPago
- Stripe Elements integrado
- Card input
- Botón Pay
- Manejo de errores

// PaymentStatus
- Loading mientras procesa
- Éxito o error
```

### Tareas
- [ ] Stripe account creado
- [ ] Keys configuradas
- [ ] Payment intents en backend
- [ ] Stripe Elements en frontend
- [ ] Webhooks funcionan
- [ ] Órdenes marcan como pagadas

---

## Sprint 3.2: Integración PayPal (Semana 2-3)

### Setup
```
npm install @paypal/checkout-server-sdk
```

### Backend
```
POST /api/payment/paypal/create-order
PUT /api/payment/paypal/capture-order
```

### Frontend
```jsx
// PayPalButton
- Botón PayPal
- Flujo de pago
```

### Tareas
- [ ] PayPal configurado
- [ ] Crear órdenes PayPal
- [ ] Capturar órdenes
- [ ] Actualizar estado orden

---

## ✅ FIN FASE 3

**Funcionalidades Agregadas:**
- ✅ Pagos con Stripe
- ✅ Pagos con PayPal
- ✅ Confirmación de pagos
- ✅ Seguridad PCI

---

# FASE 4: ANALYTICS Y REPORTES (Mes 4-5)

## Sprint 4.1: Dashboard de Vendedor (Semana 1)

### Métricas
```
- Ventas totales (mes, año)
- Órdenes totales
- Productos más vendidos
- Clientes activos
- Revenue por categoría
```

### Implementar
```jsx
// AnalyticsDashboard
- Tarjetas con métricas principales
- Gráficos de ventas (Chart.js o Recharts)
- Tabla de productos top
- Tabla de clientes top
```

### Tareas
- [ ] Endpoints analytics en backend
- [ ] Datos agregados desde órdenes
- [ ] Gráficos en frontend
- [ ] Filtros por fecha

---

## Sprint 4.2: Exportación de Reportes (Semana 2)

### Formatos
```
- PDF (jsPDF)
- Excel (xlsx)
- CSV
```

### Tareas
- [ ] PDF export funciona
- [ ] Excel export funciona
- [ ] CSV export funciona
- [ ] Incluye todos los datos

---

## ✅ FIN FASE 4

**Funcionalidades Agregadas:**
- ✅ Analytics dashboard
- ✅ Gráficos de ventas
- ✅ Exportación de reportes

---

# FASE 5: OPTIMIZACIÓN Y ESCALA (Mes 5-6)

## Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Cache strategy

## SEO
- [ ] Meta tags
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Structured data

## Mobile
- [ ] PWA (Progressive Web App)
- [ ] Offline support
- [ ] Push notifications

## Seguridad
- [ ] Rate limiting
- [ ] DDoS protection
- [ ] Encryption
- [ ] Backups automáticos

---

# 🎯 CONCLUSIÓN

Este roadmap técnico es la guía paso a paso para construir la plataforma.

**Cada sprint:**
1. Define exactamente qué se construye
2. Lista tareas específicas
3. Tiene dependencias claras
4. Tiene entregables verificables

**Siguiendo este plan:**
- ✅ No hay confusión
- ✅ Todos saben qué hacer
- ✅ Se evitan cambios de dirección
- ✅ Se mantiene la calidad
- ✅ Se cumplen deadlines

---

**¿Listo para empezar la Fase 1?**

📞 Próximo paso: Sprint 1.1 - Setup & Infraestructura
