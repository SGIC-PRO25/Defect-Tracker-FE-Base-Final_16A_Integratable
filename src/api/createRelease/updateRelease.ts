import { mockDb } from "../../mock/mockData";

export async function updateRelease(id: number, data: any) {
  const updated = mockDb.updateRelease(id, data);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Release updated successfully',
    data: updated,
  };
}
