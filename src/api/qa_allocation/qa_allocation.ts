import { mockDb } from '../../mock/mockData';

export interface QAMember {
  userId: number;
  userFullName: string;
}

export interface QAMembersResponse {
  status: string;
  statusCode: number;
  message: string;
  data: QAMember[];
}

export const getQAMembersByProjectId = async (_projectId: number): Promise<QAMembersResponse> => {
  const users = mockDb.getUsers();
  const qaMembers = users.filter(u => u.designationName?.includes('QA') || u.roleName?.includes('QA'));

  return {
    status: 'success',
    statusCode: 200,
    message: 'QA members retrieved successfully',
    data: qaMembers.map(u => ({
      userId: u.id,
      userFullName: `${u.firstName} ${u.lastName}`,
    })),
  };
};