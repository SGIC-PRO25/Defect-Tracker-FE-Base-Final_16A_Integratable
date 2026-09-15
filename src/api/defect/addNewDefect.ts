import { mockDb } from "../../mock/mockData";

export interface DefectCreate {
  description: string;
  steps: string;
  projectId: number;
  severityId: number;
  priorityId: number;
  defectStatusId: number;
  typeId: number;
  reOpenCount: number;
  attachment?: string | null;
  assignbyId?: number | null;
  assigntoId?: number;
  modulesId: number;
  subModuleId?: number | null;
  releasesId?: number | null;
  testCaseRequired?: boolean;
}

export interface DefectCreateProps {
  message: string;
  data: any;
  status: string;
  statusCode: number;
}

export const addDefects = async (
  payload: DefectCreate | FormData
): Promise<DefectCreateProps> => {
  let defectData: any = {};
  if (payload instanceof FormData) {
    payload.forEach((val, key) => {
      defectData[key] = val;
    });
  } else {
    defectData = payload;
  }

  const created = mockDb.createDefect({
    title: defectData.description || 'New Defect',
    description: defectData.description || '',
    steps: defectData.steps || '',
    projectId: Number(defectData.projectId || 1),
    severityId: Number(defectData.severityId || 2),
    priorityId: Number(defectData.priorityId || 2),
    defectStatusId: Number(defectData.defectStatusId || 1),
    moduleId: Number(defectData.modulesId || defectData.moduleId || 1),
    subModuleId: Number(defectData.subModuleId || 1),
    releaseId: Number(defectData.releasesId || defectData.releaseId || 1),
    assignedToId: Number(defectData.assigntoId || defectData.assignedToId || 3),
    assignedById: Number(defectData.assignbyId || defectData.assignedById || 1),
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Defect created successfully',
    data: [created],
  };
};
