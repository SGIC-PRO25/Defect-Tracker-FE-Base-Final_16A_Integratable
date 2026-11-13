import { mockDb, INITIAL_BENCH_RESOURCES, MockUser } from "../../mock/mockData";

// Bench pages expect the backend shape: { employee: {...}, availability, availabilityPeriod }.
// Flat fields are kept alongside for callers that read them directly.
function toBenchItem(u: MockUser) {
  const benchEntry = INITIAL_BENCH_RESOURCES.find(b => b.employeeId === u.id);
  const availability = u.availabilityPercent ?? 100;
  const availableFrom = benchEntry?.benchStartDate || new Date().toISOString().slice(0, 10);
  return {
    id: u.id,
    employeeId: u.id,
    userId: u.userId,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    contactNo: u.phone || '',
    designation: u.designationName,
    designationName: u.designationName,
    skills: u.skills || [],
    experience: u.experience || 2,
    availability,
    availabilityPercent: availability,
    availabilityPeriod: availableFrom,
    status: availability === 100 ? 'Available' : 'Partially Allocated',
    benchStartDate: availableFrom,
    benchEndDate: benchEntry?.benchEndDate || '2026-12-31',
    employee: {
      id: u.id,
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      contactNo: u.phone || '',
      designationName: u.designationName,
      active: (u.userStatus || 'ACTIVE').toUpperCase() === 'ACTIVE',
    },
  };
}

export async function getBenchList(): Promise<any[]> {
  return mockDb.getUsers()
    .filter(u => (u.availabilityPercent ?? 100) > 0)
    .map(toBenchItem);
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
      content: paged.map(toBenchItem),
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