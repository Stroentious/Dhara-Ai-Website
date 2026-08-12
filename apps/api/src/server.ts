import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    `🌱 Dhara AI API Server initialized and listening on port ${env.PORT} [${env.NODE_ENV}]`,
  );
  logger.info(`📡 Health Check Available at: http://localhost:${env.PORT}/api/health`);
});

const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Gracefully shutting down HTTP server...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
