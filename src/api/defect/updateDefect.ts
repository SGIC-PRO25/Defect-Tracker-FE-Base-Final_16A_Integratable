import { mockDb } from "../../mock/mockData";

export const updateDefectById = async (
  defectId: string | number,
  payload: FormData | any
) => {
  let defectData: any = {};
  if (payload instanceof FormData) {
    payload.forEach((val, key) => {
      defectData[key] = val;
    });
  } else {
    defectData = payload;
  }

  const updated = mockDb.updateDefect(Number(defectId), {
    title: defectData.description || defectData.title,
    description: defectData.description || defectData.title,
    status: defectData.status || defectData.defectStatusName,
    severityId: defectData.severityId ? Number(defectData.severityId) : undefined,
    priorityId: defectData.priorityId ? Number(defectData.priorityId) : undefined,
    assignedToId: defectData.assignedToId ? Number(defectData.assignedToId) : undefined,
    steps: defectData.steps,
  });

  return {
    status: 200,
    data: {
      status: 'success',
      statusCode: 200,
      message: 'Defect updated successfully',
      data: updated,
    },
  };
};