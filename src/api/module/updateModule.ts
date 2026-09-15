import { Module } from "../../types/index";
import { mockDb } from "../../mock/mockData";

export const updateModule = async (
  _projectId: number,
  id: number,
  data: Partial<Module>
): Promise<{ success: boolean; module?: Module; message?: string }> => {
  const updated = mockDb.updateModule(id, { name: data.name });
  return {
    success: true,
    module: updated as any,
    message: 'Module updated successfully',
  };
};
