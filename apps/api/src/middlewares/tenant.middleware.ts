import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { organizationRepository } from '../repositories/organization.repository';
import { MembershipDTO } from '@dhara/shared';

export const requireOrganizationMembership = (paramName = 'organizationId') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'AUTH_004');
      }

      const orgId =
        req.params[paramName] || req.body[paramName] || (req.query[paramName] as string);
      if (!orgId) {
        throw new AppError('Organization context parameter missing', 400, 'VAL_003');
      }

      // Check if user is SUPER_ADMIN
      const isSuperAdmin = req.user.memberships.some(
        (m: MembershipDTO) => m.role === 'SUPER_ADMIN',
      );
      if (isSuperAdmin) {
        return next();
      }

      const membership = await organizationRepository.getMembership(req.user.id, orgId);
      if (!membership || membership.status !== 'ACTIVE') {
        throw new AppError(
          'Access denied. You do not belong to this organization.',
          403,
          'FORBIDDEN_TENANT',
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
