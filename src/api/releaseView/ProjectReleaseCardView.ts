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

// Pages iterate `data` as a list of { releaseId, testCaseCount }, counting the
// test cases allocated to each release.
export const getReleaseTestCaseCountsLoad = async (releaseIds: number[]) => {
  const data = releaseIds.map(id => {
    const inScope = mockDb.getReleaseTestCases(id)
      .map(r => mockDb.getTestCaseById(r.testCaseId))
      .filter((t): t is NonNullable<typeof t> => !!t);
    const count = (s: string) => inScope.filter(t => t.executionStatus === s).length;
    return {
      releaseId: id,
      testCaseCount: inScope.length,
      total: inScope.length,
      passed: count('PASS'),
      failed: count('FAIL'),
      blocked: count('BLOCKED'),
      unexecuted: inScope.length - count('PASS') - count('FAIL') - count('BLOCKED'),
    };
  });
  return {
    status: 'Success',
    statusCode: 200,
    data,
  };
};