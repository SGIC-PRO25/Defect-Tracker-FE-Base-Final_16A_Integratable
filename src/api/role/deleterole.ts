import { mockDb } from "../../mock/mockData";

export const deleterole = async (id: number) => {
  mockDb.deleteRole(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Role deleted successfully',
  };
};
