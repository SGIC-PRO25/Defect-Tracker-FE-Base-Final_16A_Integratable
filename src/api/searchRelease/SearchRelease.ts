import { mockDb } from "../../mock/mockData";

export const getReleasesByProjectId = async (projectId: string | number) => {
  return mockDb.getReleases(Number(projectId));
};

export async function searchReleases(params: any) {
  const releases = mockDb.getReleases();
  if (typeof params === 'number' || typeof params === 'string') {
    return mockDb.getReleaseById(params);
  }
  return releases;
}
