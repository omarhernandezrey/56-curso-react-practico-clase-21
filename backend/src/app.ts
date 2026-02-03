import express, { Express, Request, Response, NextFunction } from 'express';
import { config } from '@config/environment.js';
import { logger } from '@config/logger.js';
import { corsMiddleware } from '@middleware/cors.js';
import { requestLogger } from '@middleware/logging.js';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler.js';
import { rateLimitMiddleware } from '@middleware/rateLimit.js';
import routes from '@routes/index.js';

export function createApp(): Express {
  const app = express();

  // Middleware de Body Parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Middleware CORS
  app.use(corsMiddleware);

  // Middleware de Logging
  app.use(requestLogger);

  // Middleware de Rate Limiting
  app.use(rateLimitMiddleware);

  // Rutas
  app.use(routes);

  // 404 Handler
  app.use(notFoundHandler);

  // Error Handler (debe ser el último middleware)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
}

export async function startServer(app: Express): Promise<void> {
  const port = config.PORT;

  app.listen(port, () => {
    logger.info(`🚀 Servidor iniciado en puerto ${port}`);
    logger.info(`📍 Ambiente: ${config.NODE_ENV}`);
    logger.info(`🔗 URL: http://localhost:${port}`);
  });
}
