import { mockDb } from "../../mock/mockData";

export const updateRole = async (id: number, data: { name: string; type?: string }) => {
  const updated = mockDb.updateRole(id, data.name);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Role updated successfully',
    data: updated ? { id: updated.id, name: updated.roleName } : null,
  };
};