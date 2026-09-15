import { mockDb } from "../mock/mockData";

export interface DefectStatus {
  color: string;
  name: string;
  id: number;
}

export interface DefectStatusData {
  content: DefectStatus[];
  totalPages: number;
}

export interface DefectStatusResponse {
  status: string;
  statusMessage: string;
  data: DefectStatusData;
  statusCode: number;
}

export interface CreateDefectStatusRequest {
  name: string;
  color: string;
  type: string;
}

export interface UpdateDefectStatusRequest {
  name: string;
  color: string;
  type: string;
}

export const getAllDefectStatuses = async (
  _page: number = 0,
  _pageSize: number = 100
): Promise<DefectStatusData> => {
  const statuses = mockDb.getStatuses();
  return {
    content: statuses.map(s => ({ id: s.id, name: s.statusName, color: s.color })),
    totalPages: 1,
  };
};

export const createDefectStatus = async (
  statusData: CreateDefectStatusRequest
): Promise<DefectStatusResponse> => {
  const created = mockDb.createStatus(statusData);
  return {
    status: 'success',
    statusMessage: 'Status created successfully',
    statusCode: 200,
    data: {
      content: [{ id: created.id, name: created.statusName, color: created.color }],
      totalPages: 1,
    },
  };
};

export const updateDefectStatus = async (
  id: number,
  statusData: UpdateDefectStatusRequest
): Promise<DefectStatusResponse> => {
  const updated = mockDb.updateStatus(id, statusData);
  return {
    status: 'success',
    statusMessage: 'Status updated successfully',
    statusCode: 200,
    data: {
      content: updated ? [{ id: updated.id, name: updated.statusName, color: updated.color }] : [],
      totalPages: 1,
    },
  };
};

export const deleteDefectStatus = async (id: number): Promise<DefectStatusResponse> => {
  mockDb.deleteStatus(id);
  return {
    status: 'success',
    statusMessage: 'Status deleted successfully',
    statusCode: 200,
    data: {
      content: [],
      totalPages: 1,
    },
  };
};
