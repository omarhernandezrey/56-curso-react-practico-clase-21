// Cargar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/ecommerce_test';
process.env.JWT_SECRET = 'test-secret-key-must-be-at-least-32-characters-long-123';
process.env.JWT_EXPIRATION = '7d';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.LOG_LEVEL = 'error';
