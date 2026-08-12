import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDatabase } from './config/prisma.js';
import { httpLoggerMiddleware } from './middlewares/logger.middleware.js';
import { errorHandler, AppError } from './middlewares/error.middleware.js';
import { HealthController } from './controllers/health.controller.js';
import { v1Router } from './routes/v1/index.js';

export const createApp = (): Express => {
  const app = express();

  // Connect database (with fallback for offline/development environments)
  connectDatabase().catch(() => {});

  // Core Security & Middleware
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(httpLoggerMiddleware);

  // Direct root health check endpoint as specified in requirements
  const healthController = new HealthController();
  app.get('/api/health', healthController.getHealth);

  // Versioned API v1 Router Foundation
  app.use('/api/v1', v1Router);

  // 404 Handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError('Requested resource or endpoint not found', 404, 'NOT_FOUND'));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
