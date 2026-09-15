import { mockDb } from "../../mock/mockData";

export interface UpdateUserPayload {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo?: string;
  joinDate?: string;
  gender?: "Male" | "Female";
  designationId?: number;
}

export async function updateUser(id: number, userData: UpdateUserPayload) {
  const updated = mockDb.updateUser(id, userData);
  return {
    status: 'success',
    statusCode: 200,
    message: 'User updated successfully',
    data: updated,
  };
}

export async function updateUserStatus(id: number, status: boolean) {
  const updated = mockDb.updateUser(id, { userStatus: status ? 'ACTIVE' : 'INACTIVE' });
  return {
    status: 'success',
    statusCode: 200,
    message: 'User status updated successfully',
    data: updated,
  };
}
