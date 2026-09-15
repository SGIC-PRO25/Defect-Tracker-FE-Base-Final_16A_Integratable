import { mockDb } from "../../mock/mockData";

export const getReleaseTestCaseCount = async (releaseId: string | number) => {
  const testCases = mockDb.getTestCases();
  const total = testCases.length;
  const passed = testCases.filter(t => t.executionStatus === 'PASS').length;
  const failed = testCases.filter(t => t.executionStatus === 'FAIL').length;
  const blocked = testCases.filter(t => t.executionStatus === 'BLOCKED').length;
  const unexecuted = total - (passed + failed + blocked);

  return {
    status: 'success',
    statusCode: 200,
    data: {
      releaseId: Number(releaseId),
      totalTestCases: total,
      passedTestCases: passed,
      failedTestCases: failed,
      blockedTestCases: blocked,
      unexecutedTestCases: Math.max(0, unexecuted),
    },
  };
};

export const getReleaseTestCaseCounts = getReleaseTestCaseCount;