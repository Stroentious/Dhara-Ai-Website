import { Request, Response, NextFunction } from 'express';
import { cropService } from '../services/crop.service';

export class CropController {
  async getAllCrops(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const crops = await cropService.getAllCrops();
      res.status(200).json({ success: true, data: crops });
    } catch (error) {
      next(error);
    }
  }

  async getCropCyclesForField(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const cycles = await cropService.getCropCyclesForField(req.params.fieldId, orgId);
      res.status(200).json({ success: true, data: cycles });
    } catch (error) {
      next(error);
    }
  }

  async createCropCycle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const cycle = await cropService.createCropCycle(
        req.params.fieldId,
        req.user!.id,
        orgId,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res
        .status(201)
        .json({ success: true, data: cycle, message: 'Crop cycle created successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const cropController = new CropController();
