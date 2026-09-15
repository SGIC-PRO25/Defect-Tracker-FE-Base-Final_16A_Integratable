import { mockDb } from "../../mock/mockData";

export interface DefectHistoryEntry {
  id: number;
  defectId: number;
  assignedByName: string;
  assignedToName: string;
  previousStatus: string;
  defectStatus: string;
  name: string;
  defectDate: string;
  defectTime: string;
  createdBy: string;
  updatedBy: string;
}

export async function getDefectHistoryByDefectId(
  defectId: string | number
): Promise<DefectHistoryEntry[]> {
  const def = mockDb.getDefectById(Number(defectId));
  if (!def || !def.defectHistory) return [];

  return def.defectHistory.map((h, idx) => ({
    id: h.id || idx + 1,
    defectId: Number(defectId),
    assignedByName: 'Priya Ramesh',
    assignedToName: def.assignedToName || 'Karthik Sundaram',
    previousStatus: idx === 0 ? 'New' : def.defectHistory![idx - 1].status,
    defectStatus: h.status,
    name: h.comment || `Status updated to ${h.status}`,
    defectDate: h.changedAt.split('T')[0],
    defectTime: h.changedAt.split('T')[1]?.substring(0, 5) || '12:00',
    createdBy: h.changedBy || 'QA Tester',
    updatedBy: h.changedBy || 'QA Tester',
  }));
}

export const getDefectHistory = getDefectHistoryByDefectId;
