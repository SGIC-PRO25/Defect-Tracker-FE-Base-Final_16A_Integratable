import { mockDb } from "../../mock/mockData";

export const deleteDefectById = async (id: string | number) => {
  mockDb.deleteDefect(Number(id));
  return {
    status: 'success',
    statusCode: 200,
    message: 'Defect deleted successfully',
  };
};

export const deleteDefect = deleteDefectById;