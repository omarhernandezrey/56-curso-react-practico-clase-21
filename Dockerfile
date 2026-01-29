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

# Instalar dependencias de producción solamente
COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist

# Información del contenedor
LABEL maintainer="Tu nombre <email@example.com>"
LABEL version="1.0"
LABEL description="eCommerce SaaS - Frontend"

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando por defecto
CMD ["npm", "run", "preview"]
