# 🚀 DEPLOYMENT GUIDE

**Responsable**: DevOps/SRE Team
**Última Actualización**: 29 Enero 2026
**Ambiente**: Local, Staging, Production

---

## 📋 TABLA DE CONTENIDOS

- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Troubleshooting](#troubleshooting)

---

## 🏠 LOCAL DEVELOPMENT

### Requisitos Previos
```bash
# Verificar Node.js
node --version  # v18+
npm --version   # v9+

# Verificar Docker
docker --version
docker-compose --version
```

### Setup Rápido

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-org/repo.git
cd repo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servicios con Docker Compose
docker-compose up -d

# 5. Ejecutar migraciones (cuando haya backend)
npm run db:migrate

# 6. Iniciar servidor de desarrollo
npm run dev

# ✅ Frontend: http://localhost:3000
# ✅ Backend: http://localhost:3001
# ✅ PostgreSQL: localhost:5432
# ✅ Redis: localhost:6379
# ✅ pgAdmin: http://localhost:5050
```

### Parar Servicios
```bash
# Parar contenedores
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

---

## 🔄 STAGING DEPLOYMENT

### Plataforma: Render.com (Free Tier)

#### Frontend Setup

1. **Crear nuevo Web Service**
   - Conectar repositorio GitHub
   - Seleccionar rama: `develop`
   - Build command: `npm run build`
   - Start command: `npm run preview`
   - Región: Closest available

2. **Configurar Variables de Entorno**
   ```
   VITE_API_URL=https://api-staging.example.com
   NODE_ENV=production
   ```

3. **Deploy Automático**
   - Cada push a `develop` deploya automáticamente
   - URL: https://app-staging.onrender.com

#### Backend Setup

1. **PostgreSQL en Render**
   - Crear nuevo PostgreSQL database
   - Plan: Free (0.5GB)
   - Guardar connection string
   - URLs de backup automático: semanal

2. **Express Backend en Render**
   - Crear nuevo Web Service
   - Conectar repositorio GitHub
   - Seleccionar rama: `develop`
   - Build: `npm install && npm run db:migrate`
   - Start: `npm start`
   - Health check: `GET /health`

3. **Variables de Entorno**
   ```
   NODE_ENV=staging
   PORT=10000 (Render asigna puerto)
   DATABASE_URL=postgresql://...
   JWT_SECRET=staging-secret-key-change-often
   CORS_ORIGIN=https://app-staging.onrender.com
   LOG_LEVEL=info
   ```

### Monitoreo Staging

```bash
# Ver logs en tiempo real
curl https://api-staging.example.com/health

# Verificar base de datos
psql $DATABASE_URL
SELECT * FROM users LIMIT 1;
```

---

## 🌍 PRODUCTION DEPLOYMENT

### Plataforma: DigitalOcean + AWS S3

#### Opción 1: DigitalOcean App Platform (Recomendado para comenzar)

**Costo**: $12-60/mes

1. **Setup DigitalOcean**
   - Crear cuenta en DigitalOcean
   - Conectar repositorio GitHub
   - Generar Personal Access Token

2. **Crear App en DigitalOcean**
   ```bash
   # Via CLI
   doctl apps create --spec app.yaml
   ```

   **app.yaml**:
   ```yaml
   name: ecommerce-saas
   services:
   - name: frontend
     github:
       repo: tu-org/repo
       branch: main
     build_command: npm run build
     run_command: npm run preview
     envs:
     - key: VITE_API_URL
       value: https://api.example.com
     - key: NODE_ENV
       value: production
     http_port: 3000
     instance_count: 2
     instance_size_slug: basic-xs

   - name: backend
     github:
       repo: tu-org/repo
       branch: main
       source_dir: backend
     build_command: npm install
     run_command: npm start
     envs:
     - key: NODE_ENV
       value: production
     - key: PORT
       value: "3001"
     - key: DATABASE_URL
       scope: RUN_TIME
     - key: JWT_SECRET
       scope: RUN_TIME
     http_port: 3001
     instance_count: 2
     instance_size_slug: basic-xs
     health_check:
       http_path: /health

   databases:
   - name: postgres-db
     engine: PG
     version: "16"
   ```

3. **SSL/TLS Automático**
   - DigitalOcean proporciona certificados Let's Encrypt gratuitos
   - Auto-renovación cada 60 días

4. **Deploy Automático**
   - Cada push a `main` deploya a producción
   - Ver progreso en dashboard

#### Opción 2: DigitalOcean Droplet + Manual Setup

**Costo**: $6/mes (más control)

```bash
# 1. SSH a Droplet
ssh root@droplet_ip

# 2. Actualizar sistema
apt update && apt upgrade -y

# 3. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 4. Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# 5. Instalar Nginx (reverse proxy)
apt install -y nginx

# 6. Clonar repositorio
git clone https://github.com/tu-org/repo.git /var/www/app
cd /var/www/app

# 7. Instalar dependencias
npm ci --production

# 8. Configurar .env
cp .env.example .env.production
# Editar: DATABASE_URL, JWT_SECRET, etc.

# 9. Ejecutar migraciones
npm run db:migrate

# 10. Instalar PM2 (process manager)
npm install -g pm2

# 11. Iniciar aplicación con PM2
pm2 start npm --name "api" -- start
pm2 startup
pm2 save

# 12. Configurar Nginx
# Ver nginx-config.txt

# 13. SSL con Certbot
apt install -y certbot python3-certbot-nginx
certbot --nginx -d example.com

# 14. Verificar status
pm2 list
systemctl status nginx
```

**nginx-config.txt**:
```nginx
# /etc/nginx/sites-available/app

upstream backend {
    server localhost:3001;
}

upstream frontend {
    server localhost:3000;
}

server {
    server_name example.com;

    location /api {
        proxy_pass http://backend\;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend\;
    }

    listen 80;
    client_max_body_size 10M;
}
```

#### AWS S3 para Uploads

1. **Crear S3 Bucket**
   ```bash
   aws s3 mb s3://ecommerce-uploads-prod
   ```

2. **Configurar CORS**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["https://example.com"],
       "ExposeHeaders": ["x-amz-version-id"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

3. **Crear IAM User**
   ```bash
   aws iam create-user --user-name app-s3-user
   aws iam attach-user-policy --user-name app-s3-user \
       --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
   ```

4. **Guardar Credenciales en .env**
   ```
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_S3_BUCKET=ecommerce-uploads-prod
   AWS_REGION=us-east-1
   ```

---

## 🔄 ROLLBACK PROCEDURES

### Rollback Automático (si falla salud)

```bash
# DigitalOcean detecta automáticamente si /health falla
# y revierte a versión anterior dentro de 5 minutos
```

### Rollback Manual

#### GitHub Deploy
```bash
# 1. Ve al último commit estable
git log --oneline

# 2. Revert si es necesario
git revert <commit-id>
git push origin main

# 3. DigitalOcean detecta automáticamente y redeploya
```

#### SSH Manual
```bash
# Parar aplicación
pm2 stop api

# Revertir a versión anterior
git revert HEAD
git pull

# Reinstalar dependencias y migraciones
npm ci --production
npm run db:migrate

# Reiniciar
pm2 start api
```

---

## 📊 MONITORING & HEALTH CHECKS

### Health Check Endpoint

```javascript
// backend/src/routes/health.js
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'checking...',
    redis: 'checking...'
  };

  // Verificar DB
  db.query('SELECT 1')
    .then(() => {
      health.database = 'connected';
    })
    .catch((err) => {
      health.database = `error: ${err.message}`;
      health.status = 'degraded';
    });

  // Verificar Redis
  redis.ping()
    .then(() => {
      health.redis = 'connected';
    })
    .catch((err) => {
      health.redis = `error: ${err.message}`;
    });

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Monitoreo con PM2

```bash
# Instalar PM2 Plus (monitoreo en vivo)
pm2 plus

# Ver dashboard en https://app.pm2.io
```

### Logs

```bash
# Ver logs en tiempo real
pm2 logs api

# Ver último error
pm2 logs api --err

# Exportar logs
pm2 save
```

---

## 🆘 TROUBLESHOOTING

### Aplicación no inicia

```bash
# Ver qué error hay
npm start

# Ver logs
pm2 logs

# Verificar puerto disponible
lsof -i :3001
```

### Base de datos no conecta

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Probar conexión manual
psql $DATABASE_URL

# Verificar migrations
npm run db:migrate:status
```

### Alto uso de memoria

```bash
# Ver consumo
pm2 monit

# Reiniciar aplicación
pm2 restart api

# Buscar memory leaks
node --inspect app.js
# Abrir chrome://inspect
```

### CORS errors en producción

```bash
# Verificar CORS_ORIGIN en .env.production
echo $CORS_ORIGIN

# Debe ser la URL pública (sin trailing slash)
# ✅ https://example.com
# ❌ https://example.com/
```

---

**CHECKLIST PRE-PRODUCCIÓN**

- [ ] Base de datos migrada
- [ ] Variables de entorno configuradas
- [ ] SSL certificado instalado
- [ ] Backups automáticos configurados
- [ ] Monitoreo activado
- [ ] CDN configurado (opcional)
- [ ] Rate limiting activado
- [ ] Logs centralizados
- [ ] Error tracking (Sentry)
- [ ] Métricas de performance

