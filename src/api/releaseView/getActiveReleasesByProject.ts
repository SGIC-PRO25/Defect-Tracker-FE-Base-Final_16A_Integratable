import { mockDb } from "../../mock/mockData";

export interface ActiveRelease {
  id: string;
  name: string;
  status: string;
}

export const getActiveReleasesByProject = async (
  projectId: string | number
): Promise<ActiveRelease[]> => {
  const releases = mockDb.getReleases(Number(projectId));
  return releases.map(r => ({
    id: String(r.id),
    name: r.name || r.releaseName || 'Release',
    status: r.status || 'In Progress',
  }));
};