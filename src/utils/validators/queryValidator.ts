import { ZodError } from 'zod';

//
import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Query validator
 */
const queryValidator =
  (schema: ZodTypeAny) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      console.log('Query Validator:', req.query);
      const validated = schema.parse(req.query);

      // Attach to a custom property
      (req as any).validatedQuery = validated;
      next();
    } catch (error) {
      const errorObj =
        error instanceof ZodError ? error.flatten().fieldErrors : {};
      res.status(422).json({
        success: false,
        message: 'Query validation error!',
        errors: error,
      });
    }
  };

export default queryValidator;
