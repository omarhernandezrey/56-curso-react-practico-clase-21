# 🤝 CONTRIBUTING.md - Guía para Contribuyentes

**¡Gracias por tu interés en contribuir!**

Este documento explica cómo configurar tu ambiente y contribuir al proyecto.

---

## 📋 PRE-REQUISITOS

Asegúrate de tener instalado:
- Node.js 18+ y npm 9+
- Git
- PostgreSQL 14+ (local)
- Docker & Docker Compose (opcional pero recomendado)
- Visual Studio Code (recomendado)

Verifica con:
```bash
node --version  # v18+
npm --version   # v9+
git --version   # Cualquier versión reciente
```

---

## 🚀 SETUP INICIAL (5 MINUTOS)

### Paso 1: Fork y Clonar
```bash
# 1. Fork el repo en GitHub (botón superior derecho)
# 2. Clona TU fork
git clone https://github.com/TU_USUARIO/nombre-repo.git
cd nombre-repo

# 3. Agrega el upstream (repo original)
git remote add upstream https://github.com/OWNER/nombre-repo.git
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno
```bash
# Copia el archivo .env.example
cp .env.example .env.local

# Edita .env.local con tus valores locales:
# - VITE_API_URL=http://localhost:3001
# - DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Paso 4: Setup Base de Datos
```bash
# Con Docker Compose (recomendado):
docker-compose up -d postgres

# O manualmente:
# 1. Inicia PostgreSQL
# 2. Crea la base de datos:
#    CREATE DATABASE nombre_db;

# Ejecuta migraciones:
npm run db:migrate
```

### Paso 5: Verificar Setup
```bash
# Inicia servidor de desarrollo
npm run dev

# En otro terminal, verifica:
npm run test     # Debe pasar todos los tests
npm run lint     # Sin errores
npm run format:check  # Sin cambios necesarios
```

---

## 🔄 GIT WORKFLOW

### Crear una Nueva Feature

1. **Actualiza main**
```bash
# Ve a main
git checkout main

# Sincroniza con upstream
git fetch upstream
git rebase upstream/main
```

2. **Crea una rama**
```bash
# Nombres: feature/nombre, bugfix/nombre, docs/nombre
git checkout -b feature/nueva-funcionalidad

# O para bug:
git checkout -b bugfix/corrigir-error-x

# O para docs:
git checkout -b docs/actualizar-readme
```

3. **Haz cambios y Commita**
```bash
# Solo agrega cambios relacionados
git add src/components/MyComponent.jsx

# Usa commits semánticos:
git commit -m "feat: Agregar componente MyComponent"

# Tipos válidos:
# - feat: Nueva funcionalidad
# - fix: Corregir bug
# - docs: Cambios en documentación
# - style: Cambios que no afectan el código (formato, etc)
# - refactor: Cambios que no agregan features ni arreglan bugs
# - test: Agregar o actualizar tests
# - chore: Cambios en build, dependencies, etc
# - perf: Mejoras de rendimiento
```

4. **Push a tu fork**
```bash
git push origin feature/nueva-funcionalidad
```

5. **Crea Pull Request**
- Ve a GitHub
- Deberías ver un botón "Compare & pull request"
- Completa el PR template:
  - **Descripción**: ¿Qué cambios hace?
  - **Why**: ¿Por qué estos cambios?
  - **Testing**: ¿Cómo verificar?
  - **Screenshots**: Si es UI, agrega screenshots
  - **Related Issues**: Cierra issues si aplica (Closes #123)

---

## ✅ BEFORE PUSHING - PRE-COMMIT CHECKLIST

Antes de hacer commit:

```bash
# 1. Linting
npm run lint

# 2. Formatting
npm run format

# 3. Tests
npm run test

# 4. Coverage
npm run test:coverage  # Debe ser >= 80%
```

**Si falla algo**:
```bash
# Auto-arregla linting y formato
npm run lint:fix
npm run format

# Luego re-commit
git add .
git commit -m "fix: Corregir linting"
```

---

## 📝 CODE STANDARDS

### JavaScript/TypeScript

```javascript
// ✅ CORRECTO
function calculateTotal(quantity, price) {
  return quantity * price;
}

// ❌ INCORRECTO - Muy larga, múltiples responsabilidades
function processUserDataAndSaveAndLogAndValidateAndFormatAndReturnAsJSON(userData) {
  // 50 líneas de código
}
```

### React Components

```jsx
// ✅ CORRECTO - Nombres claros, propstyped
interface UserCardProps {
  userId: string;
  onSelect: (id: string) => void;
}

export function UserCard({ userId, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect(userId)}>
      User {userId}
    </div>
  );
}

// ❌ INCORRECTO - Lowercase, sin tipos, sin formato
export default function usercard(props) {
  return <div onClick={() => props.x(props.y)}>User</div>;
}
```

### Testing

```javascript
// ✅ CORRECTO - AAA pattern
describe('UserService', () => {
  it('should create user with valid email', () => {
    // Arrange
    const userData = { email: 'test@example.com', name: 'John' };
    
    // Act
    const user = UserService.create(userData);
    
    // Assert
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});

// ❌ INCORRECTO - Sin estructura clara
it('test', () => {
  const x = create({ e: 't@ex.com' });
  expect(x).toBeDefined();
});
```

### Comentarios

```javascript
// ✅ CORRECTO - JSDoc completo
/**
 * Calcula el total de una orden
 * @param {Array<Item>} items - Items a procesar
 * @param {number} discountPercent - % de descuento (0-100)
 * @returns {number} Total calculado
 */
function calculateOrderTotal(items, discountPercent = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return subtotal * (1 - discountPercent / 100);
}

// ❌ INCORRECTO - Sin documentación
function calc(x, y) {
  return x * y * (1 - y / 100); // no está claro
}
```

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests
- Cobertura mínima: 80%
- Ubicación: `src/__tests__/unit/`
- Naming: `filename.test.js`

```javascript
// src/__tests__/unit/utils.test.js
import { calculateTotal } from '../../utils';

describe('calculateTotal', () => {
  it('should multiply quantity and price', () => {
    expect(calculateTotal(2, 50)).toBe(100);
  });
  
  it('should return 0 for zero quantity', () => {
    expect(calculateTotal(0, 100)).toBe(0);
  });
});
```

### Integration Tests
- Cobertura de API endpoints
- Ubicación: `src/__tests__/integration/`

```javascript
// src/__tests__/integration/auth.test.js
import request from 'supertest';
import app from '../../app';

describe('POST /api/auth/login', () => {
  it('should return token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

Ejecutar tests:
```bash
npm test                    # Todos los tests
npm run test:watch         # Watch mode
npm run test:coverage      # Con reporte de cobertura
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
src/
├── components/          # Componentes reutilizables
│   ├── Header/
│   ├── Card/
│   └── Modal/
├── pages/              # Páginas/rutas
│   ├── Home/
│   ├── Products/
│   └── Checkout/
├── hooks/              # Custom hooks
├── context/            # Context API
├── services/           # API calls
├── utils/              # Funciones utilitarias
├── types/              # TypeScript types
├── __tests__/          # Tests
│   ├── unit/
│   ├── integration/
│   └── fixtures/
└── styles/             # Estilos globales

backend/
├── src/
│   ├── controllers/    # Controladores
│   ├── services/       # Lógica de negocio
│   ├── models/         # Modelos Prisma
│   ├── middleware/     # Middlewares
│   ├── routes/         # Rutas
│   ├── utils/          # Funciones utilitarias
│   ├── __tests__/      # Tests
│   └── index.js
└── prisma/
    └── schema.prisma   # Schema de DB
```

---

## 🔍 CODE REVIEW CHECKLIST

**Como Author** (antes de PR):
- [ ] Tests pasan (100%)
- [ ] Linting sin errores
- [ ] Cobertura >= 80%
- [ ] Sin console.log
- [ ] Commits semánticos
- [ ] PR description completa
- [ ] Screenshots si es necesario

**Como Reviewer** (revisando PR):
- [ ] Código sigue standards
- [ ] Tests cubren casos edge
- [ ] Sin N+1 queries
- [ ] Performance acceptable
- [ ] Sin código duplicado
- [ ] Error handling completo
- [ ] Documentación actualizada

---

## 🚨 COMMON MISTAKES

### ❌ NO HAGAS ESTO

1. **Directo en main**
```bash
# ❌ NUNCA
git checkout main
git add .
git commit -m "cambios"
git push origin main
```

2. **Commits sin descripción**
```bash
# ❌ NUNCA
git commit -m "x"
git commit -m "cambios"

# ✅ SI
git commit -m "feat: Agregar validación de email"
```

3. **Cambios no relacionados en un PR**
```bash
# ❌ NUNCA - Mezclar features
# Un PR: "Feature A"
# Otro: "Feature B"
# No: Ambas en uno

# ✅ SI - PR focused
```

4. **Sin tests**
```bash
# ❌ NUNCA
// Nueva función sin test

// ✅ SI
// Nueva función + test
```

---

## ❓ AYUDA Y PREGUNTAS

### Tengo una pregunta
- Abre un Issue con label "question"
- O pregunta en Discussions

### Encontré un bug
- Abre un Issue con template "Bug Report"
- Incluye pasos para reproducir

### Tengo una idea
- Abre un Issue con template "Feature Request"
- Describe el caso de uso

### Necesito ayuda
- Contacta en Discord o por Issue
- El equipo responderá ASAP

---

## 📚 RECURSOS

- [Documentación Principal](./COMIENZA_AQUI.md)
- [Estándares de Código](./ESTANDARES_DE_CODIGO.md)
- [Checklist de Seguridad](./SECURITY_CHECKLIST.md)
- [Roadmap Técnico](./ROADMAP_TECNICO.md)

---

**¡Gracias por contribuir! ❤️**

Nuestro proyecto es mejor gracias a colaboradores como tú.
