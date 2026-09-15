import { mockDb } from "../../mock/mockData";

export interface DefectDensityData {
  kloc: number;
  totalDefects: number;
  defectDensity: number;
}

export interface DefectDensityResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: DefectDensityData;
}

export interface KlocResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    kloc: number;
  };
}

export const getKILOC = async (projectId: number): Promise<KlocResponse> => {
  const project = mockDb.getProjectById(projectId);
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'KLOC fetched successfully',
    data: {
      kloc: project?.kloc || 45,
    },
  };
};

export const getDefectDensity = async (projectId: number): Promise<DefectDensityResponse> => {
  const project = mockDb.getProjectById(projectId);
  const defects = mockDb.getDefects(projectId);
  const kloc = project?.kloc || 45;
  const totalDefects = defects.length || 10;
  const defectDensity = Number((totalDefects / (kloc || 1)).toFixed(2));

  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Defect density fetched successfully',
    data: {
      kloc,
      totalDefects,
      defectDensity,
    },
  };
};