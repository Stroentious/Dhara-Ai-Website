import morgan from 'morgan';
import { logger } from '../config/logger.js';

export const httpLoggerMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  },
);
