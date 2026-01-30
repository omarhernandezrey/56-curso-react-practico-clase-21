#!/bin/bash

# Backend Setup Verification Script
# Este script verifica que el backend esté correctamente configurado

set -e

echo "🔍 Verificando Backend Scaffold Setup..."
echo "═══════════════════════════════════════"

# Variables de color
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
CHECKS_PASSED=0
CHECKS_FAILED=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Archivo existe: $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} Archivo NO existe: $1"
        ((CHECKS_FAILED++))
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directorio existe: $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} Directorio NO existe: $1"
        ((CHECKS_FAILED++))
    fi
}

# Función para verificar comando
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Comando instalado: $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} Comando NO instalado: $1 (instala con: npm install -g $1)"
        ((CHECKS_FAILED++))
    fi
}

echo ""
echo "📁 Verificando Estructura de Carpetas..."
check_dir "src"
check_dir "src/config"
check_dir "src/middleware"
check_dir "src/routes"
check_dir "src/controllers"
check_dir "src/services"
check_dir "src/shared"
check_dir "src/database"
check_dir "tests"

echo ""
echo "📄 Verificando Archivos de Configuración..."
check_file "package.json"
check_file "tsconfig.json"
check_file ".env.example"
check_file ".env.development"
check_file ".gitignore"
check_file "jest.config.js"
check_file "nodemon.json"
check_file ".prettierrc"
check_file ".eslintrc.yaml"

echo ""
echo "💻 Verificando Archivos del Servidor..."
check_file "src/index.ts"
check_file "src/app.ts"
check_file "src/config/environment.ts"
check_file "src/config/database.ts"
check_file "src/config/logger.ts"
check_file "src/routes/index.ts"
check_file "src/routes/health.routes.ts"
check_file "src/controllers/health.controller.ts"

echo ""
echo "🔒 Verificando Middleware..."
check_file "src/middleware/auth.ts"
check_file "src/middleware/cors.ts"
check_file "src/middleware/errorHandler.ts"
check_file "src/middleware/logging.ts"
check_file "src/middleware/rateLimit.ts"
check_file "src/middleware/validation.ts"

echo ""
echo "🗄️ Verificando Base de Datos..."
check_file "src/database/prisma/schema.prisma"
check_file "prisma/seed.ts"

echo ""
echo "🧪 Verificando Tests..."
check_file "tests/unit/validators.test.ts"
check_file "tests/integration/health.test.ts"

echo ""
echo "🐳 Verificando Docker..."
check_file "Dockerfile"
check_file "Dockerfile.dev"

echo ""
echo "📚 Verificando Documentación..."
check_file "README.md"
check_file "SCAFFOLD_STATUS.md"
check_file "SETUP.md"

echo ""
echo "🔧 Verificando Comandos Disponibles..."
if [ -f "package.json" ]; then
    if grep -q '"dev"' package.json; then
        echo -e "${GREEN}✓${NC} Script 'npm run dev' disponible"
        ((CHECKS_PASSED++))
    fi
    if grep -q '"build"' package.json; then
        echo -e "${GREEN}✓${NC} Script 'npm run build' disponible"
        ((CHECKS_PASSED++))
    fi
    if grep -q '"test"' package.json; then
        echo -e "${GREEN}✓${NC} Script 'npm test' disponible"
        ((CHECKS_PASSED++))
    fi
fi

echo ""
echo "═══════════════════════════════════════"
echo -e "${GREEN}✓ Verificaciones pasadas: $CHECKS_PASSED${NC}"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}✗ Verificaciones fallidas: $CHECKS_FAILED${NC}"
else
    echo -e "${GREEN}✓ Todas las verificaciones pasaron!${NC}"
fi
echo "═══════════════════════════════════════"

echo ""
echo "📋 Próximos pasos:"
echo "1. cd backend"
echo "2. npm install"
echo "3. cp .env.example .env (o usar .env.development)"
echo "4. npx prisma generate"
echo "5. npx prisma migrate dev"
echo "6. npm run dev"
echo ""
echo "Para más detalles, lee: backend/SETUP.md"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
