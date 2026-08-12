import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { Permission, Role, MembershipDTO } from '@dhara/shared';

export const requirePermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'AUTH_004'));
    }

    const hasPerm = req.user.permissions.includes(requiredPermission);
    if (!hasPerm) {
      return next(
        new AppError(
          `Access denied. Requires '${requiredPermission}' permission.`,
          403,
          'FORBIDDEN_PERM',
        ),
      );
    }

    next();
  };
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'AUTH_004'));
    }

    const userRoles = req.user.memberships.map((m: MembershipDTO) => m.role);
    const hasRole = userRoles.some((r: Role) => allowedRoles.includes(r));

    if (!hasRole) {
      return next(
        new AppError(
          `Access denied. Required role: ${allowedRoles.join(', ')}`,
          403,
          'FORBIDDEN_ROLE',
        ),
      );
    }

    next();
  };
};
