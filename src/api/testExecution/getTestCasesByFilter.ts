import { mockDb } from "../../mock/mockData";

export async function getTestCasesByFilter({
  projectId,
  releaseId,
  moduleId,
  subModuleId,
}: {
  projectId: number;
  releaseId: number;
  moduleId?: number;
  subModuleId?: number;
}) {
  let testCases = mockDb.getTestCases();
  if (subModuleId) {
    testCases = testCases.filter(t => t.subModuleId === subModuleId);
  } else if (moduleId) {
    testCases = testCases.filter(t => t.moduleId === moduleId);
  }

  return testCases.map(t => ({
    id: t.id,
    testcaseNo: t.testcaseNo,
    description: t.description,
    detailsSteps: t.detailsSteps || t.steps,
    expectedResult: t.expectedResult,
    severityName: t.severityName,
    defectTypeName: t.defectTypeName,
    subModuleName: t.subModuleName,
    moduleName: t.moduleName,
    projectId,
    releaseId,
    executionStatus: t.executionStatus || 'NOT_RUN',
  }));
}