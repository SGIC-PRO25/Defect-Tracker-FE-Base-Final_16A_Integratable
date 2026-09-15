import { mockDb } from "../mock/mockData";

export interface SubModuleDevResponse {
  status: string;
  statusCode: number | string;
  statusMessage: string;
  data: SubModuleDevAllocation[];
}

export interface SubModuleDevAllocation {
  id: number | string;
  employeeId: number | string;
  submoduleId: number | string;
  employeeName?: string;
}

export const getAllSubmoduleAllocatedDevBySubmoduleId = async (
  subModuleId: number
): Promise<SubModuleDevResponse> => {
  const users = mockDb.getUsers();
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Success',
    data: users.slice(0, 2).map(u => ({
      id: u.id,
      employeeId: u.id,
      submoduleId: subModuleId,
      employeeName: `${u.firstName} ${u.lastName}`,
    })),
  };
};

export const allocateProjectEmployeeToSubModule = async (
  subModuleId: number,
  employeeId: number
): Promise<SubModuleDevResponse> => {
  const user = mockDb.getUserById(employeeId);
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Developer allocated to submodule successfully',
    data: [{
      id: employeeId,
      employeeId,
      submoduleId: subModuleId,
      employeeName: user ? `${user.firstName} ${user.lastName}` : 'Developer',
    }],
  };
};

export const deAllocateProjectEmployeeFromSubModule = async (
  subModuleId: number,
  employeeId: number
): Promise<SubModuleDevResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Developer deallocated from submodule successfully',
    data: [],
  };
};
