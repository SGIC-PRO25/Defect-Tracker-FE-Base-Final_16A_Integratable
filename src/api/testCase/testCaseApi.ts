import { mockDb } from "../../mock/mockData";

export const getTestCasesByProjectAndSubmodule = async (
  _projectId: string,
  subModuleId: string,
  _description?: string,
  _defectTypeId?: number,
  _severityId?: number,
  _page?: number,
  _size: number = 1000000
): Promise<any[]> => {
  const testCases = mockDb.getTestCases(Number(subModuleId));
  const list = testCases.map(t => ({
    id: t.id,
    no: t.testcaseNo,
    testcaseNo: t.testcaseNo,
    description: t.description,
    detailsSteps: t.detailsSteps || t.steps,
    expectedResult: t.expectedResult,
    subModuleId: t.subModuleId,
    subModuleName: t.subModuleName,
    severityId: t.severityId,
    severityName: t.severityName,
    defectTypeId: t.defectTypeId,
    defectTypeName: t.defectTypeName,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    createdBy: t.createdBy,
    updatedBy: t.updatedBy,
  }));

  (list as any).totalPages = 1;
  (list as any).totalElements = list.length;
  (list as any).isServerPaginated = false;
  return list;
};

export async function deleteTestCase(
  _subModuleId: number,
  testCaseId: string | number
) {
  mockDb.deleteTestCase(Number(testCaseId));
  return {
    status: 'success',
    statusCode: 200,
    message: 'Test case deleted successfully',
  };
}

export async function getTestCasesByProjectAndModule(
  _projectId: string | number,
  moduleId: string | number,
  _page: number = 0,
  _size: number = 1000000
) {
  const testCases = mockDb.getTestCases();
  const filtered = testCases.filter(t => t.moduleId === Number(moduleId) || Number(moduleId) === 1);
  const list = filtered.map(t => ({
    id: t.id,
    no: t.testcaseNo,
    testcaseNo: t.testcaseNo,
    description: t.description,
    detailsSteps: t.detailsSteps || t.steps,
    expectedResult: t.expectedResult,
    subModuleId: t.subModuleId,
    subModuleName: t.subModuleName,
    severityId: t.severityId,
    severityName: t.severityName,
    defectTypeId: t.defectTypeId,
    defectTypeName: t.defectTypeName,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  (list as any).totalPages = 1;
  (list as any).totalElements = list.length;
  (list as any).isServerPaginated = false;
  return list;
}

export async function getTestCasesByBulkModules(
  projectId: string | number,
  moduleIds: number[]
) {
  const all: any[] = [];
  for (const modId of moduleIds) {
    const list = await getTestCasesByProjectAndModule(projectId, modId);
    all.push(...list);
  }
  return all;
}

export async function getTestCasesByBulkSubmodules(
  projectId: string | number,
  submoduleIds: number[]
) {
  const all: any[] = [];
  for (const subId of submoduleIds) {
    const list = await getTestCasesByProjectAndSubmodule(String(projectId), String(subId));
    all.push(...list);
  }
  return all;
}
