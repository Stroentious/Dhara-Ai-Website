import { prisma } from '../config/prisma';
import { Field, FieldStatus } from '@prisma/client';

export interface CreateFieldData {
  farmId: string;
  name: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  soilType?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateFieldData {
  name?: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  soilType?: string;
  latitude?: number;
  longitude?: number;
  status?: FieldStatus;
}

export class FieldRepository {
  private inMemoryFields: Map<string, Field> = new Map();

  async findById(id: string): Promise<Field | null> {
    try {
      return await prisma.field.findUnique({
        where: { id },
      });
    } catch {
      return this.inMemoryFields.get(id) || null;
    }
  }

  async findByFarm(farmId: string): Promise<Field[]> {
    try {
      return await prisma.field.findMany({
        where: { farmId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      const result: Field[] = [];
      for (const field of this.inMemoryFields.values()) {
        if (field.farmId === farmId && field.status === 'ACTIVE') {
          result.push(field);
        }
      }
      return result;
    }
  }

  async countByOrganization(organizationId: string): Promise<number> {
    try {
      return await prisma.field.count({
        where: {
          farm: { organizationId },
          status: 'ACTIVE',
        },
      });
    } catch {
      let count = 0;
      for (const field of this.inMemoryFields.values()) {
        if (field.status === 'ACTIVE') {
          count++;
        }
      }
      return count;
    }
  }

  async create(data: CreateFieldData): Promise<Field> {
    try {
      return await prisma.field.create({
        data: {
          farmId: data.farmId,
          name: data.name,
          description: data.description || null,
          area: data.area !== undefined ? data.area : null,
          areaUnit: data.areaUnit || 'hectares',
          soilType: data.soilType || null,
          latitude: data.latitude !== undefined ? data.latitude : null,
          longitude: data.longitude !== undefined ? data.longitude : null,
          status: 'ACTIVE',
        },
      });
    } catch {
      const now = new Date();
      const newField: Field = {
        id: `fld_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        farmId: data.farmId,
        name: data.name,
        description: data.description || null,
        area: data.area !== undefined ? data.area : null,
        areaUnit: data.areaUnit || 'hectares',
        soilType: data.soilType || null,
        latitude: data.latitude !== undefined ? data.latitude : null,
        longitude: data.longitude !== undefined ? data.longitude : null,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryFields.set(newField.id, newField);
      return newField;
    }
  }

  async update(id: string, data: UpdateFieldData): Promise<Field> {
    try {
      return await prisma.field.update({
        where: { id },
        data,
      });
    } catch {
      const field = this.inMemoryFields.get(id);
      if (!field) throw new Error('Field not found');
      const updated = {
        ...field,
        ...data,
        updatedAt: new Date(),
      };
      this.inMemoryFields.set(id, updated);
      return updated;
    }
  }

  async archive(id: string): Promise<Field> {
    return this.update(id, { status: 'ARCHIVED' });
  }
}

export const fieldRepository = new FieldRepository();
