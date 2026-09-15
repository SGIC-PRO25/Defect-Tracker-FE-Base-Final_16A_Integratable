import { mockDb } from '../../mock/mockData';

export interface allocated_testcases {
  projectId: number;
  releaseId: string;
  moduleId: number;
  subModuleId: number;
}

export interface allocated_testcase_details {
  id: number;
  testCaseId: string;
  description: string;
  steps: string;
  type: string;
  severity: string;
}

export interface GetAllocatedTestCases_Response {
  status: string;
  statusCode: number;
  message: string;
  data: allocated_testcase_details[];
}

export async function getAllocatedTestCases({ subModuleId }: allocated_testcases): Promise<GetAllocatedTestCases_Response> {
  const testCases = mockDb.getTestCases(subModuleId);

  return {
    status: 'success',
    statusCode: 200,
    message: 'Allocated test cases retrieved successfully',
    data: testCases.map(t => ({
      id: t.id,
      testCaseId: t.testcaseNo,
      description: t.description,
      steps: t.detailsSteps || t.steps || '',
      type: t.defectTypeName,
      severity: t.severityName,
    })),
  };
}

export interface BulkAssignOwnerResponse {
  status: string;
  statusCode: number;
  message: string;
  data?: any;
}

export async function bulkAssignOwner(ownerId: number, testCaseIds: number[]): Promise<BulkAssignOwnerResponse> {
  testCaseIds.forEach(id => {
    mockDb.updateTestCase(id, { assignedQaId: ownerId });
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Owner assigned successfully',
    data: { ownerId, testCaseIds },
  };
}
