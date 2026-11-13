import { mockDb } from "../mock/mockData";

export interface Releasetype {
  id: number;
  name: string;
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
      content: releaseTypes.map(r => ({ id: r.id, name: r.releaseTypeName || '', releaseTypeName: r.releaseTypeName || '' })),
    },
  };
};

export const createReleaseType = async (data: CreateReleaseTypeRequest): Promise<Releasetype> => {
  const created = mockDb.createReleaseType({ releaseTypeName: data.releaseTypeName });
  return { id: created.id, name: created.releaseTypeName, releaseTypeName: created.releaseTypeName };
};

export const updateReleaseType = async (id: number, data: UpdateReleaseTypeRequest): Promise<Releasetype> => {
  const updated = mockDb.updateReleaseType(id, { releaseTypeName: data.releaseTypeName });
  const name = updated?.releaseTypeName || data.releaseTypeName;
  return { id: updated?.id || id, name, releaseTypeName: name };
};

export const deleteReleaseType = async (id: number): Promise<any> => {
  mockDb.deleteReleaseType(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Release type deleted successfully',
  };
};