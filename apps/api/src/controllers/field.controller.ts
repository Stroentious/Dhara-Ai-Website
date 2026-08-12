import { Request, Response, NextFunction } from 'express';
import { fieldService } from '../services/field.service';

export class FieldController {
  async getFieldsForFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const fields = await fieldService.getFieldsForFarm(req.params.farmId, orgId);
      res.status(200).json({ success: true, data: fields });
    } catch (error) {
      next(error);
    }
  }

  async getFieldById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const field = await fieldService.getFieldById(req.params.fieldId, orgId);
      res.status(200).json({ success: true, data: field });
    } catch (error) {
      next(error);
    }
  }

  async createField(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const field = await fieldService.createField(
        req.params.farmId,
        req.user!.id,
        orgId,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res.status(201).json({ success: true, data: field, message: 'Field created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateField(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.body.organizationId ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const updated = await fieldService.updateField(
        req.params.fieldId,
        req.user!.id,
        orgId,
        req.body,
        req.ip,
        req.headers['user-agent'],
      );
      res.status(200).json({ success: true, data: updated, message: 'Field updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async archiveField(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId ||
        '';
      const archived = await fieldService.archiveField(
        req.params.fieldId,
        req.user!.id,
        orgId,
        req.ip,
        req.headers['user-agent'],
      );
      res
        .status(200)
        .json({ success: true, data: archived, message: 'Field archived successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const fieldController = new FieldController();
