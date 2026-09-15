import { mockDb } from "../../mock/mockData";

export const getActiveRelease = async (projectId: string | number) => {
  const releases = mockDb.getReleases(Number(projectId));
  return {
    status: 'success',
    statusCode: 200,
    data: releases.map(r => ({
      ...r,
      releaseName: r.name || r.releaseName,
    })),
  };
};
