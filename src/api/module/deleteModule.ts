import { mockDb } from "../../mock/mockData";

export const deleteModule = async (_projectId: number, id: number): Promise<{ status: string; statusCode?: string; data?: any[]; message?: string }> => {
  mockDb.deleteModule(id);
  return {
    status: 'success',
    statusCode: '200',
    message: 'Module deleted successfully',
  };
};
