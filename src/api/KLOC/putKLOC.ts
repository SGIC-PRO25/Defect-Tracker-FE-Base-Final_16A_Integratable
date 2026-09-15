import { mockDb } from "../../mock/mockData";

export interface CalculateKlocRequest {
  backendRepo: string;
  frontendRepo: string;
  githubUsername: string;
  githubToken: string;
}

export interface CalculateKlocResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    backendLOC: number;
    frontendLOC: number;
    backendKLOC: number;
    frontendKLOC: number;
    totalKLOC: number;
  };
}

export interface UpdateKlocResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    kiloOfCode: number;
  };
}

export const updateProjectKloc = async (projectId: number, kloc: number): Promise<UpdateKlocResponse> => {
  mockDb.updateProject(projectId, { kloc });
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Project KLOC updated successfully',
    data: {
      kiloOfCode: kloc,
    },
  };
};

export const calculateKlocFromGithub = async (_payload: CalculateKlocRequest): Promise<CalculateKlocResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'KLOC calculated from GitHub successfully',
    data: {
      backendLOC: 32450,
      frontendLOC: 18200,
      backendKLOC: 32.45,
      frontendKLOC: 18.2,
      totalKLOC: 50.65,
    },
  };
};
