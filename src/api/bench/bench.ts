import { mockDb } from "../../mock/mockData";

export async function getBenchList(): Promise<any[]> {
  const users = mockDb.getUsers();
  return users
    .filter(u => (u.availabilityPercent ?? 100) > 0)
    .map(u => ({
      id: u.id,
      employeeId: u.id,
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      designationName: u.designationName,
      skills: u.skills || [],
      experience: u.experience || 2,
      availabilityPercent: u.availabilityPercent ?? 100,
      benchStartDate: u.joinedDate || '2026-01-01',
      benchEndDate: '2026-12-31',
    }));
}

export const getViewAllocation = async (userId: string) => {
  const user = mockDb.getUserById(Number(userId));
  return {
    data: {
      availablePeriods: [
        {
          period: '2026-01-01 to 2026-12-31',
          percentage: user?.availabilityPercent ?? 100,
          project: user?.currentProjects?.[0] || 'Bench Resource',
          userId: Number(userId),
        },
      ],
    },
  };
};

export async function getEmployeeDetails(id: string): Promise<any> {
  return mockDb.getUserById(Number(id));
}

export const getBenchAvailability = async (page: number = 0, size: number = 5, filters: any = {}) => {
  const users = mockDb.getUsers();
  let bench = users.filter(u => (u.availabilityPercent ?? 100) > 0);

  if (filters.designation) {
    bench = bench.filter(u => u.designationName?.toLowerCase() === filters.designation.toLowerCase());
  }
  if (filters.minAvailable) {
    bench = bench.filter(u => (u.availabilityPercent ?? 100) >= Number(filters.minAvailable));
  }

  const start = page * size;
  const paged = bench.slice(start, start + size);

  return {
    status: 'success',
    statusCode: 200,
    data: {
      content: paged.map(u => ({
        id: u.id,
        employeeId: u.id,
        userId: u.userId,
        firstName: u.firstName,
        lastName: u.lastName,
        designation: u.designationName,
        skills: u.skills || [],
        experience: u.experience || 2,
        availability: u.availabilityPercent ?? 100,
        status: (u.availabilityPercent ?? 100) === 100 ? 'Available' : 'Partially Allocated',
        benchStartDate: '2026-01-01',
        benchEndDate: '2026-12-31',
      })),
      totalElements: bench.length,
      totalPages: Math.ceil(bench.length / size),
      size,
      number: page,
    },
  };
};

export const getEmployeeProjectHistory = async (userId: string) => {
  const user = mockDb.getUserById(Number(userId));
  return {
    data: (user?.currentProjects || []).map((p, idx) => ({
      id: idx + 1,
      projectName: p,
      roleName: user?.roleName || 'Developer',
      allocationPercent: 50,
      startDate: '2025-06-01',
      endDate: '2026-12-31',
    })),
  };
};