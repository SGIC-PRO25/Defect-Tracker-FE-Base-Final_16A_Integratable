import { mockDb } from "../../mock/mockData";

export interface SimpleUser {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  designationId?: number;
  designationName?: string;
}

interface GetUsersByDesignationResponse {
  status: string;
  data: SimpleUser[];
}

export async function getAllUsers(page: number = 0, size: number = 10) {
  const users = mockDb.getUsers();
  const start = page * size;
  const paged = users.slice(start, start + size);

  return {
    status: 'success',
    statusCode: 200,
    data: {
      content: paged,
      totalElements: users.length,
      totalPages: Math.ceil(users.length / size),
      size,
      number: page,
    },
  };
}

export async function getAllUsersSimple() {
  const users = mockDb.getUsers();
  return {
    status: 'success',
    statusCode: 200,
    data: users.map(u => ({
      id: u.id,
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      designationId: u.designationId,
      designationName: u.designationName,
    })),
  };
}

export async function getUsersByDesignationId(designationId: number): Promise<GetUsersByDesignationResponse> {
  const users = mockDb.getUsers().filter(u => u.designationId === Number(designationId));
  return {
    status: 'success',
    data: users.map(u => ({
      id: u.id,
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      designationId: u.designationId,
      designationName: u.designationName,
    })),
  };
}

export default getAllUsers;
