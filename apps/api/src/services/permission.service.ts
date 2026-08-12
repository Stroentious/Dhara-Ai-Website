import { Role, Permission, RolePermissionsMap } from '@dhara/shared';

export class PermissionService {
  getPermissionsForRole(role: Role): Permission[] {
    return RolePermissionsMap[role] || RolePermissionsMap.VIEWER;
  }

  getCombinedPermissions(roles: Role[]): Permission[] {
    const permissionsSet = new Set<Permission>();
    for (const role of roles) {
      const perms = this.getPermissionsForRole(role);
      perms.forEach((p) => permissionsSet.add(p));
    }
    return Array.from(permissionsSet);
  }

  hasPermission(role: Role, requiredPermission: Permission): boolean {
    const permissions = this.getPermissionsForRole(role);
    return permissions.includes(requiredPermission);
  }
}

export const permissionService = new PermissionService();
