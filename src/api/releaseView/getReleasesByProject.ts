import { mockDb } from "../../mock/mockData";

export const getReleasesByProjectId = async (projectId: string | number) => {
  const releases = mockDb.getReleases(Number(projectId));
  return releases;
};
