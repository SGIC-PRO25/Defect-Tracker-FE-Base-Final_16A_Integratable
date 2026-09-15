import { mockDb } from "../mock/mockData";

export type RoleType =
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "QA_LEAD"
  | "QA_ENGINEER"
  | "DEV_LEAD"
  | "SENIOR_DEVELOPER"
  | "DEVELOPER"
  | "JUNIOR_DEVELOPER"
  | "BUSINESS_ANALYST"
  | "UI_UX_DESIGNER"
  | "DEVOPS_ENGINEER"
  | "SUPPORT_ENGINEER"
  | "CLIENT";

export const roleTypeBasedRoleFetch = async (
  roleType: RoleType,
): Promise<string[]> => {
  const roles = mockDb.getRoles();
  return roles
    .filter((role) => (role.type as string) === roleType || role.roleName?.toUpperCase().includes(roleType.replace('_', ' ')))
    .map((role) => role.roleName);
};

export const roleTypesBasedRoleFetch = async (
  roleTypes: RoleType[],
): Promise<string[]> => {
  const roles = mockDb.getRoles();
  return roles
    .filter((role) => {
      const typeStr = (role.type || '') as RoleType;
      return roleTypes.includes(typeStr) || roleTypes.some(t => role.roleName?.toUpperCase().includes(t.replace('_', ' ')));
    })
    .map((role) => role.roleName);
};

export const roleTypeBasedRoleIdFetch = async (
  roleType: RoleType,
): Promise<number[]> => {
  const roles = mockDb.getRoles();
  return roles
    .filter((role) => (role.type as string) === roleType || role.roleName?.toUpperCase().includes(roleType.replace('_', ' ')))
    .map((role) => role.id);
};