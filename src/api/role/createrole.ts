import { mockDb } from "../../mock/mockData";

export const createRoles = async (data: { name: string; type?: string }) => {
  const created = mockDb.createRole(data.name);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Role created successfully',
    data: { id: created.id, name: created.roleName },
  };
};