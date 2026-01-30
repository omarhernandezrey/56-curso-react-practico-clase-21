import { Request, Response, NextFunction } from 'express';

export async function getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    next(error);
  }
}
