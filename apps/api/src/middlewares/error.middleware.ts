import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import { StandardApiResponse } from '@dhara/shared';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.code}]: ${err.message}`);
    const response: StandardApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  logger.error('Unhandled Application Error:', err);

  const response: StandardApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(500).json(response);
};
