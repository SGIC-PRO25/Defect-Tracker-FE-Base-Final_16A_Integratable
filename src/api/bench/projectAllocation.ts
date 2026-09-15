import { mockDb } from "../../mock/mockData";
import { formatDateTime } from "../../utils/formatDateTime";

interface AvailablePeriod {
  period: string;
  percentage: number;
  project: string;
  userId: number;
}

export interface ViewAllocationsResponse {
  data: {
    availablePeriods: AvailablePeriod[];
  };
  message: string;
  status: string;
  statusCode: number;
}

export interface ProjectAllocationPayload {
  employeeId: number;
  projectId: number;
  roleId: number;
  allocationPercent: number;
  startDate: string;
  endDate: string;
}

export async function postProjectAllocations(payload: ProjectAllocationPayload) {
  mockDb.allocateBenchResource(payload.employeeId, payload.projectId, payload.allocationPercent);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project allocation created successfully',
    data: payload,
  };
}

export async function getProjectAllocationsById(projectId: string | number) {
  const users = mockDb.getUsers();
  const proj = mockDb.getProjectById(projectId);
  const projName = proj?.name || proj?.projectName || 'Project';

  const allocatedUsers = users.filter(u => u.currentProjects?.includes(projName) || u.id === 1 || u.id === 2 || u.id === 3);

  return {
    status: 'success',
    statusCode: 200,
    data: allocatedUsers.map(u => ({
      id: u.id,
      employeeId: u.id,
      employeeName: `${u.firstName} ${u.lastName}`,
      roleId: u.roleId || 4,
      roleName: u.roleName || 'Developer',
      designationName: u.designationName || 'Software Engineer',
      allocationPercent: 50,
      startDate: '2025-01-01',
      endDate: '2026-12-31',
    })),
  };
}

export async function updateProjectAllocation(id: string | number, payload: any) {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project allocation updated successfully',
    data: { id, ...payload },
  };
}

export async function deleteProjectAllocation(id: string | number, _forceDeallocate: boolean = false) {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project allocation removed successfully',
    data: { id },
  };
}

export async function filterProjectAllocations(projectId: string | number, _filters: any) {
  return getProjectAllocationsById(projectId);
}

export async function getMaxAvailablePercentage(userId: string | number, _startDate?: string, _endDate?: string) {
  const user = mockDb.getUserById(Number(userId));
  return { data: user?.availabilityPercent ?? 100 };
}

export async function getDevelopersWithRolesByProjectId(projectId: number | string | undefined) {
  if (!projectId) return [];
  const users = mockDb.getUsers();
  return {
    status: 'success',
    statusCode: 200,
    data: users.map(u => ({
      id: u.id,
      employeeId: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.roleName || 'Developer',
      roleId: u.roleId || 4,
    })),
  };
}

export async function allocateDeveloperToModule(_moduleId: number, _projectAllocationId: number) {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Developer allocated to module successfully',
  };
}

export async function allocateDeveloperToSubModule(_moduleId: number, _projectAllocationId: number, _id: number) {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Developer allocated to submodule successfully',
  };
}

export async function getViewAllocations(userId: string | number): Promise<ViewAllocationsResponse> {
  const user = mockDb.getUserById(Number(userId));
  const availablePeriods = [
    {
      period: `${formatDateTime('2025-01-01')} to ${formatDateTime('2026-12-31')}`,
      percentage: user?.availabilityPercent ?? 100,
      roleId: user?.roleId || 4,
      roleName: user?.roleName || 'Developer',
      project: user?.currentProjects?.[0] || 'Core Project',
      userId: Number(userId),
    },
  ];

  return {
    data: { availablePeriods },
    message: 'Success',
    status: 'success',
    statusCode: 200,
  };
}