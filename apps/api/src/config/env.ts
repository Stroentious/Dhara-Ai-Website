import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('5000'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET must be at least 16 characters')
    .default('development_jwt_secret_do_not_use_in_production_min32chars'),
  DATABASE_URL: z
    .string()
    .optional()
    .default('postgresql://dhara_user:dhara_password@localhost:5432/dhara_db?schema=public'),
  MQTT_BROKER_URL: z.string().optional().default('mqtt://localhost:1883'),
  REDIS_URL: z.string().optional(),
  AI_API_KEY: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Environment Variable Validation Failed:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
