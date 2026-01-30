import request from 'supertest';
import { createApp } from '../../src/app';

describe('Health Routes', () => {
  const app = createApp();

  describe('GET /health', () => {
    it('debe retornar estado healthy', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });

    it('debe incluir timestamp en la respuesta', async () => {
      const response = await request(app).get('/health');

      expect(response.body.data.timestamp).toBeDefined();
      expect(response.body.data.uptime).toBeDefined();
    });
  });

  describe('GET /unknown-route', () => {
    it('debe retornar 404 para ruta no encontrada', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });
});
