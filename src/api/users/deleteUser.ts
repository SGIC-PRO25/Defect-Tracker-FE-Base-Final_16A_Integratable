import { mockDb } from "../../mock/mockData";

export async function deleteUser(id: number) {
  mockDb.deleteUser(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'User deleted successfully',
  };
}