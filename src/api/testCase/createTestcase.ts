import { mockDb } from "../../mock/mockData";

export interface CreateTestCaseRequest {
  description: string;
  detailsSteps: string;
  expectedResult?: string;
  severityId: number;
  defectTypeId: number;
}

export interface CreateTestCaseResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  data: any;
}

export async function createTestCase(subModuleId: number, testCaseData: CreateTestCaseRequest) {
  const created = mockDb.createTestCase({
    description: testCaseData.description,
    detailsSteps: testCaseData.detailsSteps,
    steps: testCaseData.detailsSteps,
    expectedResult: testCaseData.expectedResult || '',
    subModuleId: subModuleId,
    severityId: testCaseData.severityId,
    defectTypeId: testCaseData.defectTypeId,
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Test case created successfully',
    data: created,
  };
}

export const createTestCaseSub = async (subModuleId: number, payload: CreateTestCaseRequest): Promise<CreateTestCaseResponse> => {
  const created = mockDb.createTestCase({
    description: payload.description,
    detailsSteps: payload.detailsSteps,
    steps: payload.detailsSteps,
    expectedResult: payload.expectedResult || '',
    subModuleId: subModuleId,
    severityId: payload.severityId,
    defectTypeId: payload.defectTypeId,
  });

  return {
    status: 'success',
    statusCode: 200,
    statusMessage: 'Test case created successfully',
    data: created,
  };
};
