import { mockDb } from "../../mock/mockData";

export interface ProjectRelease {
  id: string;
  releaseId: string;
  releaseName: string;
  name: string;
  description: string;
  status: string;
  releaseDate: string;
  releaseType_name: string;
  project_id: number;
}

export const projectReleaseCardView = async (projectId: string | number) => {
  const releases = mockDb.getReleases(Number(projectId));
  return {
    status: 'success',
    statusCode: '200',
    message: 'Success',
    data: releases.map(r => ({
      ...r,
      id: String(r.id),
      releaseId: String(r.id),
      releaseName: r.name || r.releaseName,
      name: r.name || r.releaseName,
      description: r.description || '',
      status: r.status || 'In Progress',
      releaseDate: r.releaseDate || '2026-09-30',
      releaseType_name: r.releaseTypeName || 'Major Release',
      project_id: Number(projectId),
    })),
  };
};

export const getReleaseTestCaseCountsLoad = async (releaseIds: number[]) => {
  const result: Record<number, any> = {};
  releaseIds.forEach(id => {
    result[id] = {
      total: 10,
      passed: 7,
      failed: 2,
      blocked: 1,
      unexecuted: 0,
    };
  });
  return {
    status: 'success',
    statusCode: 200,
    data: result,
  };
};