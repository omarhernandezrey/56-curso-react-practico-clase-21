import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

async function getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const response: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    res.status(200).json({
      status: 'success',
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

router.get('/health', getHealth);

export default router;
