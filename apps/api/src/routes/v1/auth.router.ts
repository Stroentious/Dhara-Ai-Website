import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authRateLimiter } from '../../middlewares/rate-limit.middleware';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, (req, res, next) =>
  authController.register(req, res, next),
);
authRouter.post('/login', authRateLimiter, (req, res, next) =>
  authController.login(req, res, next),
);
authRouter.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
authRouter.get('/me', authenticate, (req, res, next) =>
  authController.getCurrentUser(req, res, next),
);
