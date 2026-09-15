import { mockDb } from "../mock/mockData";

export interface Severity {
  id: number;
  name: string;
  color: string;
  weight: number;
}

export interface CreateSeverityRequest {
  name: string;
  color: string;
  weight: number;
}

export interface CreateSeverityResponse {
  status: string;
  message: string;
  statusCode: number;
  data?: Severity;
}

export interface GetSeveritiesResponse {
  status: string;
  message: string;
  data: {
    content: Severity[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export const createSeverity = async (data: CreateSeverityRequest): Promise<CreateSeverityResponse> => {
  const created = mockDb.createSeverity(data);
  return {
    status: 'success',
    message: 'Severity created successfully',
    statusCode: 200,
    data: { id: created.id, name: created.severityName, color: created.color, weight: created.weight },
  };
};

export const updateSeverity = async (id: number, data: Partial<CreateSeverityRequest>): Promise<CreateSeverityResponse> => {
  const updated = mockDb.updateSeverity(id, data);
  return {
    status: 'success',
    message: 'Severity updated successfully',
    statusCode: 200,
    data: updated ? { id: updated.id, name: updated.severityName, color: updated.color, weight: updated.weight } : undefined,
  };
};

export const getSeverities = async (
  _page: number = 0,
  _pageSize: number = 100
): Promise<GetSeveritiesResponse> => {
  const severities = mockDb.getSeverities();
  return {
    status: 'success',
    message: 'Severities fetched successfully',
    data: {
      content: severities.map(s => ({ id: s.id, name: s.severityName, color: s.color, weight: s.weight })),
      totalElements: severities.length,
      totalPages: 1,
      size: 100,
      number: 0,
    },
  };
};

export const deleteSeverity = async (id: number) => {
  mockDb.deleteSeverity(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Severity deleted successfully',
  };
};
