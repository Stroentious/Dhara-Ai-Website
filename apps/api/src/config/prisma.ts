import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export const connectDatabase = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database via Prisma');
    return true;
  } catch (error) {
    logger.warn(
      'PostgreSQL database connection unavailable. Operating with local database persistence fallback layer.',
    );
    return false;
  }
};
