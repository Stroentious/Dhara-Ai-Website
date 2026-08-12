import { organizationRepository } from '../repositories/organization.repository';
import { auditRepository } from '../repositories/audit.repository';
import { AppError } from '../middlewares/error.middleware';
import {
  CreateOrganizationRequest,
  OrganizationDTO,
  OrganizationStatus,
  Role,
} from '@dhara/shared';

export class OrganizationService {
  async createOrganization(
    userId: string,
    data: CreateOrganizationRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<OrganizationDTO> {
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError('Organization name is required', 400, 'VAL_001');
    }

    const rawSlug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const slug = rawSlug || `org-${Date.now()}`;

    const existingSlug = await organizationRepository.findBySlug(slug);
    if (existingSlug) {
      throw new AppError('An organization with this slug already exists', 400, 'ORG_001');
    }

    const org = await organizationRepository.create({
      name: data.name.trim(),
      slug,
    });

    // Controlled Server-Side Rule: Creator automatically receives ORGANIZATION_ADMIN
    await organizationRepository.createMembership(userId, org.id, 'ORGANIZATION_ADMIN');

    await auditRepository.logEvent({
      userId,
      organizationId: org.id,
      eventType: 'ORGANIZATION_CREATED',
      ipAddress,
      userAgent,
      detailsJson: JSON.stringify({ name: org.name, slug: org.slug }),
    });

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      status: org.status as OrganizationStatus,
      role: 'ORGANIZATION_ADMIN',
      createdAt:
        org.createdAt instanceof Date
          ? org.createdAt.toISOString()
          : new Date(org.createdAt).toISOString(),
      updatedAt:
        org.updatedAt instanceof Date
          ? org.updatedAt.toISOString()
          : new Date(org.updatedAt).toISOString(),
    };
  }

  async getUserOrganizations(userId: string): Promise<OrganizationDTO[]> {
    const memberships = await organizationRepository.getUserMemberships(userId);
    return memberships.map((m) => ({
      id: m.organizationId,
      name: m.organization?.name || 'Organization',
      slug: m.organization?.slug || 'organization',
      status: (m.organization?.status || 'ACTIVE') as OrganizationStatus,
      role: m.role as Role,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));
  }
}

export const organizationService = new OrganizationService();
