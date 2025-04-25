import { ZodError } from "zod";

//
import type { ZodTypeAny } from "zod";
import type { Request, Response, NextFunction } from "express";

/**
 * Body validator
 */
const bodyValidator =
  (schema: ZodTypeAny) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      req.body = schema.parse(req.body);

      next();
      return;
    } catch (error) {
      const errorObj =
        error instanceof ZodError ? error.flatten().fieldErrors : {};

      res.status(422).json({
        success: false,
        message: "Body validation error!",
        errors: errorObj,
      });
      return;
    }
  };

export default bodyValidator;