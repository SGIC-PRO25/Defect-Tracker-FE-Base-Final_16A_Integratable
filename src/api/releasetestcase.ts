import { mockDb } from "../mock/mockData";

interface TestCase {
  id: string;
  module: string;
  subModule: string;
  description: string;
  steps: string;
  type: string;
  severity: string;
  projectId: string;
  releaseId?: string;
  testCaseId?: string;
}

export interface GetTestCasesByFilterResponse {
  status: string;
  message: string;
  data: TestCase[];
  statusCode: number;
}

export const getTestCasesByFilter = async (
  projectId: string | number,
  moduleId: string | number,
  submoduleId: string | number,
  releaseId: string | number
): Promise<GetTestCasesByFilterResponse> => {
  const testCases = mockDb.getTestCases();
  return {
    status: 'success',
    message: 'Fetched successfully',
    statusCode: 200,
    data: testCases.map(t => ({
      id: String(t.id),
      testCaseId: t.testcaseNo,
      module: t.moduleName || 'Module',
      subModule: t.subModuleName || 'Submodule',
      description: t.description,
      steps: t.detailsSteps || t.steps || '',
      type: t.defectTypeName || 'Functional Bug',
      severity: t.severityName || 'Medium',
      projectId: String(projectId),
      releaseId: String(releaseId),
    })),
  };
};

export const allocateTestCaseToRelease = async (
  _releaseId: number,
  _testCaseId: number
): Promise<any> => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Test case allocated to release successfully',
  };
};

export const allocateTestCaseToMultipleReleases = async (
  _testCaseId: string | number,
  releaseIds: (string | number)[]
): Promise<{ results: any[]; failed: { releaseId: number; error: string }[]; message: string }> => {
  return {
    results: releaseIds.map(r => ({ releaseId: Number(r), status: 'success' })),
    failed: [],
    message: `Test case allocated to ${releaseIds.length} release(s) successfully.`,
  };
};

export const allocateTestCasesToManyReleases = async (
  releaseIds: (string | number)[],
  releaseNames: string[],
  _testCaseIds: (string | number)[]
): Promise<any> => {
  return releaseIds.map((r, idx) => ({
    releaseId: r,
    releaseName: releaseNames[idx] || `Release ${r}`,
    status: 'fulfilled',
    data: { success: true },
    error: null,
  }));
};

export const bulkAllocateTestCasesToReleases = async (
  _testCaseIds: (string | number)[],
  _releaseId: string | number
): Promise<any> => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Bulk allocation succeeded',
  };
};

export const getReleaseTestCasesByFiltersGroup = async (params: {
  releaseId: number;
  moduleId: number;
  subModuleId: number;
}): Promise<any> => {
  const testCases = mockDb.getTestCases(params.subModuleId);
  return {
    status: 'success',
    data: testCases.map(tc => ({
      id: tc.id,
      testCaseId: tc.testcaseNo,
      description: tc.description,
      steps: tc.detailsSteps || tc.steps,
      type: tc.defectTypeName || tc.type,
      severity: tc.severityName || tc.severity,
      moduleId: tc.moduleId || params.moduleId,
      subModuleId: tc.subModuleId || params.subModuleId,
    })),
  };
};

export const getQaAllocationSummary = async (_qaEngineerIds: string): Promise<any> => {
  return {
    status: 'success',
    data: {
      allocationSummary: {
        totalAllocated: 12,
        qaEngineerCount: 2,
        remaining: 4,
        qaEngineers: [
          { id: 2, name: 'Priya Ramesh', testCases: 7 },
          { id: 5, name: 'Dinesh Venkatesh', testCases: 5 },
        ],
      },
    },
    statusCode: 200,
  };
};

export const getQaEngineerTestCases = async (_params: any): Promise<any> => {
  const testCases = mockDb.getTestCases();
  return {
    status: 'success',
    data: testCases.map(t => ({
      id: t.id,
      testCaseId: t.testcaseNo,
      description: t.description,
      steps: t.detailsSteps,
      type: t.defectTypeName,
      severity: t.severityName,
    })),
    statusCode: 200,
  };
};

export const getDefectTestCaseCounts = async (_releaseId: string | number): Promise<any> => {
  const defects = mockDb.getDefects();
  return {
    status: 'success',
    data: defects.map(d => ({
      testId: d.testCaseId || 1,
      testCaseId: `TC-${d.testCaseId || 1}`,
      defectId: d.defectId,
      assignedTo: d.assignedToName || 'Developer',
      priority: d.priorityName || 'High',
    })),
    statusCode: 200,
  };
};
