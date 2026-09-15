import { mockDb } from "../../mock/mockData";

export async function createUser(userData: any) {
  const created = mockDb.createUser(userData);
  return {
    status: 'success',
    statusCode: 200,
    message: 'User created successfully',
    data: created,
  };
}