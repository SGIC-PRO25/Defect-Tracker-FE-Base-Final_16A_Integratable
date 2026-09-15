import { mockDb } from '../../mock/mockData';

export const deleteProject = async (projectId: string | number): Promise<any> => {
  mockDb.deleteProject(projectId);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project deleted successfully',
  };
};