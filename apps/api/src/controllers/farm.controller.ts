import { Request, Response, NextFunction } from 'express';
import { farmService } from '../services/farm.service';

export class FarmController {
  async getFarms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId;
      if (!orgId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      const farms = await farmService.getFarmsForOrganization(orgId);
      res.status(200).json({ success: true, data: farms });
    } catch (error) {
      next(error);
    }
  }

  async getFarmById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const farm = await farmService.getFarmById(req.params.farmId);
      res.status(200).json({ success: true, data: farm });
    } catch (error) {
      next(error);
    }
  }

  async createFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const farm = await farmService.createFarm(
        orgId,
        req.user!.id,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res.status(201).json({ success: true, data: farm, message: 'Farm created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const updated = await farmService.updateFarm(
        req.params.farmId,
        req.user!.id,
        orgId,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res.status(200).json({ success: true, data: updated, message: 'Farm updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async archiveFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const archived = await farmService.archiveFarm(
        req.params.farmId,
        req.user!.id,
        orgId,
        req.ip,
        req.headers['user-agent'],
      );
      res
        .status(200)
        .json({ success: true, data: archived, message: 'Farm archived successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const farmController = new FarmController();
