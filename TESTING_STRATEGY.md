# 🧪 TESTING STRATEGY

**Responsable**: QA Lead / Tech Lead
**Última Actualización**: 29 Enero 2026
**Objetivo**: 80%+ code coverage, 0 critical bugs en producción

---

## 📋 TABLA DE CONTENIDOS

- [Testing Pyramid](#testing-pyramid)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [E2E Tests](#e2e-tests)
- [Coverage Requirements](#coverage-requirements)
- [Tools & Setup](#tools--setup)
- [CI/CD Integration](#cicd-integration)

---

## 🔺 TESTING PYRAMID

```
        ┌─────────────────┐
        │   E2E Tests     │  ← 10% (UI/Flujos críticos)
        │   (Cypress)     │     Lento, pero realista
        ├─────────────────┤
        │ Integration     │  ← 20% (APIs, DB queries)
        │ Tests           │     Velocidad media
        ├─────────────────┤
        │  Unit Tests     │  ← 70% (Funciones, componentes)
        │  (Jest)         │     Rápido, automatizable
        └─────────────────┘
```

**Estrategia**:
- ✅ Máximo unit tests (rápido, retroalimentación inmediata)
- ✅ Tests de integración para flujos críticos
- ✅ Mínimo E2E (mantener costo bajo)

---

## 🧬 UNIT TESTS

### JavaScript/Node.js - Jest

**Ubicación**: `src/__tests__/unit/`

**Naming**: `filename.test.js`

```javascript
// src/utils/math.test.js
import { add, multiply } from '../math';

describe('Math Utilities', () => {
  describe('add', () => {
    it('should sum two numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-5, 3)).toBe(-2);
    });

    it('should handle decimals', () => {
      expect(add(1.5, 2.5)).toBe(4);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(2, 3)).toBe(6);
    });

    it('should return 0 when multiplied by 0', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });
});
```

**Reglas**:
- ✅ AAA Pattern (Arrange-Act-Assert)
- ✅ 1 assertion principal por test
- ✅ Máx 15 líneas por test
- ✅ Nombres descriptivos
- ✅ Casos edge cases

### React Components - Jest + React Testing Library

```javascript
// src/__tests__/unit/components/Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<Button loading>Loading...</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('disabled');
  });
});
```

**Reglas**:
- ✅ Usar `screen` queries (preferido)
- ✅ Usar `getByRole` (accesibilidad)
- ✅ Evitar `getByTestId` (implementación detail)
- ✅ Simular interacción de usuario
- ✅ No testar implementación interna

### Hooks - Jest

```javascript
// src/__tests__/unit/hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter Hook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(-1);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

---

## 🔗 INTEGRATION TESTS

### API Endpoints - Supertest

**Ubicación**: `src/__tests__/integration/`

```javascript
// src/__tests__/integration/auth.test.js
import request from 'supertest';
import app from '../../app';
import db from '../../db';

describe('Auth API', () => {
  beforeAll(async () => {
    // Setup: Conectar a DB de test
    await db.connect();
  });

  afterAll(async () => {
    // Teardown: Desconectar DB
    await db.disconnect();
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada test
    await db.clearUsers();
  });

  describe('POST /api/auth/register', () => {
    it('should register new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/invalid email/i);
    });

    it('should return 409 if email already exists', async () => {
      // Crear usuario primero
      await db.createUser({
        email: 'existing@example.com',
        password: 'hashed_password'
      });

      // Intentar registrar con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'Password123!',
          name: 'Another User'
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toMatch(/already exists/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario para login tests
      await db.createUser({
        email: 'user@example.com',
        password: await bcrypt.hash('Password123!', 10)
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(404);
    });
  });
});
```

---

## 🎭 E2E TESTS

### Cypress - User Flows Críticos

**Ubicación**: `cypress/e2e/`

```javascript
// cypress/e2e/checkout.cy.js
describe('Checkout Flow', () => {
  beforeEach(() => {
    // Login antes de cada test
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type('test@example.com');
    cy.get('[data-testid=password-input]').type('Password123!');
    cy.get('[data-testid=login-button]').click();
    cy.visit('/products');
  });

  it('should add product to cart and checkout', () => {
    // Agregar producto
    cy.get('[data-testid=product-card]').first().click();
    cy.get('[data-testid=add-to-cart]').click();
    cy.get('[data-testid=cart-badge]').should('have.text', '1');

    // Ir al carrito
    cy.get('[data-testid=cart-icon]').click();
    cy.url().should('include', '/cart');

    // Verificar producto en carrito
    cy.get('[data-testid=cart-item]').should('have.length', 1);
    cy.get('[data-testid=total]').should('not.have.text', '$0');

    // Checkout
    cy.get('[data-testid=checkout-button]').click();
    cy.url().should('include', '/checkout');

    // Completar información
    cy.get('[data-testid=address-input]').type('123 Main St');
    cy.get('[data-testid=city-input]').type('New York');
    cy.get('[data-testid=zip-input]').type('10001');

    // Pagar
    cy.get('[data-testid=pay-button]').click();

    // Verificar orden creada
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-testid=order-number]').should('be.visible');
  });

  it('should show error if payment fails', () => {
    cy.get('[data-testid=product-card]').first().click();
    cy.get('[data-testid=add-to-cart]').click();
    cy.get('[data-testid=cart-icon]').click();
    cy.get('[data-testid=checkout-button]').click();

    // Llenar con datos de tarjeta inválida
    cy.get('[data-testid=card-number]').type('4000000000000002');
    cy.get('[data-testid=pay-button]').click();

    cy.get('[data-testid=error-message]').should('contain', 'declined');
  });
});
```

---

## 📊 COVERAGE REQUIREMENTS

### Por categoría:

```
Categoría              | Mínimo  | Target
─────────────────────────────────────
Funciones utilitarias  | 90%     | 100%
Hooks personalizados   | 85%     | 95%
Componentes           | 80%     | 90%
Páginas               | 70%     | 80%
API Endpoints         | 85%     | 95%
```

### Medir cobertura:

```bash
# Generar reporte de cobertura
npm test -- --coverage

# Con threshold mínimo
npm test -- --coverage --collectCoverageFrom='src/**/*.js'
```

### Jest Configuration (package.json):

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/**/*.test.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 🛠 TOOLS & SETUP

### Instalación

```bash
# Testing frameworks
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Para E2E
npm install --save-dev cypress

# Otros
npm install --save-dev supertest bcrypt
```

### Jest Setup (jest.setup.js)

```javascript
import '@testing-library/jest-dom';

// Mock globals
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Reset mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
```

---

## 🔄 CI/CD INTEGRATION

### GitHub Actions

Ya configurado en `.github/workflows/test.yml`:

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage
  
- name: Check coverage threshold
  run: npm test -- --coverage --testPathPattern=src
```

### Local pre-commit hook

```bash
#!/bin/bash
# .husky/pre-commit

npm run lint
npm run test
npm run test:coverage  # Falla si < 80%
```

---

## 📝 TEST CHECKLIST

Antes de marcar una feature como "done":

- [ ] Unit tests para lógica nueva (80% coverage)
- [ ] Integration tests para APIs nuevas
- [ ] E2E test para flujo usuario crítico (si aplica)
- [ ] Todos los tests pasan localmente
- [ ] CI/CD pasa (GitHub Actions)
- [ ] Coverage >= 80%
- [ ] Sin skipped tests (`.skip`)
- [ ] Sin console.log en tests

---

**COMANDOS ÚTILES**

```bash
npm test                          # Correr todos
npm test -- --watch              # Watch mode
npm test -- --coverage            # Con cobertura
npm test auth.test.js            # Test específico
npm test -- --testNamePattern="should"  # Por nombre
npm run test:coverage:report      # Abrir HTML report
```

