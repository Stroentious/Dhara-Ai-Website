import { fieldRepository } from '../repositories/field.repository';
import { farmRepository } from '../repositories/farm.repository';
import { cropCycleRepository } from '../repositories/crop-cycle.repository';
import { auditRepository } from '../repositories/audit.repository';
import { AppError } from '../middlewares/error.middleware';
import { CreateFieldRequest, UpdateFieldRequest, FieldDTO, FieldStatus } from '@dhara/shared';
import { Field } from '@prisma/client';

export class FieldService {
  async getFieldsForFarm(farmId: string, organizationId: string): Promise<FieldDTO[]> {
    const farm = await farmRepository.findById(farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Farm not found in target organization', 404, 'FARM_001');
    }
    const fields = await fieldRepository.findByFarm(farmId);
    return fields.map(this.toFieldDTO);
  }

  async getFieldById(fieldId: string, organizationId: string): Promise<FieldDTO> {
    const field = await fieldRepository.findById(fieldId);
    if (!field || field.status === 'ARCHIVED') {
      throw new AppError('Field not found', 404, 'FLD_001');
    }
    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }
    return this.toFieldDTO(field);
  }

  async createField(
    farmId: string,
    userId: string,
    organizationId: string,
    data: CreateFieldRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FieldDTO> {
    const farm = await farmRepository.findById(farmId);
    if (!farm || farm.organizationId !== organizationId || farm.status === 'ARCHIVED') {
      throw new AppError('Farm not found in target organization', 404, 'FARM_001');
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new AppError('Field name is required', 400, 'VAL_001');
    }

    if (data.area !== undefined && data.area <= 0) {
      throw new AppError('Field area must be greater than zero', 400, 'VAL_002');
    }

    const field = await fieldRepository.create({
      farmId,
      name: data.name.trim(),
      description: data.description,
      area: data.area,
      areaUnit: data.areaUnit || 'hectares',
      soilType: data.soilType,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    if (data.initialCropId) {
      await cropCycleRepository.create({
        fieldId: field.id,
        cropId: data.initialCropId,
        seasonName: 'Current Season',
        sowingDate: new Date(),
        growthStage: 'SOWING',
      });
    }

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'FIELD_CREATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ fieldId: field.id, name: field.name }),
    });

    return this.toFieldDTO(field);
  }

  async updateField(
    fieldId: string,
    userId: string,
    organizationId: string,
    data: UpdateFieldRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FieldDTO> {
    const field = await fieldRepository.findById(fieldId);
    if (!field) {
      throw new AppError('Field not found', 404, 'FLD_001');
    }

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }

    if (data.area !== undefined && data.area <= 0) {
      throw new AppError('Field area must be greater than zero', 400, 'VAL_002');
    }

    const updated = await fieldRepository.update(fieldId, {
      name: data.name ? data.name.trim() : undefined,
      description: data.description,
      area: data.area,
      areaUnit: data.areaUnit,
      soilType: data.soilType,
      latitude: data.latitude,
      longitude: data.longitude,
      status: data.status,
    });

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'FIELD_UPDATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ fieldId: updated.id }),
    });

    return this.toFieldDTO(updated);
  }

  async archiveField(
    fieldId: string,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FieldDTO> {
    const field = await fieldRepository.findById(fieldId);
    if (!field) {
      throw new AppError('Field not found', 404, 'FLD_001');
    }

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }

    const archived = await fieldRepository.archive(fieldId);

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'FIELD_ARCHIVED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ fieldId: archived.id }),
    });

    return this.toFieldDTO(archived);
  }

  private toFieldDTO(field: Field): FieldDTO {
    return {
      id: field.id,
      farmId: field.farmId,
      name: field.name,
      description: field.description || null,
      area: field.area || null,
      areaUnit: field.areaUnit || 'hectares',
      soilType: field.soilType || null,
      latitude: field.latitude || null,
      longitude: field.longitude || null,
      status: field.status as FieldStatus,
      createdAt:
        field.createdAt instanceof Date
          ? field.createdAt.toISOString()
          : new Date(field.createdAt).toISOString(),
      updatedAt:
        field.updatedAt instanceof Date
          ? field.updatedAt.toISOString()
          : new Date(field.updatedAt).toISOString(),
    };
  }
}

export const fieldService = new FieldService();
