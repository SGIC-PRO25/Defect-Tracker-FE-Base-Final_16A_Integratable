import { mockDb } from "../../mock/mockData";

export interface Role {
  id: number;
  name: string;
}

export interface GetRolesResponse {
  status: string;
  message: string;
  data: {
    content: Role[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const getAllRoles = async (_page: number = 0, _pageSize: number = 100): Promise<GetRolesResponse> => {
  const roles = mockDb.getRoles();
  return {
    status: 'success',
    message: 'Roles fetched successfully',
    data: {
      content: roles.map(r => ({ id: r.id, name: r.roleName })),
      totalElements: roles.length,
      totalPages: 1,
      pageNumber: 0,
      pageSize: 100,
    },
  };
};
