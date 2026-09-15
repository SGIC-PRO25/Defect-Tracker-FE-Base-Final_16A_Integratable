import { mockDb } from "../../mock/mockData";

export interface SubDevWithName {
  id: number;
  employeeId: number;
  submoduleId: number;
  employeeName?: string;
}

export interface SubDevWithNameResponse {
  status: number;
  statusCode: string;
  statusMessage: string;
  data: SubDevWithName[];
}

export const getAllSubDevwithName = async (
  submoduleId: number
): Promise<SubDevWithNameResponse> => {
  const users = mockDb.getUsers();
  return {
    status: 200,
    statusCode: '200',
    statusMessage: 'Success',
    data: users.slice(0, 2).map(u => ({
      id: u.id,
      employeeId: u.id,
      submoduleId,
      employeeName: `${u.firstName} ${u.lastName}`,
    })),
  };
};

export default getAllSubDevwithName;