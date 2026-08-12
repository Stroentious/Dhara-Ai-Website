import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body, res, req.ip, req.headers['user-agent']);

      res.status(201).json({
        success: true,
        data: result.user,
        message: 'Account registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body, res, req.ip, req.headers['user-agent']);

      res.status(200).json({
        success: true,
        data: result.user,
        message: 'Authentication successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawToken = req.rawSessionToken || req.cookies?.dhara_session;
      await authService.logout(rawToken, res, req.user?.id, req.ip, req.headers['user-agent']);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
