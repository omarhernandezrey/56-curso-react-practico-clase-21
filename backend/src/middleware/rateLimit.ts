import { Request, Response, NextFunction } from 'express';
import { logger } from '@config/logger';

const requestCounts = new Map<string, number[]>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 100; // Máximo 100 requests por minuto

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const clientId = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Obtener registros previos
  let timestamps = requestCounts.get(clientId) || [];

  // Limpiar registros antiguos
  timestamps = timestamps.filter((timestamp) => now - timestamp < WINDOW_SIZE_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for ${clientId}`);
    res.status(429).json({
      status: 'error',
      message: 'Demasiadas solicitudes. Intenta más tarde.',
    });
    return;
  }

  // Agregar timestamp actual
  timestamps.push(now);
  requestCounts.set(clientId, timestamps);

  // Limpiar entradas antiguas cada minuto
  if (requestCounts.size > 1000) {
    requestCounts.clear();
  }

  next();
}
