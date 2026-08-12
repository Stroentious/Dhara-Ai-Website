import { farmRepository } from '../repositories/farm.repository';
import { auditRepository } from '../repositories/audit.repository';
import { AppError } from '../middlewares/error.middleware';
import { CreateFarmRequest, UpdateFarmRequest, FarmDTO, FarmStatus } from '@dhara/shared';
import { Farm } from '@prisma/client';

export class FarmService {
  async getFarmsForOrganization(organizationId: string): Promise<FarmDTO[]> {
    const farms = await farmRepository.findByOrganization(organizationId);
    return farms.map(this.toFarmDTO);
  }

  async getFarmById(farmId: string): Promise<FarmDTO> {
    const farm = await farmRepository.findById(farmId);
    if (!farm || farm.status === 'ARCHIVED') {
      throw new AppError('Farm not found', 404, 'FARM_001');
    }
    return this.toFarmDTO(farm);
  }

  async createFarm(
    organizationId: string,
    userId: string,
    data: CreateFarmRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FarmDTO> {
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError('Farm name is required', 400, 'VAL_001');
    }

    if (data.area !== undefined && data.area <= 0) {
      throw new AppError('Farm area must be greater than zero', 400, 'VAL_002');
    }

    const rawSlug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const slug = rawSlug || `farm-${Date.now()}`;

    const farm = await farmRepository.create({
      organizationId,
      name: data.name.trim(),
      slug,
      description: data.description,
      locationName: data.locationName,
      latitude: data.latitude,
      longitude: data.longitude,
      area: data.area,
      areaUnit: data.areaUnit || 'hectares',
    });

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'FARM_CREATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ farmId: farm.id, name: farm.name }),
    });

    return this.toFarmDTO(farm);
  }

  async updateFarm(
    farmId: string,
    userId: string,
    organizationId: string,
    data: UpdateFarmRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FarmDTO> {
    const existing = await farmRepository.findById(farmId);
    if (!existing || existing.organizationId !== organizationId) {
      throw new AppError('Farm not found in target organization', 404, 'FARM_001');
    }

    if (data.area !== undefined && data.area <= 0) {
      throw new AppError('Farm area must be greater than zero', 400, 'VAL_002');
    }

    const updated = await farmRepository.update(farmId, {
      name: data.name ? data.name.trim() : undefined,
      description: data.description,
      locationName: data.locationName,
      latitude: data.latitude,
      longitude: data.longitude,
      area: data.area,
      areaUnit: data.areaUnit,
      status: data.status,
    });

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'FARM_UPDATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ farmId: updated.id }),
    });

    return this.toFarmDTO(updated);
  }

  async archiveFarm(
    farmId: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FarmDTO> {
    const existing = await farmRepository.findById(farmId);
    if (!existing || existing.organizationId !== organizationId) {
      throw new AppError('Farm not found in target organization', 404, 'FARM_001');
    }

    const archived = await farmRepository.archive(farmId);

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'FARM_ARCHIVED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ farmId: archived.id }),
    });

    return this.toFarmDTO(archived);
  }

  private toFarmDTO(farm: Farm): FarmDTO {
    return {
      id: farm.id,
      organizationId: farm.organizationId,
      name: farm.name,
      slug: farm.slug,
      description: farm.description || null,
      locationName: farm.locationName || null,
      latitude: farm.latitude || null,
      longitude: farm.longitude || null,
      area: farm.area || null,
      areaUnit: farm.areaUnit || 'hectares',
      status: farm.status as FarmStatus,
      createdAt:
        farm.createdAt instanceof Date
          ? farm.createdAt.toISOString()
          : new Date(farm.createdAt).toISOString(),
      updatedAt:
        farm.updatedAt instanceof Date
          ? farm.updatedAt.toISOString()
          : new Date(farm.updatedAt).toISOString(),
    };
  }
}

export const farmService = new FarmService();
