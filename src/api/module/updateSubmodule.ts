import { mockDb } from "../../mock/mockData";

export const updateSubmodule = async (
  submoduleId: number,
  moduleId: number,
  data: { subModuleName: string }
) => {
  const updated = mockDb.updateSubmodule(moduleId, submoduleId, {
    name: data.subModuleName,
    subModuleName: data.subModuleName,
  });

  return {
    status: "success",
    message: "Submodule updated successfully",
    data: updated,
  };
};