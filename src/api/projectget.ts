import { Project } from "../types";
import { mockDb } from "../mock/mockData";

export const getAllProjects = async (): Promise<Project[]> => {
  const projects = mockDb.getProjects() as Project[];
  console.log('API: getAllProjects (Mock)', projects);
  return projects;
};

export const getAllProjectsForDashbord = async (): Promise<any> => {
  const projects = mockDb.getProjects();
  console.log('API: getAllProjectsForDashbord (Mock)', projects);
  return {
    status: 'success',
    statusCode: 200,
    data: projects,
  };
};

export async function updateProject(id: number | string, projectData: any) {
  const updated = mockDb.updateProject(id, projectData);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project updated successfully',
    data: updated,
  };
}

export async function deleteProject(id: string | number) {
  mockDb.deleteProject(id);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project deleted successfully',
  };
}

export async function createProject(project: any) {
  const created = mockDb.createProject(project);
  return {
    status: 'success',
    statusCode: 200,
    message: 'Project created successfully',
    data: created,
  };
}

export interface AvailableManager {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  designationId: number;
  designationName: string;
  availabilityPercent: number;
  isActive: boolean;
}

export const getAvailableManagers = async (designationId?: number): Promise<AvailableManager[]> => {
  const users = mockDb.getUsers();
  return users
    .filter(u => !designationId || u.designationId === Number(designationId) || u.roleName?.includes('Manager'))
    .map(u => ({
      employeeId: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      designationId: u.designationId || 1,
      designationName: u.designationName || 'Project Manager',
      availabilityPercent: u.availabilityPercent ?? 100,
      isActive: u.userStatus === 'ACTIVE',
    }));
};

export const getAvailableManagersForUpdate = async (
  designationId?: number,
  _projectId?: number
): Promise<AvailableManager[]> => {
  return getAvailableManagers(designationId);
};
