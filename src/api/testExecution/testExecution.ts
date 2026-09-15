import { mockDb } from "../../mock/mockData";

export type ExecutionStatus =
  | "not-started"
  | "in-progress"
  | "passed"
  | "failed"
  | "blocked";

const EXECUTION_STATUS_KEY = "executionStatuses";

export function getExecutionStatuses(
  projectId: string | number,
  releaseId: string | number
): Record<string, ExecutionStatus> {
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    if (!raw) return {};
    const all: Record<string, any> = JSON.parse(raw);
    const proj = all[String(projectId)] || {};
    return (proj[String(releaseId)] || {}) as Record<string, ExecutionStatus>;
  } catch {
    return {};
  }
}

export function setExecutionStatus(
  projectId: string | number,
  releaseId: string | number,
  testCaseId: string | number,
  status: ExecutionStatus
): Record<string, ExecutionStatus> {
  let all: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    all = raw ? JSON.parse(raw) : {};
  } catch {
    all = {};
  }

  const pid = String(projectId);
  const rid = String(releaseId);
  if (!all[pid]) all[pid] = {};
  if (!all[pid][rid]) all[pid][rid] = {};
  all[pid][rid][String(testCaseId)] = status;

  localStorage.setItem(EXECUTION_STATUS_KEY, JSON.stringify(all));

  // Also update in mockDb test cases
  const dbStatus = status === 'passed' ? 'PASS' : status === 'failed' ? 'FAIL' : status === 'blocked' ? 'BLOCKED' : 'NOT_RUN';
  mockDb.updateTestCase(Number(testCaseId), { executionStatus: dbStatus as any });

  return all[pid][rid] as Record<string, ExecutionStatus>;
}

export function setBulkExecutionStatuses(
  projectId: string | number,
  releaseId: string | number,
  statuses: Record<string, ExecutionStatus>
): void {
  let all: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    all = raw ? JSON.parse(raw) : {};
  } catch {
    all = {};
  }

  const pid = String(projectId);
  const rid = String(releaseId);
  if (!all[pid]) all[pid] = {};
  all[pid][rid] = { ...(all[pid][rid] || {}), ...statuses };
  localStorage.setItem(EXECUTION_STATUS_KEY, JSON.stringify(all));
}

export const updateReleaseTestCaseStatus = async (
  _releaseId: number,
  releaseTestCaseId: number,
  payload: {
    status: "PASSED" | "FAILED";
    priorityId?: number;
    assignedTo?: number;
  }
): Promise<any> => {
  mockDb.updateTestCase(releaseTestCaseId, {
    executionStatus: payload.status === 'PASSED' ? 'PASS' : 'FAIL',
  });
  return {
    status: 'success',
    statusCode: 200,
    message: 'Test case status updated successfully',
  };
};

export const updateReleaseTestCaseStatusWithImage = async (
  releaseId: number,
  releaseTestCaseId: number,
  _formData: FormData
): Promise<any> => {
  return updateReleaseTestCaseStatus(releaseId, releaseTestCaseId, { status: 'PASSED' });
};