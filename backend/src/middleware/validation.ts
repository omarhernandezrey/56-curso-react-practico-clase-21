import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '@shared/types/errors';

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      Object.assign(req, { validated });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce(
          (acc, err) => {
            const path = err.path.join('.');
            if (!acc[path]) {
              acc[path] = [];
            }
            acc[path].push(err.message);
            return acc;
          },
          {} as Record<string, string[]>
        );

        throw new ValidationError('Datos inválidos', errors);
      }
      throw error;
    }
  };
}
