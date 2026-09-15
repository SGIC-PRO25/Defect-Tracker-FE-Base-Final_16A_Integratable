import { mockDb } from '../../mock/mockData';

export interface CreateCommentRequest {
  userId: string | number;
  defectId: string | number;
  comment: string;
  attachment?: string | null;
}

export interface CreateCommentResponse {
  message: string;
  data?: any;
  status?: string;
  statusCode?: number;
}

export const createComment = async (payload: CreateCommentRequest): Promise<CreateCommentResponse> => {
  const user = mockDb.getUserById(Number(payload.userId));
  const newComment = mockDb.addDefectComment(Number(payload.defectId), payload.comment, user);

  return {
    status: 'success',
    statusCode: 200,
    message: 'Comment added successfully',
    data: newComment,
  };
};

export const updateComment = async (commentId: number, comment: string) => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Comment updated successfully',
    data: { id: commentId, comment },
  };
};
