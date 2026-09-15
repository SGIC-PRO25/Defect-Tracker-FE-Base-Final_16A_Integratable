import { ProjectFormData } from '../../types';
import { mockDb } from '../../mock/mockData';

export async function createProject(projectData: ProjectFormData) {
  const created = mockDb.createProject({
    name: projectData.name,
    projectName: projectData.name,
    description: projectData.description,
    projectStatus: projectData.status ? (projectData.status.toUpperCase() as any) : 'ACTIVE',
    status: projectData.status ? (projectData.status.toUpperCase() as any) : 'ACTIVE',
    startDate: projectData.startDate,
    endDate: projectData.endDate,
    clientName: projectData.clientName,
    clientCountry: projectData.clientCountry,
    country: projectData.clientCountry,
    clientState: projectData.clientState,
    state: projectData.clientState,
    clientEmail: projectData.clientEmail,
    email: projectData.clientEmail,
    clientPhone: projectData.clientPhone,
    phoneNo: projectData.clientPhone,
    userId: Number(projectData.userId || projectData.manager || 1),
    manager: projectData.manager || 'Arun Kumar',
    address: projectData.address,
    prefix: projectData.prefix || 'PRJ',
    projectType: projectData.projectType || 'Web Application',
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Project created successfully',
    data: created,
  };
}
