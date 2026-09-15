import { mockDb } from "../../mock/mockData";

export interface SearchUserData {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: string;
  userGender: string;
  designationName: string;
}

export async function searchUsers(searchTerm: string) {
  const users = mockDb.getUsers();
  const term = searchTerm.toLowerCase();

  return users.filter(u =>
    u.firstName.toLowerCase().includes(term) ||
    u.lastName.toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term) ||
    u.userId.toLowerCase().includes(term) ||
    u.designationName?.toLowerCase().includes(term)
  );
}
