import { mockDb } from "../../mock/mockData";

export interface Modules {
  id: number;
  name: string;
  projectId: number;
  assignedDev: {
    userId: number;
    userName: string;
  } | null;
  submodules?: any[];
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: Modules[];
  statusCode: number;
}

export const getModulesByProjectId = async (projectId: number): Promise<CreateReleaseResponse> => {
  const modules = mockDb.getModules(Number(projectId));
  return {
    status: 'success',
    message: 'Modules fetched successfully',
    statusCode: 200,
    data: modules.map(m => ({
      id: m.id,
      name: m.name || m.moduleName || 'Module',
      projectId: m.projectId,
      assignedDev: m.leaderId ? {
        userId: m.leaderId,
        userName: m.leaderName || 'Module Leader',
      } : null,
      submodules: m.submodules || [],
    })),
  };
};

export async function getAllocatedUsersByModuleId(moduleId: string | number) {
  const mod = mockDb.getModuleById(Number(moduleId));
  const users = mockDb.getUsers();
  return users.filter(u => mod?.assignedDevs?.includes(`${u.firstName} ${u.lastName}`) || u.id === mod?.leaderId);
}

export async function getUsersByAllocation(projectId: string | number, _moduleId: string | number, _subModuleId?: string | number) {
  return mockDb.getUsers();
}
