# 🚀 Backend Setup - Instrucciones de Inicio Rápido

## 1️⃣ Instalación Inicial (5 minutos)

```bash
# 1. Navegar a la carpeta backend
cd backend

# 2. Instalar todas las dependencias
npm install

# 3. Crear archivo .env local
cp .env.example .env
# O usar el que ya existe: .env.development

# 4. Generar Prisma Client
npx prisma generate
```

## 2️⃣ Configurar Base de Datos

### Opción A: Local (PostgreSQL local)

```bash
# Asegúrate de que PostgreSQL esté corriendo
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows (con WSL):
service postgresql start

# Luego:
npx prisma migrate dev
```

### Opción B: Con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up postgres

# Esperar a que inicie, luego en otra terminal:
cd backend
npx prisma migrate dev
```

## 3️⃣ Iniciar Servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# O en background si prefieres
npm run dev &

# La salida debería ser:
# 🚀 Servidor iniciado en puerto 3001
# 📍 Ambiente: development
# 🔗 URL: http://localhost:3001
```

## 4️⃣ Verificar que Funciona

```bash
# En otra terminal, test del endpoint health
curl http://localhost:3001/health

# Respuesta esperada:
# {
#   "status": "success",
#   "data": {
#     "message": "Servidor funcionando correctamente",
#     "timestamp": "2026-01-29T...",
#     "uptime": 2.345
#   }
# }
```

## 5️⃣ Ver Logs y Debuggear

```bash
# Abrir Prisma Studio (UI para ver/editar BD)
npx prisma studio

# Ver logs en tiempo real
tail -f logs/all.log

# Ver solo errores
tail -f logs/error.log
```

## 🐳 Con Docker Compose (Completo)

```bash
# Desde raíz del proyecto
docker-compose up

# Esto levanta:
# - Frontend (3000)
# - Backend (3001)
# - PostgreSQL (5432)
# - Redis (6379)
# - pgAdmin (5050)

# Acceder a:
# - Backend: http://localhost:3001/health
# - pgAdmin: http://localhost:5050 (admin@example.com / admin)
```

## 📝 Variables de Entorno Importantes

```env
# En .env o docker-compose.yml

NODE_ENV=development          # Modo desarrollo
PORT=3001                     # Puerto del servidor
DATABASE_URL=postgresql://... # Conexión a BD
JWT_SECRET=dev-secret-...     # Clave JWT (mín 32 chars)
CORS_ORIGIN=http://localhost:3000  # Frontend URL
LOG_LEVEL=debug               # Nivel de logging
```

## 🧪 Tests

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests específicos
npm test -- tests/unit
npm test -- tests/integration
```

## 🛠️ Troubleshooting

### Error: "Cannot find module '@config/...'"

```bash
# Falta compilar TypeScript
npm run build
```

### Error: "ENOENT: no such file or directory, open 'prisma/schema.prisma'"

```bash
# Verificar que prisma/schema.prisma existe
ls -la src/database/prisma/schema.prisma

# Copiar si es necesario
cp src/database/prisma/schema.prisma prisma/schema.prisma
```

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

```bash
# PostgreSQL no está corriendo
# Inicia PostgreSQL:

# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Or use Docker:
docker-compose up postgres -d
```

### Error: "JWT_SECRET debe tener al menos 32 caracteres"

```bash
# En .env, JWT_SECRET debe tener 32+ caracteres
JWT_SECRET=dev-secret-key-must-be-at-least-32-characters-long-12345
```

## 📚 Documentación

- [README.md](./README.md) - Guía general
- [SCAFFOLD_STATUS.md](./SCAFFOLD_STATUS.md) - Estado del scaffold
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express Docs](https://expressjs.com/)

## ✅ Verificación Final

```bash
# Checklist antes de comenzar desarrollo:

[ ] npm install completado sin errores
[ ] .env creado con DATABASE_URL válido
[ ] npx prisma migrate dev ejecutado
[ ] npm run dev inicia sin errores
[ ] curl http://localhost:3001/health retorna 200
[ ] npx prisma studio abre sin errores
[ ] npm test pasa (mínimo 2 tests)
```

## 🎉 ¡Listo!

Tu backend está configurado y listo para:
1. Crear usuarios y autenticación
2. Implementar endpoints de productos
3. Crear órdenes de compra
4. Integrar con frontend

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `logs/error.log`
2. Verifica DATABASE_URL en .env
3. Asegúrate que PostgreSQL esté corriendo
4. Lee el README.md

---

¡Happy coding! 🚀
