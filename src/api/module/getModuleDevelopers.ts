import { mockDb } from "../../mock/mockData";

export const getDevelopersByModuleId = async (_projectId: number, _moduleId: number) => {
  const users = mockDb.getUsers();
  return users.map(u => ({
    id: u.id,
    employeeId: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
  }));
};

export const getDevelopersBySubmoduleId = async (_projectId: number, _moduleId: number, _submoduleId: number) => {
  const users = mockDb.getUsers();
  return users.map(u => ({
    id: u.id,
    employeeId: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
  }));
};