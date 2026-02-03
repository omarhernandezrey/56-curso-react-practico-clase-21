# 🚀 Guía de Despliegue - Vercel + Railway/Render

## Arquitectura de Despliegue

```
Frontend (React + Vite) → Vercel
         ↓ (API calls)
Backend (Express) → Railway o Render
         ↓ (Database)
PostgreSQL → Railway Database o Supabase
```

---

## PARTE 1: Desplegar Frontend en Vercel

### Paso 1: Preparar el repositorio Git
```bash
cd /home/omarhernandez/personalProjects/56-curso-react-practico-clase-21
git status
git add .
git commit -m "feat: agregar configuración de Vercel"
git push origin main
```

### Paso 2: Conectar a Vercel
1. Ir a [https://vercel.com](https://vercel.com)
2. Hacer login con GitHub
3. Click en "Add New..." → "Project"
4. Seleccionar el repositorio `56-curso-react-practico-clase-21`
5. Vercel auto-detectará que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno en Vercel
En el dashboard de Vercel:

1. Ir a Settings → Environment Variables
2. Agregar:
   - **VITE_API_URL**: `https://tu-backend-url.com/api` (después de desplegar backend)
   - **VITE_APP_NAME**: `SaaS Ecommerce`
   - **VITE_APP_VERSION**: `1.0.0`
   - **VITE_LOG_LEVEL**: `warn`

3. Seleccionar ambientes: Production, Preview, Development

### Paso 4: Deploy
Click en "Deploy" → Vercel hará el build automáticamente

**Resultado**: Tu frontend estará en `https://tu-proyecto.vercel.app`

---

## PARTE 2: Desplegar Backend en Railway o Render

### Opción A: Railway (Recomendado)

#### Paso 1: Preparar Backend
```bash
cd backend
npm run build  # Compilar TypeScript
```

#### Paso 2: Crear cuenta Railway
1. Ir a [https://railway.app](https://railway.app)
2. Signup con GitHub
3. Click "New Project"

#### Paso 3: Configurar PostgreSQL
1. Click "+ Add" → PostgreSQL
2. Railway crea la BD automáticamente
3. Copiar la URL de conexión (DATABASE_URL)

#### Paso 4: Conectar repositorio
1. Click "+ Add" → GitHub Repo
2. Seleccionar el repositorio
3. Rama: `main`
4. Root Directory: `backend`

#### Paso 5: Variables de Entorno
En Railway:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=[copiada de PostgreSQL]
JWT_SECRET=[genera algo seguro: openssl rand -base64 32]
JWT_EXPIRATION=7d
CORS_ORIGIN=https://tu-frontend.vercel.app
LOG_LEVEL=info
API_URL=https://tu-backend-railway.up.railway.app
```

#### Paso 6: Deploy automático
Railway despliega automáticamente al hacer push a main

**Resultado**: Tu backend estará en `https://tu-backend-railway.up.railway.app/api`

---

### Opción B: Render

#### Paso 1: Crear cuenta
1. Ir a [https://render.com](https://render.com)
2. Signup con GitHub

#### Paso 2: Crear servicio Web
1. Click "New +" → "Web Service"
2. Conectar repositorio
3. Build Command: `cd backend && npm install && npm run build`
4. Start Command: `npm start`
5. Root Directory: `backend`

#### Paso 3: Variables de Entorno (en Render)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=[string seguro]
JWT_EXPIRATION=7d
CORS_ORIGIN=https://tu-frontend.vercel.app
LOG_LEVEL=info
API_URL=https://tu-backend-render.onrender.com
```

#### Paso 4: Base de datos PostgreSQL
1. Click "New +" → "PostgreSQL"
2. Copiar DATABASE_URL
3. Agregar a variables del Web Service

---

## PARTE 3: Actualizar URLs

### En Frontend (después de tener URLs finales)

**Archivo: `.env.production`**
```env
VITE_API_URL=https://tu-backend-url.com/api
```

O en Vercel → Settings → Environment Variables

### En Backend (después de tener URLs finales)

**Archivo: `.env.production` (crear si no existe)**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
CORS_ORIGIN=https://tu-frontend.vercel.app
API_URL=https://tu-backend-url.com
```

---

## PARTE 4: Verificar Despliegue

### Frontend
```bash
curl https://tu-frontend.vercel.app
```
Debería cargar la página HTML

### Backend
```bash
curl https://tu-backend-url.com/api/health
# o cualquier endpoint público
```

### Conexión Frontend-Backend
1. Abrir DevTools (F12)
2. Network → Hacer una acción (login, etc)
3. Verificar que las requests vayan a tu URL de backend

---

## Troubleshooting

### Error: "Cannot find module"
- Verificar que build command es correcto
- En Vercel: `npm run build`
- En Railway/Render: `npm run build` en package.json backend

### Error: "CORS error"
- Verificar CORS_ORIGIN en backend
- Debe ser exactamente tu URL de Vercel
- No incluir trailing slash: ✅ `https://tuapp.vercel.app` ❌ `https://tuapp.vercel.app/`

### Error: "Database connection failed"
- Verificar DATABASE_URL es válida
- Whitelist tu IP en la BD (si aplica)
- Verificar credenciales

### Error: "JWT_SECRET undefined"
- Asegurarse que la variable está en Environment Variables
- No está en `.env` en producción, debe estar en el dashboard

---

## Variables de Entorno - Resumen

### Frontend (.env.production)
```
VITE_API_URL=https://tu-backend-url.com/api
VITE_APP_NAME=SaaS Ecommerce
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=warn
```

### Backend (.env en producción - en dashboard, no en archivo)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=algo-super-seguro
JWT_EXPIRATION=7d
CORS_ORIGIN=https://tu-frontend.vercel.app
LOG_LEVEL=info
API_URL=https://tu-backend-url.com
```

---

## Checklist Final

- [ ] Frontend: Repositorio pusheado a main
- [ ] Frontend: Conectado a Vercel
- [ ] Frontend: Variables de entorno configuradas
- [ ] Frontend: Deploy exitoso
- [ ] Backend: Build compila sin errores
- [ ] Backend: Railway/Render account creado
- [ ] Backend: PostgreSQL configurada
- [ ] Backend: Variables de entorno configuradas
- [ ] Backend: Deploy exitoso
- [ ] Actualizar VITE_API_URL con URL real del backend
- [ ] Pruebas end-to-end funcionando

---

## URLs Finales (después de desplegar)

- **Frontend**: `https://tu-app.vercel.app`
- **Backend API**: `https://tu-backend.up.railway.app/api` (o tu-backend.onrender.com)
- **Database**: Gestionada por Railway/Render

---

## Próximos Pasos

1. Implementar monitoring y logs
2. Agregar CI/CD con GitHub Actions
3. Crear alias de dominio personalizado
4. Implementar backups automáticos de BD
5. Agregar SSL certificate (ya incluido en Vercel/Railway/Render)

