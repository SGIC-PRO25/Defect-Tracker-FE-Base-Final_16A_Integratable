import { mockDb } from "../../mock/mockData";

export interface UpdateReleaseStatusResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: {
    id: number;
    name: string;
    status: string;
  };
}

export const updateReleaseStatus = async (releaseId: number, status: 'ACTIVE' | 'HOLD'): Promise<UpdateReleaseStatusResponse> => {
  const updated = mockDb.updateRelease(releaseId, { status, releaseStatus: status });
  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Release status updated successfully',
    data: {
      id: releaseId,
      name: updated?.name || 'Release',
      status: status,
    },
  };
};