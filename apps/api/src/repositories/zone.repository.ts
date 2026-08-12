import { prisma } from '../config/prisma';
import { Zone, ZoneStatus, IrrigationType } from '@prisma/client';

export interface CreateZoneData {
  fieldId: string;
  name: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  irrigationType?: IrrigationType;
}

export interface UpdateZoneData {
  name?: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  irrigationType?: IrrigationType;
  status?: ZoneStatus;
}

export class ZoneRepository {
  private inMemoryZones: Map<string, Zone> = new Map();

  async findById(id: string): Promise<Zone | null> {
    try {
      return await prisma.zone.findUnique({
        where: { id },
      });
    } catch {
      return this.inMemoryZones.get(id) || null;
    }
  }

  async findByField(fieldId: string): Promise<Zone[]> {
    try {
      return await prisma.zone.findMany({
        where: { fieldId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      const result: Zone[] = [];
      for (const zone of this.inMemoryZones.values()) {
        if (zone.fieldId === fieldId && zone.status === 'ACTIVE') {
          result.push(zone);
        }
      }
      return result;
    }
  }

  async countByOrganization(organizationId: string): Promise<number> {
    try {
      return await prisma.zone.count({
        where: {
          field: { farm: { organizationId } },
          status: 'ACTIVE',
        },
      });
    } catch {
      let count = 0;
      for (const zone of this.inMemoryZones.values()) {
        if (zone.status === 'ACTIVE') {
          count++;
        }
      }
      return count;
    }
  }

  async create(data: CreateZoneData): Promise<Zone> {
    try {
      return await prisma.zone.create({
        data: {
          fieldId: data.fieldId,
          name: data.name,
          description: data.description || null,
          area: data.area !== undefined ? data.area : null,
          areaUnit: data.areaUnit || 'hectares',
          irrigationType: data.irrigationType || 'DRIP',
          status: 'ACTIVE',
        },
      });
    } catch {
      const now = new Date();
      const newZone: Zone = {
        id: `zne_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        fieldId: data.fieldId,
        name: data.name,
        description: data.description || null,
        area: data.area !== undefined ? data.area : null,
        areaUnit: data.areaUnit || 'hectares',
        irrigationType: data.irrigationType || 'DRIP',
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryZones.set(newZone.id, newZone);
      return newZone;
    }
  }

  async update(id: string, data: UpdateZoneData): Promise<Zone> {
    try {
      return await prisma.zone.update({
        where: { id },
        data,
      });
    } catch {
      const zone = this.inMemoryZones.get(id);
      if (!zone) throw new Error('Zone not found');
      const updated = {
        ...zone,
        ...data,
        updatedAt: new Date(),
      };
      this.inMemoryZones.set(id, updated);
      return updated;
    }
  }

  async archive(id: string): Promise<Zone> {
    return this.update(id, { status: 'ARCHIVED' });
  }
}

export const zoneRepository = new ZoneRepository();
