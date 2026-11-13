import { mockDb } from "../../mock/mockData";

// Execution counts for the test cases allocated to one release
export const getReleaseTestCaseCount = async (releaseId: string | number) => {
  const rows = mockDb.getReleaseTestCases(releaseId);
  const statusOf = (testCaseId: number) => mockDb.getTestCaseById(testCaseId)?.executionStatus;
  const total = rows.length;
  const passed = rows.filter(r => statusOf(r.testCaseId) === 'PASS').length;
  const failed = rows.filter(r => statusOf(r.testCaseId) === 'FAIL').length;
  const blocked = rows.filter(r => statusOf(r.testCaseId) === 'BLOCKED').length;

  return {
    status: 'success',
    statusCode: 200,
    data: {
      releaseId: Number(releaseId),
      totalTestCases: total,
      passedTestCases: passed,
      failedTestCases: failed,
      blockedTestCases: blocked,
      unexecutedTestCases: Math.max(0, total - (passed + failed + blocked)),
    },
  };
};

// One entry per release of the project: { releaseId, releaseName, testCaseCount }.
// releaseId is a string because the allocation page compares it with === to its release ids.
export const getReleaseTestCaseCounts = async (projectId: string | number) => {
  const releases = mockDb.getReleases(Number(projectId));
  return {
    status: 'success',
    statusCode: 200,
    data: releases.map(r => ({
      releaseId: String(r.id),
      releaseName: r.name || r.releaseName || `Release ${r.id}`,
      testCaseCount: mockDb.getReleaseTestCases(r.id).length,
    })),
  };
};
