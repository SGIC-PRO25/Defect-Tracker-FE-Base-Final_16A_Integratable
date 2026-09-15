import { mockDb } from "../mock/mockData";

export interface ApiDefectType {
  id: number;
  defectTypeName: string;
  description: string;
  category: 'functional' | 'performance' | 'security' | 'usability' | 'compatibility' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDefectTypesResponse {
  status: string;
  message: string;
  data: {
    content: ApiDefectType[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const createDefectType = async (data: { name: string }) => {
  const created = mockDb.createDefectType(data.name);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Defect type created successfully',
    data: { id: created.id, name: created.defectTypeName },
  };
};

export const updateDefectType = async (id: number, data: { name: string }) => {
  const updated = mockDb.updateDefectType(id, data.name);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Defect type updated successfully',
    data: updated ? { id: updated.id, defectTypeName: updated.defectTypeName } : null,
  };
};

export const getDefectTypes = async (_page = 0, _size = 100): Promise<GetDefectTypesResponse> => {
  const defectTypes = mockDb.getDefectTypes();
  const now = new Date().toISOString();
  return {
    status: 'success',
    message: 'Success',
    data: {
      content: defectTypes.map(d => ({
        id: d.id,
        defectTypeName: d.defectTypeName,
        description: d.description || d.defectTypeName,
        category: 'functional',
        severity: 'medium',
        priority: 'medium',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })),
      totalElements: defectTypes.length,
      totalPages: 1,
      pageNumber: 0,
      pageSize: 100,
    },
  };
};

export const deleteDefectType = async (id: number) => {
  mockDb.deleteDefectType(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Defect type deleted successfully',
  };
};