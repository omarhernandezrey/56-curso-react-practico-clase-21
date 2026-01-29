# 🏗️ ARQUITECTURA EMPRESARIAL - GUÍA TÉCNICA DEFINITIVA

**Clasificación**: ARQUITECTURA TÉCNICA PARA EQUIPO DE DESARROLLO  
**Audiencia**: Tech Leads, Arquitectos, Senior Devs  
**Versión**: 1.0  
**Última Actualización**: 29 de Enero de 2026  

---

## TABLA DE CONTENIDOS

1. [Decisiones Arquitectónicas Clave](#decisiones-arquitectónicas-clave)
2. [C4 Model Completo](#c4-model-completo)
3. [Arquitectura Backend Detallada](#arquitectura-backend-detallada)
4. [Arquitectura Frontend Detallada](#arquitectura-frontend-detallada)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Data Flow](#data-flow)
7. [Decisiones de Escalabilidad](#decisiones-de-escalabilidad)
8. [Trade-offs Arquitectónicos](#trade-offs-arquitectónicos)

---

## DECISIONES ARQUITECTÓNICAS CLAVE (ADR)

### ADR-001: Stack Tecnológico

**Decisión**: React 18 + Node.js + PostgreSQL + Prisma

**Rationale**:
- React: Component-based, gran comunidad, performance
- Node.js: JavaScript isomorphic, npm ecosystem
- PostgreSQL: Relacional, ACID, escalable
- Prisma: Type-safe ORM, migraciones automáticas

**Alternativas Consideradas**:
- ❌ Vue.js: Menos experiencia en equipo
- ❌ Django: Requiere nuevo lenguaje (Python)
- ❌ MongoDB: No es relacional (necesitamos integridad)
- ❌ Sequelize: Menos type-safe que Prisma

**Status**: ✅ APROBADO

---

### ADR-002: Arquitectura Backend - MVC vs DDD vs Layered

**Decisión**: Arquitectura Layered (Controllers → Services → Repositories → DB)

**Motivación**:
```
┌──────────────────────────────────────┐
│  Controllers (HTTP Handler)          │ ← Request/Response
├──────────────────────────────────────┤
│  Services (Business Logic)           │ ← Reglas de negocio
├──────────────────────────────────────┤
│  Repositories (Data Access)          │ ← Abstracción de BD
├──────────────────────────────────────┤
│  Prisma Client (ORM)                │ ← Query builder
├──────────────────────────────────────┤
│  PostgreSQL Database                │ ← Persistencia
└──────────────────────────────────────┘
```

**Por qué NO DDD**:
- DDD es mejor para dominios muy complejos
- Nuestro negocio es relativamente lineal (ecommerce)
- Team size: 5-8 personas (DDD es para 15+)

**Por qué NO Microservicios**:
- Agregamos complejidad operacional
- No hay volumen que lo justifique
- Monolito modular es más simple para empezar
- Podemos splitear después si es necesario

**Status**: ✅ APROBADO

---

### ADR-003: State Management Frontend

**Decisión**: Zustand para global state (autenticación + carrito)

**Razón**:
```javascript
// ✅ Simple y type-safe
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (email, password) => { /* ... */ }
}))

// vs Redux (demasiado boilerplate)
// vs MobX (overkill para este proyecto)
// vs Context API (no optimizado para actualizaciones frecuentes)
```

**Alternativas**:
- ❌ Redux: Boilerplate excesivo
- ❌ MobX: Complejidad innecesaria
- ❌ Jotai: Buen pero menos popular

**Status**: ✅ APROBADO

---

### ADR-004: API Design

**Decisión**: REST API con JSON, sin GraphQL

**Rationale**:
```
✅ REST es estándar en industria
✅ JSON es lightweight
✅ GraphQL es overkill para este proyecto
✅ Cache HTTP más simple con REST
```

**Estructura de Endpoints**:
```
GET    /api/v1/products              - Listar productos
GET    /api/v1/products/:id          - Detalle de producto
POST   /api/v1/products              - Crear producto (admin)
PATCH  /api/v1/products/:id          - Actualizar (admin)
DELETE /api/v1/products/:id          - Eliminar (admin)

GET    /api/v1/orders                - Mis órdenes
POST   /api/v1/orders                - Crear orden
GET    /api/v1/orders/:id            - Detalle de orden

POST   /api/v1/auth/register         - Registrar usuario
POST   /api/v1/auth/login            - Login
POST   /api/v1/auth/refresh          - Refresh token
POST   /api/v1/auth/logout           - Logout

GET    /api/v1/users/me              - Perfil actual
PATCH  /api/v1/users/me              - Actualizar perfil
```

**Versionamiento**: `/api/v1/` permite cambios breaking sin afectar clientes antiguos

**Status**: ✅ APROBADO

---

### ADR-005: Autenticación & Autorización

**Decisión**: JWT + Refresh Tokens + Role-Based Access Control (RBAC)

**Flujo**:
```
┌──────────────────────────────────────────────────────────────┐
│ USER LOGIN                                                  │
├──────────────────────────────────────────────────────────────┤
│ 1. POST /api/v1/auth/login {email, password}               │
│ 2. Backend verifica credenciales                           │
│ 3. Genera 2 tokens:                                        │
│    - accessToken (15 minutos)                              │
│    - refreshToken (7 días, httpOnly cookie)                │
│ 4. Cliente guarda accessToken en localStorage              │
│ 5. Cada request lleva: Authorization: Bearer {token}       │
│                                                            │
│ CUANDO CADUCA (15 min):                                   │
│ 6. POST /api/v1/auth/refresh                              │
│ 7. Backend verifica refreshToken                           │
│ 8. Devuelve nuevo accessToken                              │
│                                                            │
│ ROLES:                                                    │
│ - BUYER: Puede comprar                                   │
│ - STORE_OWNER: Puede administrar su tienda               │
│ - ADMIN: Acceso total a sistema                          │
└──────────────────────────────────────────────────────────────┘
```

**Middleware de autenticación**:
```typescript
// Backend
middleware.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Frontend (Axios interceptor)
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})
```

**Status**: ✅ APROBADO

---

### ADR-006: Caching Strategy

**Decisión**: Redis para sesiones + HTTP cache headers

**Niveles de caché**:
```
┌─────────────────────────────────────────┐
│ 1. Browser Cache (HTTP Headers)         │ ← 1 hora
├─────────────────────────────────────────┤
│ 2. CDN Cache (CloudFlare)              │ ← 1 día
├─────────────────────────────────────────┤
│ 3. Redis Server Cache (Backend)         │ ← 15 minutos
├─────────────────────────────────────────┤
│ 4. Database Query (Last resort)        │ ← Direct hit
└─────────────────────────────────────────┘
```

**Qué cachear**:
- ✅ Productos (rara vez cambian)
- ✅ Categorías (nunca cambian)
- ✅ Sesiones de usuario
- ❌ Órdenes (datos en tiempo real)
- ❌ Inventario (debe ser siempre exacto)

**Status**: ✅ APROBADO

---

## C4 MODEL COMPLETO

### NIVEL 1: CONTEXT DIAGRAM

```
                    ┌─────────────┐
                    │   Usuario   │
                    │  (Comprador)│
                    └──────┬──────┘
                           │
                    ┌──────▼────────────┐
                    │ SAAS ECOMMERCE    │
                    │ PLATAFORMA        │
                    │ (Sistema)         │
                    └──────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐   ┌────────▼─────────┐ ┌────▼──────┐
   │ AWS S3  │   │  Stripe/PayPal   │ │ SendGrid  │
   │(Images) │   │  (Payments)      │ │ (Emails)  │
   └─────────┘   └──────────────────┘ └───────────┘
```

---

### NIVEL 2: CONTAINER DIAGRAM

```
┌──────────────────────────────────────────────────────────────┐
│                      Sistema SAAS                           │
│                                                              │
│  ┌──────────────────┐      ┌─────────────────────┐         │
│  │   Web Browser    │      │  Mobile Browser     │         │
│  │ (Cliente React)  │      │  (Cliente React)    │         │
│  └────────┬─────────┘      └────────┬────────────┘         │
│           │                         │                      │
│           └─────────────┬───────────┘                      │
│                         │                                  │
│          ┌──────────────▼──────────────┐                  │
│          │   API Gateway/Load          │                  │
│          │   Balancer (CloudFlare)     │                  │
│          └──────────────┬──────────────┘                  │
│                         │                                  │
│          ┌──────────────▼──────────────┐                  │
│          │   Express.js API Server     │                  │
│          │   (Backend)                 │                  │
│          └──────────────┬──────────────┘                  │
│                         │                                  │
│         ┌───────────────┼───────────────┐                 │
│         │               │               │                 │
│    ┌────▼────┐  ┌──────▼─────┐  ┌─────▼──────┐           │
│    │PostgreSQL│  │Redis Cache │  │S3 (Imágenes)           │
│    │Database  │  │(Sessions)  │  │          │           │
│    └──────────┘  └────────────┘  └────────────┘           │
│                                                              │
└──────────────────────────────────────────────────────────────┘

External Services:
- Stripe/PayPal: Pagos
- AWS S3: Almacenamiento
- SendGrid: Email
- CloudFlare: CDN
```

---

### NIVEL 3: COMPONENT DIAGRAM (Backend)

```
┌─────────────────────────────────────────────────────────┐
│              Express.js Application                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HTTP Request                                           │
│      │                                                 │
│      ▼                                                 │
│  ┌───────────────────────────────────────┐            │
│  │    Middleware Stack                   │            │
│  │ ├─ CORS                               │            │
│  │ ├─ Authentication (JWT Verify)        │            │
│  │ ├─ Input Validation (Zod/Joi)        │            │
│  │ ├─ Rate Limiting                      │            │
│  │ └─ Logging                            │            │
│  └───────────────────┬───────────────────┘            │
│                      │                                │
│      ┌───────────────┼────────────────┐              │
│      │               │                │              │
│      ▼               ▼                ▼              │
│  ┌────────┐  ┌───────────┐  ┌───────────────┐      │
│  │ Auth   │  │ Products  │  │ Orders        │      │
│  │Router  │  │ Router    │  │ Router        │      │
│  └───┬────┘  └─────┬─────┘  └───────┬───────┘      │
│      │             │               │              │
│      ▼             ▼               ▼              │
│  ┌────────┐  ┌───────────┐  ┌───────────────┐      │
│  │ Auth   │  │ Products  │  │ Orders        │      │
│  │Service │  │ Service   │  │ Service       │      │
│  └───┬────┘  └─────┬─────┘  └───────┬───────┘      │
│      │             │               │              │
│      ▼             ▼               ▼              │
│  ┌────────┐  ┌───────────┐  ┌───────────────┐      │
│  │ Auth   │  │ Products  │  │ Orders        │      │
│  │Repo    │  │ Repo      │  │ Repo          │      │
│  └───┬────┘  └─────┬─────┘  └───────┬───────┘      │
│      │             │               │              │
│      ▼             ▼               ▼              │
│  ┌──────────────────────────────────────────┐      │
│  │        Prisma Client                     │      │
│  └──────────────────┬───────────────────────┘      │
│                    │                              │
│                    ▼                              │
│  ┌──────────────────────────────────────────┐      │
│  │    PostgreSQL Database                   │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
└─────────────────────────────────────────────────────┘
```

---

### NIVEL 4: CLASS DIAGRAM (Modelos Principales)

```typescript
// User Entity
User {
  - id: string (PK)
  - email: string (UNIQUE)
  - passwordHash: string
  - firstName: string
  - lastName: string
  - role: 'BUYER' | 'STORE_OWNER' | 'ADMIN'
  - createdAt: DateTime
  - updatedAt: DateTime
  - stores: Store[] (relation)
  - orders: Order[] (relation)
}

// Store Entity (Multi-tenancy)
Store {
  - id: string (PK)
  - ownerId: string (FK)
  - name: string
  - slug: string (UNIQUE)
  - plan: 'free' | 'pro' | 'enterprise'
  - categories: Category[] (relation)
  - products: Product[] (relation)
  - orders: Order[] (relation)
  - createdAt: DateTime
  - updatedAt: DateTime
}

// Product Entity
Product {
  - id: string (PK)
  - storeId: string (FK)
  - categoryId: string (FK)
  - name: string
  - slug: string (UNIQUE per store)
  - description: string
  - price: float
  - discount: float
  - finalPrice: float (calculated)
  - sku: string
  - stock: int
  - isFeatured: boolean
  - isOnSale: boolean
  - images: Image[] (relation)
  - createdAt: DateTime
  - updatedAt: DateTime
}

// Order Entity
Order {
  - id: string (PK)
  - storeId: string (FK)
  - orderNumber: string (UNIQUE)
  - customerName: string
  - customerEmail: string
  - subtotal: float
  - tax: float
  - shipping: float
  - total: float
  - status: 'pending' | 'processing' | 'shipped' | 'delivered'
  - paymentStatus: 'pending' | 'completed' | 'failed'
  - items: OrderItem[] (relation)
  - createdAt: DateTime
  - updatedAt: DateTime
}
```

---

## ARQUITECTURA BACKEND DETALLADA

### Estructura de Carpetas FINAL

```
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.ts          # Prisma client singleton
│   │   ├── environment.ts       # Env validation + type
│   │   └── logger.ts            # Winston configuration
│   │
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── errorHandler.ts      # Global error middleware
│   │   ├── validation.ts        # Input validation (Zod)
│   │   ├── cors.ts              # CORS configuration
│   │   ├── rateLimit.ts         # Rate limiting
│   │   └── logging.ts           # Request logging
│   │
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.routes.ts       # Auth endpoints
│   │   ├── products.routes.ts   # Product endpoints
│   │   ├── orders.routes.ts     # Order endpoints
│   │   ├── users.routes.ts      # User endpoints
│   │   └── stores.routes.ts     # Store endpoints
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── users.controller.ts
│   │   └── stores.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts      # Register, login, validation
│   │   ├── products.service.ts  # CRUD productos
│   │   ├── orders.service.ts    # CRUD órdenes
│   │   ├── users.service.ts     # Perfil de usuario
│   │   ├── email.service.ts     # SendGrid integration
│   │   ├── payment.service.ts   # Stripe/PayPal
│   │   ├── image.service.ts     # Upload + S3
│   │   └── cache.service.ts     # Redis operations
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   ├── order.repository.ts
│   │   └── store.repository.ts
│   │
│   ├── types/
│   │   ├── errors.ts            # Custom error classes
│   │   ├── responses.ts         # Response DTOs
│   │   ├── auth.types.ts        # Auth types
│   │   └── index.ts             # Exports
│   │
│   ├── utils/
│   │   ├── validators.ts        # Email, password, etc
│   │   ├── helpers.ts           # Utility functions
│   │   ├── jwt.ts               # Token generation
│   │   └── formatters.ts        # Response formatting
│   │
│   ├── guards/
│   │   ├── auth.guard.ts        # Require authentication
│   │   ├── role.guard.ts        # Role-based access
│   │   └── owner.guard.ts       # Store owner verification
│   │
│   ├── exceptions/
│   │   ├── AppError.ts          # Base error class
│   │   ├── ValidationError.ts
│   │   ├── AuthError.ts
│   │   ├── NotFoundError.ts
│   │   └── UnauthorizedError.ts
│   │
│   ├── constants/
│   │   ├── messages.ts
│   │   ├── statusCodes.ts
│   │   └── limits.ts
│   │
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── seeders/
│   │       ├── seed.ts
│   │       ├── users.seed.ts
│   │       ├── stores.seed.ts
│   │       ├── products.seed.ts
│   │       └── orders.seed.ts
│   │
│   └── app.ts                  # Express app setup
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── utils/
│   │   └── helpers.test.ts
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── products.test.ts
│   │   └── orders.test.ts
│   └── fixtures/
│       └── mock-data.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .env.example
├── .env.test
├── .env.development
├── tsconfig.json
├── jest.config.js
├── package.json
└── server.ts                   # Entry point
```

### Flujo de Request típico

```
HTTP REQUEST
    │
    ▼
┌──────────────────────────────┐
│ CORS Middleware              │
│ (Validate origin)            │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Logging Middleware           │
│ (Log request, UUID)          │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Rate Limit Middleware        │
│ (Check IP rate)              │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Auth Middleware              │
│ (Verify JWT token)           │
│ (Attach user to req)         │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Router (Route Matching)      │
│ (e.g., POST /products)       │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Controller                   │
│ (Extract params/body)        │
│ (Call service)               │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Service (Business Logic)     │
│ (Validation)                 │
│ (Check permissions)          │
│ (Call repository)            │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Repository                   │
│ (Data access)                │
│ (Prisma calls)               │
│ (Cache check)                │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ PostgreSQL Database          │
│ (Query execution)            │
│ (Return data)                │
└──────────────────────────────┘
    │
    ▼ (Response bubbles back)
┌──────────────────────────────┐
│ Error Handler Middleware     │
│ (Catch exceptions)           │
│ (Format error response)      │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Response Sent to Client      │
│ (JSON format)                │
│ (Status code 200/400/500)    │
└──────────────────────────────┘
```

---

## ARQUITECTURA FRONTEND DETALLADA

### Estructura de Carpetas FINAL

```
frontend/
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── common/              # Reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── layout/              # Layout structure
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── features/            # Domain-specific
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignUpForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── ProductFilter.tsx
│   │   │   │   └── ProductGallery.tsx
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── CartIcon.tsx
│   │   │   │   ├── CartSideMenu.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   │
│   │   │   ├── checkout/
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── ShippingForm.tsx
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   ├── OrderReview.tsx
│   │   │   │   └── OrderConfirmation.tsx
│   │   │   │
│   │   │   └── user/
│   │   │       ├── UserProfile.tsx
│   │   │       ├── OrderHistory.tsx
│   │   │       ├── OrderDetail.tsx
│   │   │       └── SettingsPanel.tsx
│   │   │
│   │   └── __stories__/         # Storybook stories
│   │       ├── Button.stories.tsx
│   │       └── Modal.stories.tsx
│   │
│   ├── pages/                   # Full page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── ThankYou.tsx
│   │   ├── Orders.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useFetch.ts
│   │   ├── useForm.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── authStore.ts         # Auth state
│   │   ├── cartStore.ts         # Cart state
│   │   ├── notificationStore.ts # Toast notifications
│   │   └── filtersStore.ts      # Product filters
│   │
│   ├── services/                # API calls
│   │   ├── api.ts               # Axios instance
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── orders.service.ts
│   │   ├── users.service.ts
│   │   └── payment.service.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   ├── auth.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                   # Utilities
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   └── currency.ts
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   ├── config/
│   │   ├── routes.tsx           # Route definitions
│   │   ├── env.ts               # Environment variables
│   │   └── constants.ts         # App constants
│   │
│   ├── context/                 # Context API (if needed)
│   │   └── ThemeContext.tsx
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global CSS
│
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── services/
│   ├── integration/
│   │   ├── auth.test.tsx
│   │   ├── products.test.tsx
│   │   └── checkout.test.tsx
│   └── e2e/                     # Cypress tests
│       └── checkout.cy.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.example
├── tsconfig.json
├── jest.config.js
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── index.html
```

### State Management con Zustand

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'BUYER' | 'STORE_OWNER' | 'ADMIN';
}

interface AuthStore {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true
          });
        } catch (error) {
          set({ isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false
        });
      },

      setUser: (user) => {
        set({ user });
      },

      refreshToken: async () => {
        try {
          const response = await authService.refresh();
          set({ accessToken: response.accessToken });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          const user = await authService.me();
          set({ user, isAuthenticated: true });
        } catch {
          set({ isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user
      })
    }
  )
);
```

---

## PATRONES DE DISEÑO

### 1. Repository Pattern

```typescript
// Interface
interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductDTO): Promise<Product>;
  update(id: string, data: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
}

// Implementation
class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: { images: true, category: true }
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true }
    });
  }

  // ... other methods
}
```

### 2. Dependency Injection

```typescript
// Service receives dependencies through constructor
class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private cacheService: ICacheService,
    private imageService: IImageService
  ) {}

  async getProduct(id: string): Promise<Product> {
    // Try cache first
    const cached = await this.cacheService.get(`product:${id}`);
    if (cached) return cached;

    // Then database
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');

    // Cache result
    await this.cacheService.set(`product:${id}`, product, 3600);

    return product;
  }
}

// In controller
const productRepository = new ProductRepository(prisma);
const cacheService = new CacheService(redis);
const imageService = new ImageService();
const productService = new ProductService(
  productRepository,
  cacheService,
  imageService
);
```

### 3. Factory Pattern

```typescript
// Service Factory
class ServiceFactory {
  static createAuthService(): IAuthService {
    const userRepository = new UserRepository(prisma);
    const emailService = new EmailService();
    return new AuthService(userRepository, emailService);
  }

  static createProductService(): IProductService {
    const productRepository = new ProductRepository(prisma);
    const cacheService = new CacheService(redis);
    return new ProductService(productRepository, cacheService);
  }
}

// Usage
const authService = ServiceFactory.createAuthService();
const productService = ServiceFactory.createProductService();
```

### 4. Observer Pattern (para eventos)

```typescript
// Event Emitter
import { EventEmitter } from 'events';

class OrderEventEmitter extends EventEmitter {
  emitOrderCreated(order: Order) {
    this.emit('order:created', order);
  }

  emitOrderShipped(order: Order) {
    this.emit('order:shipped', order);
  }

  onOrderCreated(callback: (order: Order) => void) {
    this.on('order:created', callback);
  }
}

// Usage
const orderEvents = new OrderEventEmitter();

// When order is created
orderEvents.emitOrderCreated(order);

// Listeners subscribe
orderEvents.onOrderCreated((order) => {
  sendConfirmationEmail(order);
});

orderEvents.onOrderCreated((order) => {
  updateInventory(order);
});
```

---

## DATA FLOW

### Flujo de Compra Completo

```
┌────────────────────────────────────────────────────────────┐
│ 1. Usuario vé productos (GET /api/v1/products)            │
│    Frontend: ProductList → productService.getAll()        │
│    Backend: Router → Controller → Service → Repository     │
│    Response: Array de productos                            │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 2. Agregar a carrito (Frontend state)                      │
│    cartStore.addItem(product)                              │
│    Se guarda en Zustand store (en memoria)                 │
│    También localStorage (persistencia)                      │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 3. Usuario hace checkout (POST /api/v1/orders)            │
│    Frontend: Checkout → CheckoutForm → orderService.create│
│    Body: {                                                  │
│      items: [{productId, quantity}],                       │
│      shippingAddress: {...},                              │
│      paymentToken: "tok_..."                              │
│    }                                                        │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Backend procesa orden                                   │
│    ├─ Validar items en stock                              │
│    ├─ Procesar pago con Stripe                            │
│    ├─ Crear Order + OrderItems en BD                      │
│    ├─ Actualizar stock de productos                       │
│    ├─ Enviar email de confirmación                        │
│    └─ Retornar orden con ID                               │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 5. Frontend muestra confirmación                           │
│    cartStore.clear()                                       │
│    Mostrar "Gracias por tu compra"                        │
│    Navegar a /orders/{orderId}                            │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 6. Usuario ve historial (GET /api/v1/orders)              │
│    Frontend: OrderHistory → orderService.getUserOrders()   │
│    Backend: Retorna todas las órdenes del usuario          │
└────────────────────────────────────────────────────────────┘
```

---

## DECISIONES DE ESCALABILIDAD

### Horizontal Scaling (Múltiples servidores)

```
         ┌─────────────────────┐
         │   CloudFlare CDN    │
         │   (Load Balancer)   │
         └──────────┬──────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼──┐  ┌────▼──┐  ┌───▼───┐
    │Express│  │Express│  │Express│
    │Server1│  │Server2│  │Server3│
    └────┬──┘  └────┬──┘  └───┬───┘
         │          │          │
         └──────────┼──────────┘
                    │
         ┌──────────▼──────────┐
         │ Shared PostgreSQL   │
         │ (RDS Multi-AZ)      │
         └─────────────────────┘
                    │
         ┌──────────▼──────────┐
         │ Shared Redis        │
         │ (Sessions + Cache)  │
         └─────────────────────┘
```

### Vertical Scaling (Índices de BD)

```sql
-- Crear índices para queries frecuentes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_active ON products(store_id, active) 
  WHERE active = true;
CREATE INDEX idx_orders_user_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Compound indexes para queries complejas
CREATE INDEX idx_products_search ON products(
  store_id, 
  name, 
  active
);
```

---

## TRADE-OFFS ARQUITECTÓNICOS

### ¿Monolito vs Microservicios?

**Decisión**: MONOLITO en Fase 1, Microservicios después

**Análisis**:

```
┌─────────────────────────────────────────────────────────────┐
│                   MONOLITO (Fase 1-2)                       │
├─────────────────────────────────────────────────────────────┤
│ VENTAJAS:                                                   │
│ ✅ Deployment simple (un solo artifact)                     │
│ ✅ Testing más fácil (sin red)                             │
│ ✅ Debugging más simple                                     │
│ ✅ Transacciones ACID garantizadas                         │
│ ✅ Performance más alta (no hay latencia de red)           │
│                                                             │
│ DESVENTAJAS:                                               │
│ ❌ Escalabilidad limitada al inicio                        │
│ ❌ Un bug puede caer todo                                  │
│ ❌ Difícil cambiar un servicio sin tocar otros            │
│ ❌ Stack tecnológico único                                 │
│                                                             │
│ MÉTRICAS:                                                   │
│ - Deployment time: 5 mins                                  │
│ - Rollback time: 2 mins                                    │
│ - Complexity: ⭐ (baja)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              MICROSERVICIOS (Fase 4+)                       │
├─────────────────────────────────────────────────────────────┤
│ VENTAJAS:                                                   │
│ ✅ Escalabilidad independiente                             │
│ ✅ Equipos independientes                                  │
│ ✅ Stack tecn específico por servicio                      │
│ ✅ Un servicio falla, otros funcionan                      │
│                                                             │
│ DESVENTAJAS:                                               │
│ ❌ Operational complexity (orchestration, monitoring)      │
│ ❌ Latencia de red entre servicios                         │
│ ❌ Transactions distribuidas (difíciles)                   │
│ ❌ Debugging distribuido (complejidad)                     │
│ ❌ Replicación de código común                             │
│                                                             │
│ MÉTRICAS:                                                   │
│ - Deployment time: 15 mins                                 │
│ - Rollback time: 10 mins                                   │
│ - Complexity: ⭐⭐⭐⭐⭐ (muy alta)                        │
└─────────────────────────────────────────────────────────────┘
```

### ¿SQL vs NoSQL?

**Decisión**: PostgreSQL SQL (relacional)

| Aspecto | PostgreSQL | MongoDB |
|---------|-----------|---------|
| Transacciones | ✅ ACID | ❌ Eventual consistency |
| Joins | ✅ Rápidos | ❌ Complejos |
| Validación | ✅ Schema enforcement | ❌ Flexible (riesgo) |
| Escalabilidad horiz | ⚠️ Difícil | ✅ Fácil |
| Precio | ✅ Gratis/barato | ❌ Caro a escala |

**Para nuestro caso**: SQL es mejor (ecommerce requiere integridad)

---

## DECISIONES PENDIENTES POR TOMAR

1. **¿ORM con Prisma o Query Builder con Knex?**
   - Recomendación: Prisma (mejor type-safety)

2. **¿Server-side rendering (SSR) con Next.js?**
   - Recomendación: NO en Fase 1 (agregar complejidad)
   - Considerar en Fase 3 para SEO

3. **¿GraphQL además de REST?**
   - Recomendación: NO (REST es suficiente)

4. **¿Testing con Playwright o Cypress?**
   - Recomendación: Cypress (más maduro para ecommerce)

5. **¿Containerizar todo con Docker?**
   - Recomendación: SÍ desde el inicio

---

**FIN DE DOCUMENTO DE ARQUITECTURA**

Próximo paso: Crear los templates de código base (backend scaffold).
