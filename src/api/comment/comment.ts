import { mockDb } from '../../mock/mockData';

interface Comment {
  id: number;
  comment: string;
  userId: number | string;
  defectId: number | string;
  attachment?: string | null;
  createdAt: string;
}

export interface GetCommentsResponse {
  message: string;
  data: Comment[];
  status?: string;
  statusCode?: number;
}

export const getCommentsByDefectId = async (defectId: number | string): Promise<GetCommentsResponse> => {
  const def = mockDb.getDefectById(Number(defectId));
  const comments = def?.comments || [];

  return {
    status: 'success',
    statusCode: 200,
    message: 'Comments fetched successfully',
    // The Defects page reads createdBy / createdByName (backend field names)
    data: comments.map(c => ({
      id: c.id,
      comment: c.comment,
      userId: c.userId,
      createdBy: c.userId,
      createdByName: c.userName || (() => {
        const u = mockDb.getUserById(Number(c.userId));
        return u ? `${u.firstName} ${u.lastName}` : undefined;
      })(),
      userName: c.userName,
      defectId: c.defectId,
      attachment: null,
      createdAt: c.createdAt,
    })),
  };
};
