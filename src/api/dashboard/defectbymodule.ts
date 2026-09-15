import { mockDb } from "../../mock/mockData";

interface DefectByModule {
  name: string;
  value: number;
  percentage?: number;
}

export interface DefectsByModuleResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: DefectByModule[];
}

export async function getDefectsByModule(
  projectId: number
): Promise<DefectsByModuleResponse> {
  const modules = mockDb.getModules(projectId);
  const data: DefectByModule[] = modules.map(m => ({
    name: m.name || m.moduleName || 'Module',
    value: Math.floor(Math.random() * 8) + 2,
    percentage: 0,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const withPercentage = data.map(item => ({
    ...item,
    percentage: Number(((item.value / total) * 100).toFixed(1)),
  }));

  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: withPercentage,
  };
}