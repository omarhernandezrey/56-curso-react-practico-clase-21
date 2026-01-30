# Backend - eCommerce SaaS API

Backend de Node.js + Express para la plataforma eCommerce SaaS.

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Ejecutar migraciones Prisma
npx prisma migrate dev

# Generar Prisma Client
npx prisma generate

# Iniciar en desarrollo
npm run dev
```

## 📁 Estructura de Carpetas

```
src/
├── config/              # Configuración de la aplicación
│   ├── environment.ts   # Variables de entorno
│   ├── database.ts      # Conexión Prisma
│   └── logger.ts        # Logger Winston
├── middleware/          # Middlewares de Express
│   ├── auth.ts         # Autenticación JWT
│   ├── cors.ts         # CORS
│   ├── errorHandler.ts # Manejo de errores
│   ├── logging.ts      # Logging de requests
│   ├── rateLimit.ts    # Rate limiting
│   └── validation.ts   # Validación de entrada
├── routes/             # Rutas de la API
│   ├── health.routes.ts
│   └── index.ts
├── controllers/        # Controladores
├── services/          # Lógica de negocio (Phase 2)
├── shared/            # Código compartido
│   ├── constants/      # Constantes
│   ├── types/         # Tipos e interfaces
│   └── utils/         # Utilidades
├── database/          # Base de datos
│   └── prisma/        # Schema Prisma
└── app.ts             # Setup de Express
tests/
├── unit/              # Tests unitarios
└── integration/       # Tests de integración
```

## 🛠️ Scripts Disponibles

```bash
npm run dev              # Iniciar en desarrollo
npm run build           # Compilar TypeScript
npm start               # Iniciar producción
npm test                # Ejecutar tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Coverage de tests
npm run lint            # Verificar código
npm run format          # Formatear código
npm run prisma:migrate  # Crear migraciones
npm run prisma:generate # Generar Prisma Client
npm run prisma:studio   # Abrir Prisma Studio
npm run seed            # Llenar base de datos
```

## 🗄️ Base de Datos

### Modelos Principales

- **User** - Usuarios de la plataforma
- **Profile** - Perfil del usuario
- **Product** - Productos del catálogo
- **Order** - Órdenes de compra
- **OrderItem** - Items dentro de una orden
- **Store** - Información de la tienda

## 🔐 Autenticación

El backend usa JWT (JSON Web Tokens) para autenticación.

- Token en header: `Authorization: Bearer <token>`
- Roles: `USER`, `ADMIN`, `SELLER`

## 📝 API Endpoints

### Health Check
```
GET /health
```

### Fase 2 (Próximas semanas)
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Perfil actual
- `GET /api/products` - Listar productos
- `POST /api/orders` - Crear orden
- etc.

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests unitarios
npm test -- tests/unit

# Tests de integración
npm test -- tests/integration

# Con coverage
npm run test:coverage
```

## 📚 Documentación

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Jest Testing](https://jestjs.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribución

Por favor lee [CONTRIBUTING.md](../CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.
