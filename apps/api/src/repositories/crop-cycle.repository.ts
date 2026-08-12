import { prisma } from '../config/prisma';
import { CropCycle, CropCycleStatus } from '@prisma/client';

export interface CreateCropCycleData {
  fieldId: string;
  zoneId?: string;
  cropId: string;
  seasonName?: string;
  sowingDate?: Date;
  expectedHarvestDate?: Date;
  growthStage?: string;
  notes?: string;
}

export interface UpdateCropCycleData {
  seasonName?: string;
  sowingDate?: Date;
  expectedHarvestDate?: Date;
  growthStage?: string;
  status?: CropCycleStatus;
  notes?: string;
}

export class CropCycleRepository {
  private inMemoryCycles: Map<string, CropCycle> = new Map();

  async findById(id: string): Promise<CropCycle | null> {
    try {
      return await prisma.cropCycle.findUnique({
        where: { id },
        include: { crop: true, field: true, zone: true },
      });
    } catch {
      return this.inMemoryCycles.get(id) || null;
    }
  }

  async findByField(fieldId: string): Promise<CropCycle[]> {
    try {
      return await prisma.cropCycle.findMany({
        where: { fieldId },
        include: { crop: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      const result: CropCycle[] = [];
      for (const cyc of this.inMemoryCycles.values()) {
        if (cyc.fieldId === fieldId) {
          result.push(cyc);
        }
      }
      return result;
    }
  }

  async countActiveByOrganization(organizationId: string): Promise<number> {
    try {
      return await prisma.cropCycle.count({
        where: {
          field: { farm: { organizationId } },
          status: 'ACTIVE',
        },
      });
    } catch {
      let count = 0;
      for (const cyc of this.inMemoryCycles.values()) {
        if (cyc.status === 'ACTIVE') {
          count++;
        }
      }
      return count;
    }
  }

  async create(data: CreateCropCycleData): Promise<CropCycle> {
    try {
      return await prisma.cropCycle.create({
        data: {
          fieldId: data.fieldId,
          zoneId: data.zoneId || null,
          cropId: data.cropId,
          seasonName: data.seasonName || null,
          sowingDate: data.sowingDate || null,
          expectedHarvestDate: data.expectedHarvestDate || null,
          growthStage: data.growthStage || 'SOWING',
          status: 'ACTIVE',
          notes: data.notes || null,
        },
        include: { crop: true },
      });
    } catch {
      const now = new Date();
      const newCycle: CropCycle = {
        id: `cyc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        fieldId: data.fieldId,
        zoneId: data.zoneId || null,
        cropId: data.cropId,
        seasonName: data.seasonName || null,
        sowingDate: data.sowingDate || null,
        expectedHarvestDate: data.expectedHarvestDate || null,
        growthStage: data.growthStage || 'SOWING',
        status: 'ACTIVE',
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryCycles.set(newCycle.id, newCycle);
      return newCycle;
    }
  }

  async update(id: string, data: UpdateCropCycleData): Promise<CropCycle> {
    try {
      return await prisma.cropCycle.update({
        where: { id },
        data,
        include: { crop: true },
      });
    } catch {
      const cyc = this.inMemoryCycles.get(id);
      if (!cyc) throw new Error('CropCycle not found');
      const updated = {
        ...cyc,
        ...data,
        updatedAt: new Date(),
      };
      this.inMemoryCycles.set(id, updated);
      return updated;
    }
  }
}

export const cropCycleRepository = new CropCycleRepository();
