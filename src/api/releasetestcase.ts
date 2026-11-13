import { mockDb, MockReleaseTestCase } from "../mock/mockData";

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

const userName = (id: number | null | undefined) => {
  if (id == null) return null;
  const u = mockDb.getUserById(Number(id));
  return u ? `${u.firstName} ${u.lastName}` : null;
};

// One release test case row in the shape the allocation, release and execution pages read.
// `id` is the release test case id (what QA allocation sends back to bulkAssignOwner).
export const toReleaseTestCaseDto = (row: MockReleaseTestCase) => {
  const tc = mockDb.getTestCaseById(row.testCaseId);
  const owner = userName(row.qaId);
  return {
    id: row.id,
    releaseTestCaseId: row.id,
    releaseId: row.releaseId,
    testCaseDbId: row.testCaseId,
    testCaseId: tc?.testcaseNo ?? String(row.testCaseId),
    description: tc?.description ?? '',
    steps: tc?.detailsSteps || tc?.steps || '',
    type: tc?.defectTypeName || tc?.type || '',
    severity: tc?.severityName || tc?.severity || '',
    projectId: tc?.projectId,
    moduleId: tc?.moduleId,
    moduleName: tc?.moduleName,
    subModuleId: tc?.subModuleId,
    subModuleName: tc?.subModuleName,
    ownerId: row.qaId,
    assignedToId: row.qaId,
    assignedTo: owner,
    assignedToName: owner,
    ownerName: owner,
  };
};

const rowsFor = (releaseId: number | string, moduleId?: number | string, subModuleId?: number | string) =>
  mockDb.getReleaseTestCases(releaseId).filter(row => {
    const tc = mockDb.getTestCaseById(row.testCaseId);
    if (!tc) return false;
    if (subModuleId && Number(tc.subModuleId) !== Number(subModuleId)) return false;
    if (moduleId && tc.moduleId && Number(tc.moduleId) !== Number(moduleId)) return false;
    return true;
  });

// Test cases allocated to a release (Release View page)
export const getTestCasesByFilter = async (
  projectId: string | number,
  moduleId: string | number,
  submoduleId: string | number,
  releaseId: string | number
): Promise<GetTestCasesByFilterResponse> => {
  const data = rowsFor(releaseId, moduleId, submoduleId).map(row => {
    const d = toReleaseTestCaseDto(row);
    return {
      id: String(d.testCaseDbId),
      testCaseId: d.testCaseId,
      module: d.moduleName || 'Module',
      subModule: d.subModuleName || 'Submodule',
      description: d.description,
      steps: d.steps,
      type: d.type,
      severity: d.severity,
      projectId: String(projectId),
      releaseId: String(releaseId),
    };
  });
  return { status: 'success', message: 'Fetched successfully', statusCode: 200, data };
};

// --- Release allocation --------------------------------------------------------------
// Each call returns `data` as the list of newly allocated rows; test cases already in the
// release are skipped (the page reports them as "already existed").

export const allocateTestCaseToRelease = async (releaseId: number, testCaseId: number): Promise<any> => {
  const created = mockDb.allocateTestCasesToRelease(releaseId, [testCaseId]);
  return {
    status: 'success',
    statusCode: 200,
    message: created.length ? 'Test case allocated to release successfully' : 'Test case already allocated to this release',
    data: created.map(toReleaseTestCaseDto),
  };
};

export const allocateTestCaseToMultipleReleases = async (
  testCaseId: string | number,
  releaseIds: (string | number)[]
): Promise<{ results: any[]; failed: { releaseId: number; error: string }[]; message: string }> => {
  const results: any[] = [];
  const failed: { releaseId: number; error: string }[] = [];
  releaseIds.forEach(r => {
    const created = mockDb.allocateTestCasesToRelease(r, [testCaseId]);
    if (created.length) results.push({ releaseId: Number(r), status: 'success', data: created.map(toReleaseTestCaseDto) });
    else failed.push({ releaseId: Number(r), error: `Test case ${testCaseId} is already allocated to this release` });
  });
  return {
    results,
    failed,
    message: `Test case allocated to ${results.length} release(s) successfully.`,
  };
};

export const allocateTestCasesToManyReleases = async (
  releaseIds: (string | number)[],
  releaseNames: string[],
  testCaseIds: (string | number)[]
): Promise<any> => {
  return releaseIds.map((r, idx) => {
    const created = mockDb.allocateTestCasesToRelease(r, testCaseIds);
    return {
      releaseId: r,
      releaseName: releaseNames[idx] || `Release ${r}`,
      status: 'fulfilled',
      data: created.map(toReleaseTestCaseDto),
      error: null,
    };
  });
};

export const bulkAllocateTestCasesToReleases = async (
  testCaseIds: (string | number)[],
  releaseId: string | number
): Promise<any> => {
  const created = mockDb.allocateTestCasesToRelease(releaseId, testCaseIds);
  return {
    status: 'success',
    statusCode: 200,
    message: `${created.length} test case(s) allocated`,
    data: created.map(toReleaseTestCaseDto),
  };
};

// Test cases allocated to one release, for a module/submodule (Release Details, QA tab)
export const getReleaseTestCasesByFiltersGroup = async (params: {
  projectId?: number;
  releaseId: number;
  moduleId: number;
  subModuleId: number;
}): Promise<any> => {
  return {
    status: 'success',
    statusCode: 200,
    data: rowsFor(params.releaseId, params.moduleId, params.subModuleId).map(toReleaseTestCaseDto),
  };
};

// --- QA allocation -------------------------------------------------------------------

// Per QA engineer: how many release test cases they own. `remaining` = allocated to a
// release but with no QA owner yet. The page checks status === "Success".
export const getQaAllocationSummary = async (qaEngineerIds: string): Promise<any> => {
  const ids = String(qaEngineerIds || '').split(',').map(s => Number(s.trim())).filter(Boolean);
  const rows = mockDb.getReleaseTestCases();
  const qaEngineers = ids.map(id => {
    const owned = rows.filter(r => r.qaId === id);
    return {
      id,
      name: userName(id) || `User ${id}`,
      testCases: owned.length,
      testCaseIds: owned.map(r => toReleaseTestCaseDto(r).testCaseId),
    };
  });
  return {
    status: 'Success',
    statusCode: 200,
    data: {
      allocationSummary: {
        totalAllocated: qaEngineers.reduce((sum, q) => sum + q.testCases, 0),
        qaEngineerCount: qaEngineers.filter(q => q.testCases > 0).length,
        remaining: rows.filter(r => r.qaId == null).length,
        qaEngineers,
      },
    },
  };
};

// Existing QA ownership for a release, as { qaId: [releaseTestCaseId, ...] } (string ids,
// the format the allocation page keeps in its qaAllocations state)
export const getQaAllocationsByRelease = async (releaseId: string | number): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {};
  mockDb.getReleaseTestCases(releaseId).forEach(r => {
    if (r.qaId == null) return;
    (result[String(r.qaId)] ||= []).push(String(r.id));
  });
  return result;
};

// Release test cases with their QA owner (matched to engineers by `assignedTo` name)
export const getQaEngineerTestCases = async (
  _projectId: number,
  releaseId: number,
  moduleId?: number,
  subModuleId?: number
): Promise<any> => {
  return {
    status: 'success',
    statusCode: 200,
    data: rowsFor(releaseId, moduleId, subModuleId)
      .filter(r => r.qaId != null)
      .map(toReleaseTestCaseDto),
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
