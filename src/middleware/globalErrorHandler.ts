import { Request, Response, NextFunction } from 'express';
import logger from '../config/setup/logSetup'; // Use default import for logger

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const statusCode = err.status ?? 500;

  // Log the error
  logger.error(
    JSON.stringify({
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      status: statusCode,
      stack: err.stack,
    }),
  );

  res.status(statusCode).json({
    success: false,
    message: err?.message ?? 'Something went wrong',
    originalError: err?.stack,
  });
};

export default globalErrorHandler;
