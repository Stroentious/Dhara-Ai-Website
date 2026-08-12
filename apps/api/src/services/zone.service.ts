import { zoneRepository } from '../repositories/zone.repository';
import { fieldRepository } from '../repositories/field.repository';
import { farmRepository } from '../repositories/farm.repository';
import { auditRepository } from '../repositories/audit.repository';
import { AppError } from '../middlewares/error.middleware';
import {
  CreateZoneRequest,
  UpdateZoneRequest,
  ZoneDTO,
  ZoneStatus,
  IrrigationType,
} from '@dhara/shared';
import { Zone } from '@prisma/client';

export class ZoneService {
  async getZonesForField(fieldId: string, organizationId: string): Promise<ZoneDTO[]> {
    const field = await fieldRepository.findById(fieldId);
    if (!field) throw new AppError('Field not found', 404, 'FLD_001');

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }

    const zones = await zoneRepository.findByField(fieldId);
    return zones.map(this.toZoneDTO);
  }

  async getZoneById(zoneId: string, organizationId: string): Promise<ZoneDTO> {
    const zone = await zoneRepository.findById(zoneId);
    if (!zone || zone.status === 'ARCHIVED') {
      throw new AppError('Zone not found', 404, 'ZNE_001');
    }

    const field = await fieldRepository.findById(zone.fieldId);
    if (!field) throw new AppError('Zone parent field not found', 404, 'FLD_001');

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Zone not found in target organization', 404, 'ZNE_001');
    }

    return this.toZoneDTO(zone);
  }

  async createZone(
    fieldId: string,
    userId: string,
    organizationId: string,
    data: CreateZoneRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ZoneDTO> {
    const field = await fieldRepository.findById(fieldId);
    if (!field || field.status === 'ARCHIVED') {
      throw new AppError('Field not found', 404, 'FLD_001');
    }

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new AppError('Zone name is required', 400, 'VAL_001');
    }

    // MANDATORY CONSTRAINT: zone.area <= field.area
    if (
      data.area !== undefined &&
      data.area !== null &&
      field.area !== undefined &&
      field.area !== null
    ) {
      if (data.area > field.area) {
        throw new AppError(
          `Zone area (${data.area} ${data.areaUnit || 'hectares'}) cannot exceed total Field area (${field.area} ${field.areaUnit}).`,
          400,
          'VAL_AREA_EXCEEDED',
        );
      }
    }

    const zone = await zoneRepository.create({
      fieldId,
      name: data.name.trim(),
      description: data.description,
      area: data.area,
      areaUnit: data.areaUnit || field.areaUnit || 'hectares',
      irrigationType: data.irrigationType || 'DRIP',
    });

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'ZONE_CREATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ zoneId: zone.id, name: zone.name }),
    });

    return this.toZoneDTO(zone);
  }

  async updateZone(
    zoneId: string,
    userId: string,
    organizationId: string,
    data: UpdateZoneRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ZoneDTO> {
    const zone = await zoneRepository.findById(zoneId);
    if (!zone) throw new AppError('Zone not found', 404, 'ZNE_001');

    const field = await fieldRepository.findById(zone.fieldId);
    if (!field) throw new AppError('Zone parent field not found', 404, 'FLD_001');

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Zone not found in target organization', 404, 'ZNE_001');
    }

    if (
      data.area !== undefined &&
      data.area !== null &&
      field.area !== undefined &&
      field.area !== null
    ) {
      if (data.area > field.area) {
        throw new AppError(
          `Zone area (${data.area} ${data.areaUnit || 'hectares'}) cannot exceed total Field area (${field.area} ${field.areaUnit}).`,
          400,
          'VAL_AREA_EXCEEDED',
        );
      }
    }

    const updated = await zoneRepository.update(zoneId, {
      name: data.name ? data.name.trim() : undefined,
      description: data.description,
      area: data.area,
      areaUnit: data.areaUnit,
      irrigationType: data.irrigationType,
      status: data.status,
    });

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'ZONE_UPDATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ zoneId: updated.id }),
    });

    return this.toZoneDTO(updated);
  }

  async archiveZone(
    zoneId: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ZoneDTO> {
    const zone = await zoneRepository.findById(zoneId);
    if (!zone) throw new AppError('Zone not found', 404, 'ZNE_001');

    const field = await fieldRepository.findById(zone.fieldId);
    if (!field) throw new AppError('Zone parent field not found', 404, 'FLD_001');

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Zone not found in target organization', 404, 'ZNE_001');
    }

    const archived = await zoneRepository.archive(zoneId);

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'ZONE_ARCHIVED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ zoneId: archived.id }),
    });

    return this.toZoneDTO(archived);
  }

  private toZoneDTO(zone: Zone): ZoneDTO {
    return {
      id: zone.id,
      fieldId: zone.fieldId,
      name: zone.name,
      description: zone.description || null,
      area: zone.area || null,
      areaUnit: zone.areaUnit || 'hectares',
      irrigationType: zone.irrigationType as IrrigationType,
      status: zone.status as ZoneStatus,
      createdAt:
        zone.createdAt instanceof Date
          ? zone.createdAt.toISOString()
          : new Date(zone.createdAt).toISOString(),
      updatedAt:
        zone.updatedAt instanceof Date
          ? zone.updatedAt.toISOString()
          : new Date(zone.updatedAt).toISOString(),
    };
  }
}

export const zoneService = new ZoneService();
