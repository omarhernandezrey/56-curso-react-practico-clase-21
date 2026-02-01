# ETAPA 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# ETAPA 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar dumb-init para manejar signals correctamente
RUN apk add --no-cache dumb-init=1.2.8-r0

# Instalar dependencias de producción solamente
COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist

# Copiar prisma schema
COPY prisma ./prisma

# Información del contenedor
LABEL maintainer="eCommerce Team"
LABEL version="1.0"
LABEL description="eCommerce API Backend - Node.js + Express"

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# User no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Usar dumb-init para iniciar el proceso
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", "dist/index.js"]
