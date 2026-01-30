import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@shared/types/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.substring(7);

    // TODO: Implementar verificación real de JWT
    // const decoded = verifyJWT(token, config.JWT_SECRET);
    // req.user = decoded as AuthenticatedRequest['user'];

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Token inválido');
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!roles.includes(req.user.role)) {
      throw new Error('Rol insuficiente');
    }

    next();
  };
}
