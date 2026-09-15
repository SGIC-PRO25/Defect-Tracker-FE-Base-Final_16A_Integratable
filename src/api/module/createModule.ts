import { CreateModuleRequest, CreateModuleResponse } from "../../types/index";
import { mockDb } from "../../mock/mockData";

export const createModule = async (data: CreateModuleRequest): Promise<CreateModuleResponse> => {
  const created = mockDb.createModule({
    name: data.name,
    moduleName: data.name,
    projectId: data.projectId,
  });

  return {
    status: "success",
    statusCode: "200",
    message: "Module created successfully",
    data: [created as any],
  };
};

export const createSubmodule = async (data: { subModuleName: string; moduleId: number }) => {
  const created = mockDb.createSubmodule(data.moduleId, {
    name: data.subModuleName,
    subModuleName: data.subModuleName,
  });

  return {
    status: "success",
    message: "Submodule created successfully",
    data: created,
  };
};
