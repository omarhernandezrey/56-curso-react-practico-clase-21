import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/types/errors';
import { logger } from '@config/logger';
import { HTTP_STATUS } from '@shared/constants/index';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof AppError) {
    logger.warn(`App Error: ${error.message}`, { statusCode: error.statusCode });
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      errors: error.errors,
    });
  } else {
    logger.error('Unhandled error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
}
