import { mockDb } from "../../mock/mockData";

export const getSubmodulesByModule = async (moduleId: number) => {
  const submodules = mockDb.getSubmodulesByModule(Number(moduleId));
  return {
    status: 'success',
    statusCode: 200,
    data: submodules.map(s => ({
      ...s,
      subModuleName: s.name || s.subModuleName,
    })),
  };
};

export const getSubmodulesByModuleId = getSubmodulesByModule;
