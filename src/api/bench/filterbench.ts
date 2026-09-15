import { Employee } from '../../types/index';
import { mockDb } from '../../mock/mockData';

export interface BenchSearchParams {
  startDate?: string;
  endDate?: string;
  designation?: string;
  firstName?: string;
  lastName?: string;
  availability?: number;
}

export const searchBenchEmployees = async (params: BenchSearchParams): Promise<Employee[]> => {
  const users = mockDb.getUsers();
  let filtered = users.filter(u => (u.availabilityPercent ?? 100) > 0);

  if (params.designation) {
    filtered = filtered.filter(u => u.designationName?.toLowerCase().includes(params.designation!.toLowerCase()));
  }
  if (params.firstName) {
    filtered = filtered.filter(u => u.firstName.toLowerCase().includes(params.firstName!.toLowerCase()));
  }
  if (params.lastName) {
    filtered = filtered.filter(u => u.lastName.toLowerCase().includes(params.lastName!.toLowerCase()));
  }
  if (params.availability) {
    filtered = filtered.filter(u => (u.availabilityPercent ?? 100) >= params.availability!);
  }

  return filtered.map(u => ({
    id: String(u.id),
    firstName: u.firstName,
    lastName: u.lastName,
    gender: (u.userGender as any) || 'Male',
    email: u.email,
    phone: u.phone || '',
    designation: u.designationName || 'Software Engineer',
    experience: u.experience || 2,
    joinedDate: u.joinedDate || '2023-01-01',
    skills: u.skills || [],
    currentProjects: u.currentProjects || [],
    availability: u.availabilityPercent ?? 100,
    status: 'active',
    createdAt: u.createdAt || new Date().toISOString(),
    updatedAt: u.updatedAt || new Date().toISOString(),
  }));
};

export const searchByStartDate = async (startDate: string) => searchBenchEmployees({ startDate });
export const searchByDesignation = async (designation: string) => searchBenchEmployees({ designation });
export const searchByFirstName = async (firstName: string) => searchBenchEmployees({ firstName });
export const searchByAvailability = async (availability: number) => searchBenchEmployees({ availability });
