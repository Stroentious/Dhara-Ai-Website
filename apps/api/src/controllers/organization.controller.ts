import { Request, Response, NextFunction } from 'express';
import { organizationService } from '../services/organization.service';

export class OrganizationController {
  async createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationService.createOrganization(
        req.user!.id,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );

      res.status(201).json({
        success: true,
        data: org,
        message: 'Organization created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgs = await organizationService.getUserOrganizations(req.user!.id);
      res.status(200).json({
        success: true,
        data: orgs,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const organizationController = new OrganizationController();
