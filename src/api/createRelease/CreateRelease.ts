import { mockDb } from "../../mock/mockData";

export interface CreateReleaseRequest {
  name: string;
  releaseDate: string;
  releaseType_name?: string;
  releaseTypeId?: number;
  project_id: number;
  status?: string;
  description?: string;
  version?: string;
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: any;
  statusCode: number;
}

export const createRelease = async (payload: CreateReleaseRequest): Promise<any> => {
  const created = mockDb.createRelease({
    name: payload.name,
    releaseName: payload.name,
    releaseDate: payload.releaseDate,
    releaseTypeName: payload.releaseType_name || 'Major Release',
    releaseTypeId: payload.releaseTypeId || 1,
    projectId: payload.project_id,
    status: payload.status || 'In Progress',
    description: payload.description || '',
    version: payload.version || 'v1.0.0',
  });

  return {
    status: 'success',
    message: 'Release created successfully',
    statusCode: 200,
    data: created,
  };
};
