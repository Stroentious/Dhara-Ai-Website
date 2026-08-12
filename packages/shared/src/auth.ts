/**
 * Authentication, Organization & RBAC Contracts for Dhara AI
 */

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED' | 'DEACTIVATED';
export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type MembershipStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'REMOVED';

export type Role =
  | 'SUPER_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'FARM_OWNER'
  | 'FARM_MANAGER'
  | 'OPERATOR'
  | 'TECHNICIAN'
  | 'VIEWER';

export type Permission =
  | 'USER_READ'
  | 'USER_MANAGE'
  | 'ORGANIZATION_READ'
  | 'ORGANIZATION_UPDATE'
  | 'ORGANIZATION_MEMBERS_MANAGE'
  | 'FARM_READ'
  | 'FARM_CREATE'
  | 'FARM_UPDATE'
  | 'FARM_DELETE'
  | 'DEVICE_READ'
  | 'DEVICE_MANAGE'
  | 'TELEMETRY_READ'
  | 'IRRIGATION_READ'
  | 'IRRIGATION_CONTROL'
  | 'FERTIGATION_READ'
  | 'FERTIGATION_CONTROL'
  | 'AI_READ'
  | 'AI_APPROVE'
  | 'REPORT_READ'
  | 'REPORT_CREATE'
  | 'AUDIT_READ';

export const RolePermissionsMap: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'USER_READ',
    'USER_MANAGE',
    'ORGANIZATION_READ',
    'ORGANIZATION_UPDATE',
    'ORGANIZATION_MEMBERS_MANAGE',
    'FARM_READ',
    'FARM_CREATE',
    'FARM_UPDATE',
    'FARM_DELETE',
    'DEVICE_READ',
    'DEVICE_MANAGE',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'IRRIGATION_CONTROL',
    'FERTIGATION_READ',
    'FERTIGATION_CONTROL',
    'AI_READ',
    'AI_APPROVE',
    'REPORT_READ',
    'REPORT_CREATE',
    'AUDIT_READ',
  ],
  ORGANIZATION_ADMIN: [
    'USER_READ',
    'USER_MANAGE',
    'ORGANIZATION_READ',
    'ORGANIZATION_UPDATE',
    'ORGANIZATION_MEMBERS_MANAGE',
    'FARM_READ',
    'FARM_CREATE',
    'FARM_UPDATE',
    'FARM_DELETE',
    'DEVICE_READ',
    'DEVICE_MANAGE',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'IRRIGATION_CONTROL',
    'FERTIGATION_READ',
    'FERTIGATION_CONTROL',
    'AI_READ',
    'AI_APPROVE',
    'REPORT_READ',
    'REPORT_CREATE',
    'AUDIT_READ',
  ],
  FARM_OWNER: [
    'ORGANIZATION_READ',
    'FARM_READ',
    'FARM_CREATE',
    'FARM_UPDATE',
    'FARM_DELETE',
    'DEVICE_READ',
    'DEVICE_MANAGE',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'IRRIGATION_CONTROL',
    'FERTIGATION_READ',
    'FERTIGATION_CONTROL',
    'AI_READ',
    'AI_APPROVE',
    'REPORT_READ',
    'REPORT_CREATE',
  ],
  FARM_MANAGER: [
    'ORGANIZATION_READ',
    'FARM_READ',
    'FARM_UPDATE',
    'DEVICE_READ',
    'DEVICE_MANAGE',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'IRRIGATION_CONTROL',
    'FERTIGATION_READ',
    'FERTIGATION_CONTROL',
    'AI_READ',
    'AI_APPROVE',
    'REPORT_READ',
    'REPORT_CREATE',
  ],
  OPERATOR: [
    'ORGANIZATION_READ',
    'FARM_READ',
    'DEVICE_READ',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'IRRIGATION_CONTROL',
    'FERTIGATION_READ',
    'FERTIGATION_CONTROL',
    'AI_READ',
    'REPORT_READ',
  ],
  TECHNICIAN: [
    'ORGANIZATION_READ',
    'FARM_READ',
    'DEVICE_READ',
    'DEVICE_MANAGE',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'REPORT_READ',
  ],
  VIEWER: [
    'ORGANIZATION_READ',
    'FARM_READ',
    'DEVICE_READ',
    'TELEMETRY_READ',
    'IRRIGATION_READ',
    'AI_READ',
    'REPORT_READ',
  ],
};

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationDTO {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipDTO {
  id: string;
  userId: string;
  organizationId: string;
  organizationName?: string;
  organizationSlug?: string;
  role: Role;
  status: MembershipStatus;
  createdAt: string;
}

export interface AuthenticatedUserContext extends UserDTO {
  memberships: MembershipDTO[];
  activeOrganizationId?: string;
  activeRole?: Role;
  permissions: Permission[];
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateOrganizationRequest {
  name: string;
  slug?: string;
}
