import { mockDb } from "../../mock/mockData";

export interface BulkSubmodule {
  subModuleId: number;
  subModuleName: string;
  moduleId: number;
  moduleName: string;
}

export const getBulkSubmodulesByModules = async (
  projectId: string | number,
  moduleIds: number[] | string
): Promise<BulkSubmodule[]> => {
  const modules = mockDb.getModules(Number(projectId));
  const ids = Array.isArray(moduleIds)
    ? moduleIds.map(Number)
    : String(moduleIds).split(',').map(Number);

  const result: BulkSubmodule[] = [];
  modules.forEach(m => {
    if (ids.length === 0 || ids.includes(m.id)) {
      (m.submodules || []).forEach(s => {
        result.push({
          subModuleId: s.id,
          subModuleName: s.name || s.subModuleName || 'Submodule',
          moduleId: m.id,
          moduleName: m.name || m.moduleName || 'Module',
        });
      });
    }
  });

  return result;
};
