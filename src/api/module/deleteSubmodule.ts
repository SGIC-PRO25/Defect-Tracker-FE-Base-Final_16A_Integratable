import { mockDb } from "../../mock/mockData";

export const deleteSubmodule = async (submoduleId: number, moduleId: number) => {
  mockDb.deleteSubmodule(moduleId, submoduleId);
  return {
    status: "success",
    message: "Submodule deleted successfully",
    data: { submoduleId, moduleId },
  };
};