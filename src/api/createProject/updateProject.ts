import { ProjectFormData } from '../../types';
import { mockDb } from '../../mock/mockData';

export async function updateProject(id: string | number, projectData: ProjectFormData) {
  const updated = mockDb.updateProject(id, {
    name: projectData.name,
    projectName: projectData.name,
    projectStatus: projectData.status ? (projectData.status.toUpperCase() as any) : 'ACTIVE',
    status: projectData.status ? (projectData.status.toUpperCase() as any) : 'ACTIVE',
    startDate: projectData.startDate || null,
    endDate: projectData.endDate || null,
    userId: Number(projectData.userId || projectData.manager || 1),
    description: projectData.description,
    clientName: projectData.clientName,
    country: projectData.clientCountry,
    clientCountry: projectData.clientCountry,
    state: projectData.clientState,
    clientState: projectData.clientState,
    email: projectData.clientEmail,
    clientEmail: projectData.clientEmail,
    phoneNo: projectData.clientPhone,
    clientPhone: projectData.clientPhone,
    address: projectData.address,
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Project updated successfully',
    data: updated,
  };
}