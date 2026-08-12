import { farmRepository } from '../repositories/farm.repository';
import { fieldRepository } from '../repositories/field.repository';
import { zoneRepository } from '../repositories/zone.repository';
import { cropCycleRepository } from '../repositories/crop-cycle.repository';
import { organizationRepository } from '../repositories/organization.repository';
import { DashboardMetricsDTO } from '@dhara/shared';

export class DashboardService {
  async getMetrics(organizationId: string): Promise<DashboardMetricsDTO> {
    const org = await organizationRepository.findById(organizationId);

    const [totalFarms, totalFields, totalZones, activeCropCycles] = await Promise.all([
      farmRepository.countByOrganization(organizationId),
      fieldRepository.countByOrganization(organizationId),
      zoneRepository.countByOrganization(organizationId),
      cropCycleRepository.countActiveByOrganization(organizationId),
    ]);

    return {
      totalFarms,
      totalFields,
      totalZones,
      activeCropCycles,
      organizationName: org?.name || 'Organization',
    };
  }
}

export const dashboardService = new DashboardService();
