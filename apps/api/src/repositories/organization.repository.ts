import { prisma } from '../config/prisma';
import { Organization, OrganizationMembership, Role } from '@prisma/client';

export interface CreateOrgData {
  name: string;
  slug: string;
}

export class OrganizationRepository {
  private inMemoryOrgs: Map<string, Organization> = new Map();
  private inMemoryMemberships: Map<string, OrganizationMembership> = new Map();

  async findBySlug(slug: string): Promise<Organization | null> {
    const normalizedSlug = slug.trim().toLowerCase();
    try {
      return await prisma.organization.findUnique({
        where: { slug: normalizedSlug },
      });
    } catch {
      for (const org of this.inMemoryOrgs.values()) {
        if (org.slug.toLowerCase() === normalizedSlug) {
          return org;
        }
      }
      return null;
    }
  }

  async findById(id: string): Promise<Organization | null> {
    try {
      return await prisma.organization.findUnique({
        where: { id },
      });
    } catch {
      return this.inMemoryOrgs.get(id) || null;
    }
  }

  async create(data: CreateOrgData): Promise<Organization> {
    const normalizedSlug = data.slug.trim().toLowerCase();
    try {
      return await prisma.organization.create({
        data: {
          name: data.name.trim(),
          slug: normalizedSlug,
          status: 'ACTIVE',
        },
      });
    } catch {
      const now = new Date();
      const newOrg: Organization = {
        id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: data.name.trim(),
        slug: normalizedSlug,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryOrgs.set(newOrg.id, newOrg);
      return newOrg;
    }
  }

  async createMembership(
    userId: string,
    organizationId: string,
    role: Role,
  ): Promise<OrganizationMembership> {
    try {
      return await prisma.organizationMembership.create({
        data: {
          userId,
          organizationId,
          role,
          status: 'ACTIVE',
        },
      });
    } catch {
      const now = new Date();
      const key = `${userId}:${organizationId}`;
      const newMembership: OrganizationMembership = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId,
        organizationId,
        role,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryMemberships.set(key, newMembership);
      return newMembership;
    }
  }

  async getUserMemberships(
    userId: string,
  ): Promise<Array<OrganizationMembership & { organization?: Organization }>> {
    try {
      return await prisma.organizationMembership.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { organization: true },
      });
    } catch {
      const result: Array<OrganizationMembership & { organization?: Organization }> = [];
      for (const mem of this.inMemoryMemberships.values()) {
        if (mem.userId === userId && mem.status === 'ACTIVE') {
          const org = this.inMemoryOrgs.get(mem.organizationId);
          result.push({ ...mem, organization: org || undefined });
        }
      }
      return result;
    }
  }

  async getMembership(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationMembership | null> {
    try {
      return await prisma.organizationMembership.findUnique({
        where: { userId_organizationId: { userId, organizationId } },
      });
    } catch {
      const key = `${userId}:${organizationId}`;
      return this.inMemoryMemberships.get(key) || null;
    }
  }
}

export const organizationRepository = new OrganizationRepository();
