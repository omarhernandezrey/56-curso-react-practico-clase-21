# Inicialización del Proyecto ✅

## Estado Actual
El proyecto está **listo para desarrollar**. Las dependencias han sido instaladas y configuradas.

## Estructura
- **Frontend**: React + Vite + TailwindCSS (Puerto 5173)
- **Backend**: Node.js + Express + TypeScript + Prisma (Puerto 3001)

## Archivos de Configuración Creados
✅ `.env` - Variables de entorno del frontend

## Comandos para Desarrollar

### Frontend (en la raíz del proyecto)
```bash
npm run dev
```
Abre: http://localhost:5173

### Backend (en carpeta /backend)
```bash
cd backend
npm run dev
```
Servidor: http://localhost:3001
API: http://localhost:3001/api

## Configuración de Base de Datos
El backend usa PostgreSQL. Configuración en `backend/.env.development`:
- Host: postgres (Docker) / localhost (local)
- Puerto: 5432
- Usuario: postgres
- Contraseña: postgres
- Base de datos: ecommerce_dev

Si usas Docker Compose:
```bash
docker-compose up -d
```

## Variables de Entorno

### Frontend (.env - ya creado)
- `VITE_API_URL`: http://localhost:3001/api
- `VITE_APP_NAME`: SaaS Ecommerce
- `VITE_LOG_LEVEL`: debug

### Backend (backend/.env.development - ya existe)
- `NODE_ENV`: development
- `PORT`: 3001
- `DATABASE_URL`: postgresql://postgres:postgres@postgres:5432/ecommerce_dev
- `JWT_SECRET`: dev-secret-key-must-be-at-least-32-characters-long-12345
- `CORS_ORIGIN`: http://localhost:3000

## Scripts Disponibles

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build

### Backend
- `npm run dev` - Inicia el servidor con nodemon
- `npm run build` - Compilar TypeScript
- `npm run start` - Inicia servidor compilado
- `npm test` - Ejecutar tests
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:studio` - Abrir Prisma Studio

## Próximos Pasos

1. **Opción A - Con Docker** (Recomendado):
   ```bash
   docker-compose up -d
   cd backend
   npm run prisma:migrate
   ```

2. **Opción B - Local**:
   - Instalar PostgreSQL localmente
   - Crear base de datos `ecommerce_dev`
   - En `backend`: ejecutar `npm run prisma:migrate`

3. Iniciar frontend y backend en dos terminales

## Rutas Principales del Proyecto

- `/src` - Código del frontend React
- `/backend/src` - Código del backend Node.js
- `/backend/prisma` - Esquema y migraciones de base de datos
- `/public` - Assets estáticos

---
**Proyecto inicializado**: $(date)
