import { mockDb } from "../../mock/mockData";

export async function updateTestCase(
  subModuleId: number,
  testCaseId: string | number,
  data: any
) {
  const updated = mockDb.updateTestCase(Number(testCaseId), {
    description: data.description,
    detailsSteps: data.detailsSteps || data.steps,
    steps: data.detailsSteps || data.steps,
    expectedResult: data.expectedResult,
    severityId: data.severityId,
    defectTypeId: data.defectTypeId,
    subModuleId: subModuleId,
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Test case updated successfully',
    data: updated,
  };
}
