import { mockDb } from "../../mock/mockData";

export interface UserFilter {
  id: number;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  userGender?: string;
  status?: string;
  designationId?: number;
  designationName?: string;
}

export async function getUsersByFilter(
  gender?: string,
  status?: string,
  designationId?: number,
  page: number = 1,
  size: number = 10
) {
  let users = mockDb.getUsers();

  if (gender) {
    users = users.filter(u => u.userGender?.toLowerCase() === gender.toLowerCase());
  }
  if (status) {
    users = users.filter(u => u.userStatus?.toLowerCase() === status.toLowerCase());
  }
  if (designationId) {
    users = users.filter(u => u.designationId === Number(designationId));
  }

  const start = (page - 1) * size;
  const paged = users.slice(start, start + size);

  return paged;
}

export const filterUsers = getUsersByFilter;
