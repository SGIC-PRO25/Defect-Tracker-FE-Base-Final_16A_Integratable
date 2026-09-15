import { mockDb } from "../../mock/mockData";

interface Modules {
  id: number;
  name: string;
  projectId: number;
  submodules?: any[];
  assignedDevs?: string[];
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: Modules[];
  statusCode: number;
}

export const getModulesByProject = async (projectId: number): Promise<CreateReleaseResponse> => {
  const modules = mockDb.getModules(Number(projectId));
  return {
    status: 'success',
    message: 'Modules fetched successfully',
    statusCode: 200,
    data: modules.map(m => ({
      id: m.id,
      name: m.name || m.moduleName || 'Module',
      projectId: m.projectId,
      submodules: m.submodules || [],
      assignedDevs: m.assignedDevs || [],
    })),
  };
};