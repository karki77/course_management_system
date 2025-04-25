import { ZodError } from "zod";

//
import type { ZodTypeAny } from "zod";
import type { Request, Response, NextFunction } from "express";

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
      req.query = schema.parse(req.query);
      next();
      return;
    } catch (error) {
      const errorObj =
        error instanceof ZodError ? error.flatten().fieldErrors : {};

      res.status(422).json({
        success: false,
        message: "Query validation error!",
        errors: errorObj,
      });
      return;
    }
  };

export default queryValidator;