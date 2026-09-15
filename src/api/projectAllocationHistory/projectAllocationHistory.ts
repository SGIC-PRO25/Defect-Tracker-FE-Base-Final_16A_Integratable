import { mockDb } from "../../mock/mockData";

export interface getProjectAllocationHistoryResponse {
  status: string;
  message: string;
  data: any[];
  statusCode: number;
}

export const getProjectAllocationHistory = async (id: number): Promise<any> => {
  const users = mockDb.getUsers();
  return users.map(u => ({
    id: u.id,
    employeeId: u.id,
    employeeName: `${u.firstName} ${u.lastName}`,
    roleName: u.roleName || 'Developer',
    designationName: u.designationName || 'Software Engineer',
    allocationPercent: 50,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    status: 'ACTIVE',
    projectId: id,
  }));
};

export const getProjectAllocationHistoryByRole = async (projectId: number, _roleId?: string): Promise<any> => {
  return getProjectAllocationHistory(projectId);
};
