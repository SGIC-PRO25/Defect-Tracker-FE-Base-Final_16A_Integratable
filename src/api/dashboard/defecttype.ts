import { mockDb } from "../../mock/mockData";

interface DefectTypeItem {
  defectTypeName: string;
  defectCount: number;
  percentage: number;
}

export interface DefectTypeResponse {
  status: string;
  statusCode?: number;
  statusMessage?: string;
  data: {
    defectTypes: DefectTypeItem[];
    totalDefectCount: number;
    mostCommonDefectType: string;
    mostCommonDefectCount: number;
  };
}

export async function getDefectTypeByProjectId(
  _projectId: string
): Promise<DefectTypeResponse> {
  const defectTypes = mockDb.getDefectTypes();
  const counts = [6, 12, 4, 2, 3, 5];

  const mapped: DefectTypeItem[] = defectTypes.map((dt, idx) => ({
    defectTypeName: dt.defectTypeName,
    defectCount: counts[idx] || 3,
    percentage: 0,
  }));

  const total = mapped.reduce((sum, item) => sum + item.defectCount, 0);
  const withPercentages = mapped.map(item => ({
    ...item,
    percentage: Number(((item.defectCount / total) * 100).toFixed(1)),
  }));

  const mostCommon = withPercentages.reduce((prev, current) =>
    (prev.defectCount > current.defectCount) ? prev : current,
    { defectTypeName: 'Functional Bug', defectCount: 12, percentage: 37.5 }
  );

  return {
    status: 'success',
    data: {
      defectTypes: withPercentages,
      totalDefectCount: total,
      mostCommonDefectType: mostCommon.defectTypeName,
      mostCommonDefectCount: mostCommon.defectCount,
    },
  };
}