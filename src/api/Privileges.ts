import { mockDb, INITIAL_PERMISSIONS } from "../mock/mockData";

export interface Permission {
  permissionId: number;
  action: string;
  description: string | null;
}

export type PermissionId = number | string;

export interface ModulePermission {
  module: string;
  permissions: Permission[];
}

export interface GetPrivilegesResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: ModulePermission[];
}

export interface PermissionAssignmentChange {
  permissionId: string;
  isAssigned: boolean;
}

export interface EmployeePermissionUpdatePayload {
  permissionIds: number[];
}

export interface RolePermissionResponse {
  status: string;
  statusCode: number | string;
  statusMessage: string;
  data: {
    permissionIds: number[];
    messages: string[];
  };
}

export interface UserPrivilegeResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    module: string;
    permissions: {
      permissionId: number;
      action: string;
      description: string | null;
      checked: boolean;
      inheritedFromRole: boolean;
    }[];
  }[];
}

export interface RolePermissionByRoleResponse {
  permissionIds: PermissionId[];
}

export const getAllPrivileges = async (): Promise<GetPrivilegesResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: INITIAL_PERMISSIONS,
  };
};

export const getRolePermission = async (_roleId: number): Promise<RolePermissionResponse> => {
  const allIds: number[] = [];
  INITIAL_PERMISSIONS.forEach(m => {
    m.permissions.forEach(p => allIds.push(p.permissionId));
  });

  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: {
      permissionIds: allIds,
      messages: ['All permissions assigned'],
    },
  };
};

export const getRolePermissionByRoleId = async (
  _roleId: number | string
): Promise<RolePermissionByRoleResponse> => {
  const allIds: PermissionId[] = [];
  INITIAL_PERMISSIONS.forEach(m => {
    m.permissions.forEach(p => allIds.push(p.permissionId));
  });

  return {
    permissionIds: allIds,
  };
};

export const addRolePermission = async (roleId: number, rolePermissions: PermissionAssignmentChange[]): Promise<RolePermissionResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Role permissions updated successfully',
    data: {
      permissionIds: rolePermissions.map(p => Number(p.permissionId)),
      messages: ['Permissions updated successfully'],
    },
  };
};

export const getAllEmployeePermission = async (_employeeId: number): Promise<UserPrivilegeResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: INITIAL_PERMISSIONS.map(m => ({
      module: m.module,
      permissions: m.permissions.map(p => ({
        permissionId: p.permissionId,
        action: p.action,
        description: p.description,
        checked: true,
        inheritedFromRole: true,
      })),
    })),
  };
};

export const addEmployeePermission = async (_employeeId: number, payload: EmployeePermissionUpdatePayload): Promise<UserPrivilegeResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Employee permissions updated successfully',
    data: INITIAL_PERMISSIONS.map(m => ({
      module: m.module,
      permissions: m.permissions.map(p => ({
        permissionId: p.permissionId,
        action: p.action,
        description: p.description,
        checked: payload.permissionIds.includes(p.permissionId),
        inheritedFromRole: false,
      })),
    })),
  };
};
