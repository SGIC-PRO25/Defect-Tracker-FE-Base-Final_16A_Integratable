import { mockDb } from "../../mock/mockData";

export async function deleteReleaseById(id: number) {
  mockDb.deleteRelease(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Release deleted successfully',
  };
}

export const deleteRelease = deleteReleaseById;