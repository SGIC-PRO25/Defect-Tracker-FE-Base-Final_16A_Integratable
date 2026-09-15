import { mockDb } from "../../mock/mockData";

export interface Designations {
  id: number;
  name: string;
}

export interface CreateDesignations {
  name: string;
}

export async function getDesignations(_page: number = 0, _size: number = 100) {
  const designations = mockDb.getDesignations();
  return {
    status: 'success',
    statusCode: 200,
    data: {
      content: designations.map(d => ({ id: d.id, name: d.designationName })),
      totalElements: designations.length,
      totalPages: 1,
      size: 100,
      number: 0,
    },
  };
}

export const getAllDesignations = getDesignations;

export async function createDesignation(data: CreateDesignations) {
  const created = mockDb.createDesignation(data.name);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Designation created successfully',
    data: { id: created.id, name: created.designationName },
  };
}

export async function putDesignation(id: number, data: CreateDesignations) {
  const updated = mockDb.updateDesignation(id, data.name);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Designation updated successfully',
    data: updated ? { id: updated.id, name: updated.designationName } : null,
  };
}

export const updateDesignation = putDesignation;

export async function deleteDesignation(id: number) {
  mockDb.deleteDesignation(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Designation deleted successfully',
  };
}
