import { cropRepository } from '../repositories/crop.repository';
import { cropCycleRepository } from '../repositories/crop-cycle.repository';
import { fieldRepository } from '../repositories/field.repository';
import { farmRepository } from '../repositories/farm.repository';
import { auditRepository } from '../repositories/audit.repository';
import { AppError } from '../middlewares/error.middleware';
import { CropDTO, CropCycleDTO, CreateCropCycleRequest, CropCycleStatus } from '@dhara/shared';
import { Crop, CropCycle } from '@prisma/client';

export class CropService {
  async getAllCrops(): Promise<CropDTO[]> {
    const crops = await cropRepository.findAll();
    return crops.map((c) => this.toCropDTO(c));
  }

  async getCropCyclesForField(fieldId: string, organizationId: string): Promise<CropCycleDTO[]> {
    const field = await fieldRepository.findById(fieldId);
    if (!field) throw new AppError('Field not found', 404, 'FLD_001');

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }

    const cycles = await cropCycleRepository.findByField(fieldId);
    return cycles.map((cyc) => this.toCropCycleDTO(cyc));
  }

  async createCropCycle(
    fieldId: string,
    userId: string,
    organizationId: string,
    data: CreateCropCycleRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<CropCycleDTO> {
    const field = await fieldRepository.findById(fieldId);
    if (!field || field.status === 'ARCHIVED') {
      throw new AppError('Field not found', 404, 'FLD_001');
    }

    const farm = await farmRepository.findById(field.farmId);
    if (!farm || farm.organizationId !== organizationId) {
      throw new AppError('Field not found in target organization', 404, 'FLD_001');
    }

    if (!data.cropId) {
      throw new AppError('Crop selection is required', 400, 'VAL_001');
    }

    const crop = await cropRepository.findById(data.cropId);
    if (!crop) {
      throw new AppError('Selected crop not found in catalog', 400, 'CRP_001');
    }

    const cycle = await cropCycleRepository.create({
      fieldId,
      zoneId: data.zoneId,
      cropId: data.cropId,
      seasonName: data.seasonName,
      sowingDate: data.sowingDate ? new Date(data.sowingDate) : new Date(),
      expectedHarvestDate: data.expectedHarvestDate
        ? new Date(data.expectedHarvestDate)
        : undefined,
      growthStage: data.growthStage || 'SOWING',
      notes: data.notes,
    });

    await auditRepository.logEvent({
      userId,
      organizationId,
      eventType: 'CROP_CYCLE_CREATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ cropCycleId: cycle.id, cropName: crop.name }),
    });

    return this.toCropCycleDTO(cycle, crop.name);
  }

  private toCropDTO(crop: Crop): CropDTO {
    return {
      id: crop.id,
      name: crop.name,
      scientificName: crop.scientificName || null,
      category: crop.category || null,
      description: crop.description || null,
      createdAt:
        crop.createdAt instanceof Date
          ? crop.createdAt.toISOString()
          : new Date(crop.createdAt).toISOString(),
    };
  }

  private toCropCycleDTO(
    cycle: CropCycle & { crop?: Crop },
    fallbackCropName?: string,
  ): CropCycleDTO {
    return {
      id: cycle.id,
      fieldId: cycle.fieldId,
      zoneId: cycle.zoneId || null,
      cropId: cycle.cropId,
      cropName: cycle.crop?.name || fallbackCropName || 'Crop',
      seasonName: cycle.seasonName || null,
      sowingDate: cycle.sowingDate ? new Date(cycle.sowingDate).toISOString() : null,
      expectedHarvestDate: cycle.expectedHarvestDate
        ? new Date(cycle.expectedHarvestDate).toISOString()
        : null,
      growthStage: cycle.growthStage || null,
      status: cycle.status as CropCycleStatus,
      notes: cycle.notes || null,
      createdAt:
        cycle.createdAt instanceof Date
          ? cycle.createdAt.toISOString()
          : new Date(cycle.createdAt).toISOString(),
      updatedAt:
        cycle.updatedAt instanceof Date
          ? cycle.updatedAt.toISOString()
          : new Date(cycle.updatedAt).toISOString(),
    };
  }
}

export const cropService = new CropService();
