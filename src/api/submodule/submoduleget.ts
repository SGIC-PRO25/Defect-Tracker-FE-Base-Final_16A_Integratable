import { mockDb } from "../../mock/mockData";

export interface Submodule {
  id: number;
  name: string;
  submoduleName?: string;
  subModuleName?: string;
  getSubModuleName?: string;
}

export interface GetSubmodulesResponse {
  status: string;
  message: string;
  data: Submodule[];
  statusCode: number;
}

export const getSubmodulesByModule = async (moduleId: number): Promise<GetSubmodulesResponse> => {
  const submodules = mockDb.getSubmodulesByModule(Number(moduleId));
  return {
    status: 'success',
    message: 'Submodules fetched successfully',
    statusCode: 200,
    data: submodules.map(s => ({
      id: s.id,
      name: s.name || s.subModuleName || 'Submodule',
      submoduleName: s.name || s.subModuleName || 'Submodule',
      subModuleName: s.name || s.subModuleName || 'Submodule',
      getSubModuleName: s.name || s.subModuleName || 'Submodule',
    })),
  };
};

export const getSubmodulesByModuleId = async (moduleId: number): Promise<GetSubmodulesResponse> => {
  return getSubmodulesByModule(moduleId);
};
