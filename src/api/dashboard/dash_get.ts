import { mockDb } from "../../mock/mockData";

export interface TimeToFindDefectsResponse {
  status: string;
  message: string;
  data: {
    dayNumber: number;
    totalDefects: number;
    periodStart: string;
    periodEnd: string;
  }[];
  statusCode: number;
}

export interface TimeToFixDefectsResponse {
  projectId: number;
  releaseName: string;
  dailyData: {
    label: string;
    dayNumber: number;
    defectFixedCount: number;
    timeRange: string;
  }[];
  data?: {
    label: string;
    dayNumber: number;
    defectFixedCount: number;
    timeRange: string;
  }[];
}

// Built from the project's mock defects, in the backend shape the Dashboard and
// Defects pages read: { totalRemark, totalDefects, severities: [{ severityName,
// totalDefects, statusCounts }] }.
// Remark = everything reported; Defect = remarks that were not rejected.
export async function getDefectSeveritySummary(projectId: string | number) {
  const defects = mockDb.getDefects(Number(projectId));
  const statusOf = (d: any) => String(d.statusName || d.defectStatusName || d.status || 'New');
  const severityOf = (d: any) => String(d.severityName || d.severity || '').toLowerCase();
  const isRejected = (d: any) => statusOf(d).toLowerCase() === 'rejected';
  const statusNames = mockDb.getStatuses().map(s => s.name);

  const severities = mockDb.getSeverities().map(sev => {
    const items = defects.filter(d => severityOf(d) === sev.name.toLowerCase());
    const statusCounts: Record<string, number> = {};
    statusNames.forEach(name => {
      statusCounts[name] = items.filter(d => statusOf(d).toLowerCase() === name.toLowerCase()).length;
    });
    return {
      severityName: sev.name,
      severityColor: sev.color,
      totalDefects: items.filter(d => !isRejected(d)).length,
      statusCounts,
    };
  });

  return {
    status: 'success',
    statusCode: 200,
    data: {
      totalRemark: defects.length,
      totalDefects: defects.filter(d => !isRejected(d)).length,
      severities,
    },
  };
}

export async function getReleaseDefectsDaily(_projectId: string, _releaseId: string) {
  return {
    status: "success",
    data: [
      { dayNumber: 1, totalDefects: 2 },
      { dayNumber: 2, totalDefects: 4 },
      { dayNumber: 3, totalDefects: 1 },
      { dayNumber: 4, totalDefects: 5 },
      { dayNumber: 5, totalDefects: 3 },
      { dayNumber: 6, totalDefects: 2 },
      { dayNumber: 7, totalDefects: 0 },
    ],
  };
}

export async function getTimeToFixDefectsDaily(projectId: number, _releaseId: number) {
  return {
    projectId,
    releaseName: 'Release 2.4.0',
    dailyData: [
      { label: 'Day 1', dayNumber: 1, defectFixedCount: 1, timeRange: '24h' },
      { label: 'Day 2', dayNumber: 2, defectFixedCount: 3, timeRange: '24h' },
      { label: 'Day 3', dayNumber: 3, defectFixedCount: 2, timeRange: '24h' },
      { label: 'Day 4', dayNumber: 4, defectFixedCount: 4, timeRange: '24h' },
      { label: 'Day 5', dayNumber: 5, defectFixedCount: 2, timeRange: '24h' },
      { label: 'Day 6', dayNumber: 6, defectFixedCount: 1, timeRange: '24h' },
      { label: 'Day 7', dayNumber: 7, defectFixedCount: 0, timeRange: '24h' },
    ],
  };
}
