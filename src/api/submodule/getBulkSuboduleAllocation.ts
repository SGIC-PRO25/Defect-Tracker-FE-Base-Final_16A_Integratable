import { mockDb } from "../../mock/mockData";

export const getBulkSuboduleAllocation = async (
  projectId: number,
  moduleId: number,
  submoduleId: number
) => {
  const users = mockDb.getUsers();
  return users.slice(0, 2).map(u => ({
    id: u.id,
    employeeId: u.id,
    employeeName: `${u.firstName} ${u.lastName}`,
    projectId,
    moduleId,
    submoduleId,
    role: u.roleName || 'Developer',
  }));
};