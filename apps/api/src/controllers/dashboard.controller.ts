import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId =
        (req.query.organizationId as string) ||
        req.user?.activeOrganizationId ||
        req.user?.memberships[0]?.organizationId;
      if (!orgId) {
        res.status(200).json({
          success: true,
          data: {
            totalFarms: 0,
            totalFields: 0,
            totalZones: 0,
            activeCropCycles: 0,
            organizationName: 'None',
          },
        });
        return;
      }
      const metrics = await dashboardService.getMetrics(orgId);
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
