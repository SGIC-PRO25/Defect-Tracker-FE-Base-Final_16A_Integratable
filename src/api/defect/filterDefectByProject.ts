import { FilteredDefect } from "../../types";
import { mockDb } from "../../mock/mockData";

export async function getDefectsByProjectId(
  projectId: number,
  page: number = 0,
  size: number = 10,
  search?: string
): Promise<any> {
  let defects = mockDb.getDefects(projectId);
  if (search) {
    const term = search.toLowerCase();
    defects = defects.filter(d =>
      d.title.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term) ||
      d.defectId.toLowerCase().includes(term)
    );
  }

  const start = page * size;
  const paged = defects.slice(start, start + size);

  const mapped = paged.map(d => ({
    id: d.id,
    defectId: d.defectId,
    description: d.description || d.title,
    reOpenCount: d.reOpenCount || 0,
    attachment: d.attachment || null,
    steps: d.steps || '',
    projectName: d.projectName,
    severityName: d.severityName || 'Medium',
    priorityName: d.priorityName || 'Medium',
    statusName: d.statusName || d.status,
    defect_status_name: d.statusName || d.status,
    defect_status_id: d.statusId || 1,
    releaseName: d.releaseName,
    assignedToName: d.assignedToName || d.assignedTo,
    assignedByName: d.assignedByName || d.reportedBy,
    assigned_to_name: d.assignedToName || d.assignedTo,
    assigned_by_name: d.assignedByName || d.reportedBy,
    assigned_to_id: d.assignedToId || 3,
    assigned_by_id: d.assignedById || 1,
    defectTypeName: d.defectTypeId ? 'Functional Bug' : 'Functional Bug',
    defect_type_name: 'Functional Bug',
    moduleName: d.moduleName,
    module_name: d.moduleName,
    subModuleName: d.subModuleName,
    sub_module_name: d.subModuleName,
    testCaseId: d.testCaseId,
  }));

  return {
    status: 'success',
    statusCode: 200,
    data: {
      content: mapped,
      totalElements: defects.length,
      totalPages: Math.ceil(defects.length / size),
      size,
      number: page,
    },
    content: mapped,
  };
}

export async function filterDefects(
  filters: any,
  page: number = 0,
  size: number = 10
): Promise<any> {
  const projectId = Number(filters.projectId || 1);
  return getDefectsByProjectId(projectId, page, size, filters.search);
}

export async function filterDefectsForTest(filters: {
  projectId: string | number;
  releaseId?: number;
}): Promise<FilteredDefect[]> {
  const projectId = Number(filters.projectId);
  const defects = mockDb.getDefects(projectId);
  return defects.map(d => ({
    id: d.id,
    defectId: d.defectId,
    description: d.description || d.title,
    reOpenCount: d.reOpenCount || 0,
    attachment: d.attachment || null,
    steps: d.steps || '',
    projectName: d.projectName,
    severityName: d.severityName || 'Medium',
    priorityName: d.priorityName || 'Medium',
    statusName: d.statusName || d.status,
    defect_status_name: d.statusName || d.status,
    releaseName: d.releaseName,
    assignedToName: d.assignedToName || d.assignedTo,
    assignedByName: d.assignedByName || d.reportedBy,
    defectTypeName: 'Functional Bug',
    moduleName: d.moduleName,
    subModuleName: d.subModuleName,
    testCaseId: d.testCaseId,
  }));
}