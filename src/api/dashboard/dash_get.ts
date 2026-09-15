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

export async function getDefectSeveritySummary(_projectId: string) {
  return {
    status: 'success',
    statusCode: 200,
    data: [
      { name: 'Low', count: 8, percentage: 32 },
      { name: 'Medium', count: 10, percentage: 40 },
      { name: 'High', count: 5, percentage: 20 },
      { name: 'Critical', count: 2, percentage: 8 },
    ],
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
