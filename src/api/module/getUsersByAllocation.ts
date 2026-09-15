import { mockDb } from "../../mock/mockData";

export interface UserByAllocation {
  userId: number;
  userName: string;
  userRole?: string;
  userWithRole: string;
  allocateModuleId?: number;
  allocationId?: number;
  moduleName?: string;
  projectName?: string;
  moduleId?: number;
  projectId?: number;
  subModuleId?: number;
}

export const getUsersByAllocation = async (projectId: number, moduleId: number): Promise<UserByAllocation[]> => {
  const mod = mockDb.getModuleById(moduleId);
  if (!mod || !mod.leaderId) return [];
  return [{
    allocateModuleId: 1,
    moduleId: mod.id,
    userId: mod.leaderId,
    userName: mod.leaderName || `User ${mod.leaderId}`,
    userWithRole: mod.leaderName || `User ${mod.leaderId}`,
    projectId: projectId,
  }];
};

export const getUsersBySubmoduleAllocation = async (projectId: number, moduleId: number, subModuleId: number): Promise<UserByAllocation[]> => {
  const users = mockDb.getUsers();
  return users.slice(0, 2).map(u => ({
    allocationId: u.id,
    userId: u.id,
    userName: `${u.firstName} ${u.lastName}`,
    userWithRole: `${u.firstName} ${u.lastName}`,
    userRole: u.roleName || 'Developer',
    moduleId,
    projectId,
    subModuleId,
  }));
};

export async function getUsersByModuleSubmoduleAllocation(projectId: number) {
  const users = mockDb.getUsers();
  return {
    status: 'success',
    message: 'Developers retrieved successfully',
    data: users.map(u => ({
      employeeId: u.id,
      employeeName: `${u.firstName} ${u.lastName}`,
      roleName: u.roleName || 'Developer',
      projectId,
    })),
    statusCode: 200,
  };
}