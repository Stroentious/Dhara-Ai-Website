import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from './error.middleware';
import { AuthenticatedUserContext } from '@dhara/shared';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserContext;
  rawSessionToken?: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    let rawToken: string | undefined = req.cookies?.dhara_session;

    if (!rawToken && req.headers.authorization?.startsWith('Bearer ')) {
      rawToken = req.headers.authorization.split(' ')[1];
    }

    if (!rawToken) {
      throw new AppError('Authentication required. Please log in.', 401, 'AUTH_004');
    }

    const userContext = await authService.validateSessionToken(rawToken);
    if (!userContext) {
      authService.clearSessionCookie(res);
      throw new AppError('Invalid or expired session. Please log in again.', 401, 'AUTH_005');
    }

    authReq.user = userContext;
    authReq.rawSessionToken = rawToken;
    next();
  } catch (error) {
    next(error);
  }
};
