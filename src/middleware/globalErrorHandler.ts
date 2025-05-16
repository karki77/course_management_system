import { Request, Response, NextFunction } from 'express';

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const statusCode = err.status ?? 500;

  res.status(statusCode).json({
    success: false,
    message: err?.message ?? 'Something went wrong',
    originalError: err?.stack,
  });
};
export default globalErrorHandler;
