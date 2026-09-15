import { mockDb } from "../../mock/mockData";

export interface ActiveRelease {
  id: string;
  releaseId: string;
  name: string;
  description: string;
  status: string;
  releaseDate: string;
  releaseType_id: string;
  project_id: number;
}

export interface ActiveReleasesResponse {
  message: string;
  data: ActiveRelease[];
  status: string;
  statusCode: string;
}

export const getActiveReleases = async (projectId: string | number): Promise<ActiveReleasesResponse> => {
  const releases = mockDb.getReleases(Number(projectId));
  return {
    message: 'Success',
    status: 'success',
    statusCode: '200',
    data: releases.map(r => ({
      id: String(r.id),
      releaseId: String(r.id),
      name: r.name || r.releaseName || 'Release',
      description: r.description || '',
      status: r.status || 'In Progress',
      releaseDate: r.releaseDate || '2026-09-30',
      releaseType_id: String(r.releaseTypeId || 1),
      project_id: Number(projectId),
    })),
  };
};