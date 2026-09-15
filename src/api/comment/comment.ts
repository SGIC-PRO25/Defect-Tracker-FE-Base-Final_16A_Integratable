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
    data: comments.map(c => ({
      id: c.id,
      comment: c.comment,
      userId: c.userId,
      defectId: c.defectId,
      attachment: null,
      createdAt: c.createdAt,
    })),
  };
};
