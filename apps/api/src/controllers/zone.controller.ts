import { Request, Response, NextFunction } from 'express';
import { zoneService } from '../services/zone.service';

export class ZoneController {
  async getZonesForField(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const zones = await zoneService.getZonesForField(req.params.fieldId, orgId);
      res.status(200).json({ success: true, data: zones });
    } catch (error) {
      next(error);
    }
  }

  async getZoneById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const zone = await zoneService.getZoneById(req.params.zoneId, orgId);
      res.status(200).json({ success: true, data: zone });
    } catch (error) {
      next(error);
    }
  }

  async createZone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const zone = await zoneService.createZone(
        req.params.fieldId,
        req.user!.id,
        orgId,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res.status(201).json({ success: true, data: zone, message: 'Zone created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateZone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const updated = await zoneService.updateZone(
        req.params.zoneId,
        req.user!.id,
        orgId,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res.status(200).json({ success: true, data: updated, message: 'Zone updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async archiveZone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const archived = await zoneService.archiveZone(
        req.params.zoneId,
        req.user!.id,
        orgId,
        req.ip,
        req.headers['user-agent'],
      );
      res
        .status(200)
        .json({ success: true, data: archived, message: 'Zone archived successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const zoneController = new ZoneController();
