import { mockDb } from "../mock/mockData";

export interface Priority {
  id: number;
  name: string;
  color: string;
}

export interface GetPrioritiesResponse {
  status: string;
  message: string;
  data: {
    content: Priority[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export const getAllPriorities = async (
  _page: number = 0,
  _pageSize: number = 100
): Promise<GetPrioritiesResponse> => {
  const priorities = mockDb.getPriorities();
  return {
    status: 'success',
    message: 'Priorities fetched successfully',
    data: {
      content: priorities.map(p => ({ id: p.id, name: p.priorityName, color: p.color })),
      totalElements: priorities.length,
      totalPages: 1,
      size: 100,
      number: 0,
    },
  };
};

export const updatePriority = async (id: number, data: { name: string; color: string }) => {
  const updated = mockDb.updatePriority(id, data);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Priority updated successfully',
    data: updated ? { id: updated.id, name: updated.priorityName, color: updated.color } : null,
  };
};

export const deletePriority = async (id: number) => {
  mockDb.deletePriority(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Priority deleted successfully',
  };
};

export const createPriority = async (data: { name: string; color: string }) => {
  const created = mockDb.createPriority(data);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Priority created successfully',
    data: { id: created.id, name: created.priorityName, color: created.color },
  };
};