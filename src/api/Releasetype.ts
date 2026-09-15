import { mockDb } from "../mock/mockData";

export interface Releasetype {
  id: number;
  releaseTypeName: string;
}

export interface ReleaseTypeList {
  totalElements?: number;
  content?: Releasetype[];
}

export interface ReleaseTypeResponse {
  status: string;
  statusMessage: string;
  data: ReleaseTypeList;
  statusCode: number;
}

export interface CreateReleaseTypeRequest {
  releaseTypeName: string;
}

export interface UpdateReleaseTypeRequest {
  releaseTypeName: string;
}

export const getAllReleaseTypes = async (_page: number, _size: number): Promise<ReleaseTypeResponse> => {
  const releaseTypes = mockDb.getReleaseTypes();
  return {
    status: 'success',
    statusMessage: 'Success',
    statusCode: 200,
    data: {
      totalElements: releaseTypes.length,
      content: releaseTypes.map(r => ({ id: r.id, releaseTypeName: r.releaseTypeName })),
    },
  };
};

export const createReleaseType = async (data: CreateReleaseTypeRequest): Promise<Releasetype> => {
  const created = mockDb.createReleaseType(data.releaseTypeName);
  return { id: created.id, releaseTypeName: created.releaseTypeName };
};

export const updateReleaseType = async (id: number, data: UpdateReleaseTypeRequest): Promise<Releasetype> => {
  const updated = mockDb.updateReleaseType(id, data.releaseTypeName);
  return { id: updated?.id || id, releaseTypeName: updated?.releaseTypeName || data.releaseTypeName };
};

export const deleteReleaseType = async (id: number): Promise<any> => {
  mockDb.deleteReleaseType(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Release type deleted successfully',
  };
};