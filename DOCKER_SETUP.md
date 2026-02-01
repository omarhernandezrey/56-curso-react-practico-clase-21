# 🐳 Docker Setup - Guía Completa

## Descripción General

Este proyecto utiliza Docker para containerizar tanto el frontend (React + Vite) como el backend (Node.js + Express) con soporte completo para desarrollo y producción.

### Contenedores Incluidos

- **Frontend**: React con Vite (puerto 3000)
- **Backend**: Node.js + Express (puerto 3001)
- **PostgreSQL**: Base de datos principal (puerto 5432)
- **Redis**: Cache en memoria (puerto 6379)
- **pgAdmin**: UI para PostgreSQL (puerto 5050) - solo desarrollo

---

## 📋 Requisitos Previos

- Docker Desktop instalado (v20.10+)
- Docker Compose (v1.29.0+)
- Git configurado
- Al menos 4GB de RAM disponible
- Puertos 3000, 3001, 5432, 6379 disponibles

**Verificar instalación:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Inicio Rápido

### 1. Desarrollo Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd proyecto

# Crear archivo .env con variables de desarrollo
cp .env.example .env

# Construir e iniciar los contenedores
docker-compose up --build

# En otra terminal, ejecutar migraciones (si aplica)
docker-compose exec backend npm run migrate
```

**URLs de acceso:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- pgAdmin: http://localhost:5050
- Base de datos: localhost:5432

### 2. Detener Contenedores

```bash
# Pausar servicios (preserva datos)
docker-compose stop

# Parar y eliminar contenedores
docker-compose down

# Eliminar también volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

---

## 📦 Archivos Docker Principales

### Estructura

```
proyecto/
├── Dockerfile                 # Frontend production
├── docker-compose.yml         # Desarrollo
├── docker-compose.prod.yml    # Producción
├── .dockerignore             # Archivos a ignorar
└── backend/
    ├── Dockerfile            # Backend production
    ├── Dockerfile.dev        # Backend desarrollo
    └── .dockerignore
```

---

## 🔧 Configuración Detallada

### Development (docker-compose.yml)

**Características:**
- Hot reload habilitado
- Volúmenes locales para desarrollo rápido
- Variables de entorno para desarrollo
- Todos los servicios (frontend, backend, DB, Redis, pgAdmin)

**Variables de entorno incluidas:**
```yaml
Frontend:
  - VITE_API_URL=http://localhost:3001
  - NODE_ENV=development

Backend:
  - NODE_ENV=development
  - PORT=3001
  - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecommerce_dev
  - JWT_SECRET=dev-secret-key-must-be-at-least-32-characters-long-12345
  - CORS_ORIGIN=http://localhost:3000
  - LOG_LEVEL=debug
```

### Production (docker-compose.prod.yml)

**Características:**
- Sin volúmenes locales (datos inmutables)
- Imágenes multietapa optimizadas
- Reinicio automático en caso de error
- Logs simplificados
- Variables de entorno externalizadas

**Cambios respecto a desarrollo:**
- Puerto frontend mapeado a 80 (HTTP)
- URLs reales en lugar de localhost
- Sin pgAdmin
- Validación de seguridad mejorada

---

## 🛠️ Comandos Útiles

### Construcción y Ejecución

```bash
# Construir imágenes sin iniciar
docker-compose build

# Iniciar en background
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Construir y ejecutar sin cache
docker-compose up --build --no-cache
```

### Administración de Servicios

```bash
# Listar contenedores activos
docker-compose ps

# Ejecutar comando en un contenedor
docker-compose exec backend npm run migrate

# Acceder a bash en un contenedor
docker-compose exec backend bash

# Recrear un servicio
docker-compose up --force-recreate backend

# Detener un servicio específico
docker-compose stop backend
```

### Base de Datos

```bash
# Acceder a PostgreSQL directamente
docker-compose exec postgres psql -U postgres -d ecommerce_dev

# Ejecutar dump de base de datos
docker-compose exec postgres pg_dump -U postgres ecommerce_dev > backup.sql

# Restaurar dump
docker-compose exec -T postgres psql -U postgres ecommerce_dev < backup.sql
```

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune

# Limpieza completa (CUIDADO: elimina todo)
docker system prune -a --volumes
```

---

## 📝 Variables de Entorno

### Archivo `.env` para Desarrollo

```env
# Frontend
VITE_API_URL=http://localhost:3001
NODE_ENV=development

# Backend
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecommerce_dev
JWT_SECRET=your-secret-key-here-must-be-32-chars-long-minimum
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
REDIS_URL=redis://redis:6379

# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_dev
```

### Archivo `.env` para Producción

```env
# Usar con docker-compose.prod.yml
VITE_API_URL=https://api.yourdomain.com
NODE_ENV=production

PORT=3001
DATABASE_URL=postgresql://prod_user:secure_password@postgres:5432/ecommerce_prod
JWT_SECRET=your-long-secure-secret-key-generate-with-openssl
JWT_EXPIRATION=7d
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
REDIS_URL=redis://:password@redis:6379
REDIS_PASSWORD=secure_redis_password

# Database
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=ecommerce_prod
```

---

## 🐛 Troubleshooting

### Error: "Port already in use"

```bash
# Encontrar qué proceso usa el puerto (Linux/Mac)
lsof -i :3000

# En Windows
netstat -ano | findstr :3000

# Cambiar puerto en docker-compose.yml
# Cambiar "3000:3000" a "3001:3000"
```

### Error: "Connection refused" en backend

```bash
# Verificar que postgres está listo
docker-compose logs postgres

# Esperar a que postgres inicie completamente
docker-compose restart backend
```

### Error: "npm ERR! code E404"

```bash
# Limpiar cache de npm en el contenedor
docker-compose exec backend npm cache clean --force

# Reconstruir sin cache
docker-compose up --build --no-cache
```

### Base de datos no persiste

```bash
# Verificar que los volúmenes existen
docker volume ls

# Revisar ruta de datos
docker inspect ecommerce-postgres | grep -A 5 Mounts
```

### Permisos negados en volúmenes

```bash
# En Linux, ajustar permisos
sudo chown -R $USER:$USER ./

# O usar comando en el contenedor
docker-compose exec backend chmod 755 /app/dist
```

---

## 🔒 Seguridad

### Buenas Prácticas Implementadas

1. **Multi-stage builds**: Reduce tamaño de imágenes
2. **Non-root user**: Backend ejecuta con usuario nodejs
3. **Read-only root**: Archivos de aplicación inmutables en producción
4. **Health checks**: Monitoreo automático de servicios
5. **.dockerignore**: Excluye archivos innecesarios
6. **Secrets externalizados**: Variables en .env

### Mejorar Seguridad en Producción

```yaml
# En docker-compose.prod.yml, agregar:
services:
  backend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

---

## 📊 Monitoreo y Logs

### Monitoreo en Tiempo Real

```bash
# Dashboard interactivo (requiere Docker Desktop)
# O usar scripts personalizados
docker stats --no-stream

# Ver historial de cambios en un contenedor
docker diff ecommerce-backend
```

### Gestión de Logs

```bash
# Guardar logs a archivo
docker-compose logs > logs.txt

# Logs formateados
docker-compose logs --timestamps

# Seguimiento de errores
docker-compose logs --tail=100 backend
```

---

## 🚀 Deployment

### En Producción

1. **Preparar servidor:**
   ```bash
   sudo apt update && sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

2. **Clonar repositorio:**
   ```bash
   git clone <repository-url>
   cd proyecto
   ```

3. **Configurar variables:**
   ```bash
   # Crear .env con valores de producción seguros
   nano .env
   ```

4. **Iniciar servicios:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   
   # Ejecutar migraciones
   docker-compose -f docker-compose.prod.yml exec backend npm run migrate
   ```

5. **Configurar Nginx como reverse proxy** (recomendado):
   ```nginx
   upstream backend {
       server backend:3001;
   }
   
   upstream frontend {
       server frontend:3000;
   }
   
   server {
       listen 80;
       server_name yourdomain.com;
   
       location /api {
           proxy_pass http://backend;
           proxy_set_header Host $host;
       }
   
       location / {
           proxy_pass http://frontend;
       }
   }
   ```

---

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Specification](https://github.com/compose-spec/compose-spec)
- [Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## ✅ Checklist de Validación

- [ ] Docker Desktop instalado y ejecutándose
- [ ] `docker-compose up` inicia todos los servicios
- [ ] Frontend accesible en http://localhost:3000
- [ ] Backend accesible en http://localhost:3001/health
- [ ] PostgreSQL acepta conexiones
- [ ] Redis responde a comandos
- [ ] Migraciones se ejecutan correctamente
- [ ] Volúmenes persisten datos entre reinicios
- [ ] Health checks pasan correctamente

---

## 📞 Soporte

Para problemas o preguntas, consultar:
- Issues del repositorio
- Documentación oficial de Docker
- Logs de los contenedores: `docker-compose logs`
