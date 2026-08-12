import { prisma } from '../config/prisma';
import { Farm, FarmStatus } from '@prisma/client';

export interface CreateFarmData {
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  areaUnit?: string;
}

export interface UpdateFarmData {
  name?: string;
  description?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  areaUnit?: string;
  status?: FarmStatus;
}

export class FarmRepository {
  private inMemoryFarms: Map<string, Farm> = new Map();

  async findById(id: string): Promise<Farm | null> {
    try {
      return await prisma.farm.findUnique({
        where: { id },
      });
    } catch {
      return this.inMemoryFarms.get(id) || null;
    }
  }

  async findByOrganization(organizationId: string): Promise<Farm[]> {
    try {
      return await prisma.farm.findMany({
        where: { organizationId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      const result: Farm[] = [];
      for (const farm of this.inMemoryFarms.values()) {
        if (farm.organizationId === organizationId && farm.status === 'ACTIVE') {
          result.push(farm);
        }
      }
      return result;
    }
  }

  async countByOrganization(organizationId: string): Promise<number> {
    try {
      return await prisma.farm.count({
        where: { organizationId, status: 'ACTIVE' },
      });
    } catch {
      let count = 0;
      for (const farm of this.inMemoryFarms.values()) {
        if (farm.organizationId === organizationId && farm.status === 'ACTIVE') {
          count++;
        }
      }
      return count;
    }
  }

  async create(data: CreateFarmData): Promise<Farm> {
    try {
      return await prisma.farm.create({
        data: {
          organizationId: data.organizationId,
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          locationName: data.locationName || null,
          latitude: data.latitude !== undefined ? data.latitude : null,
          longitude: data.longitude !== undefined ? data.longitude : null,
          area: data.area !== undefined ? data.area : null,
          areaUnit: data.areaUnit || 'hectares',
          status: 'ACTIVE',
        },
      });
    } catch {
      const now = new Date();
      const newFarm: Farm = {
        id: `farm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        organizationId: data.organizationId,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        locationName: data.locationName || null,
        latitude: data.latitude !== undefined ? data.latitude : null,
        longitude: data.longitude !== undefined ? data.longitude : null,
        area: data.area !== undefined ? data.area : null,
        areaUnit: data.areaUnit || 'hectares',
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryFarms.set(newFarm.id, newFarm);
      return newFarm;
    }
  }

  async update(id: string, data: UpdateFarmData): Promise<Farm> {
    try {
      return await prisma.farm.update({
        where: { id },
        data,
      });
    } catch {
      const farm = this.inMemoryFarms.get(id);
      if (!farm) throw new Error('Farm not found');
      const updated = {
        ...farm,
        ...data,
        updatedAt: new Date(),
      };
      this.inMemoryFarms.set(id, updated);
      return updated;
    }
  }

  async archive(id: string): Promise<Farm> {
    return this.update(id, { status: 'ARCHIVED' });
  }
}

export const farmRepository = new FarmRepository();
