import { mockDb } from '../../mock/mockData';
import { getReleaseTestCasesByFiltersGroup } from '../releasetestcase';

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

// Test cases allocated to the release (not every test case in the submodule)
export async function getAllocatedTestCases({ projectId, releaseId, moduleId, subModuleId }: allocated_testcases): Promise<GetAllocatedTestCases_Response> {
  const res = await getReleaseTestCasesByFiltersGroup({
    projectId,
    releaseId: Number(releaseId),
    moduleId,
    subModuleId,
  });
  return {
    status: 'success',
    statusCode: 200,
    message: 'Allocated test cases retrieved successfully',
    data: res.data,
  };
}

export interface BulkAssignOwnerResponse {
  status: string;
  statusCode: number;
  message: string;
  data?: any;
}

// `releaseTestCaseIds` are release test case row ids (the `id` returned by the release APIs)
export async function bulkAssignOwner(ownerId: number, releaseTestCaseIds: number[]): Promise<BulkAssignOwnerResponse> {
  const updated = mockDb.assignReleaseTestCaseOwner(ownerId, releaseTestCaseIds.map(Number));
  if (updated.length === 0) {
    return { status: 'failure', statusCode: 404, message: 'No matching release test cases found' };
  }
  return {
    status: 'success',
    statusCode: 200,
    message: `${updated.length} test case(s) assigned successfully`,
    data: { ownerId, releaseTestCaseIds: updated.map(r => r.id) },
  };
}
