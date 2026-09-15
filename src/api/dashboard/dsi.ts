export async function getDefectSeverityIndex(projectId: string) {
  return {
    status: "success",
    statusCode: 200,
    data: {
      projectId: Number(projectId),
      defectSeverityIndex: 2.4,
      status: "Medium",
      totalDefects: 16,
      criticalDefects: 2,
      highDefects: 4,
      mediumDefects: 7,
      lowDefects: 3,
    },
  };
}