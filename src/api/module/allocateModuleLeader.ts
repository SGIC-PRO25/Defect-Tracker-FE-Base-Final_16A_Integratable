import { mockDb } from "../../mock/mockData";

export interface AllocateModuleLeaderRequest {
  projectId: number;
  moduleId: number;
  userId: number;
}

export interface AllocatedLeaderResponse {
  allocateModuleId: number;
  moduleId: number;
  userId: number;
  userName?: string;
}

export const allocateModuleLeader = async (data: AllocateModuleLeaderRequest) => {
  const user = mockDb.getUserById(data.userId);
  const updated = mockDb.updateModule(data.moduleId, {
    leaderId: data.userId,
    leaderName: user ? `${user.firstName} ${user.lastName}` : 'Module Leader',
    allocatedLeader: {
      id: Date.now(),
      employeeId: data.userId,
      employeeName: user ? `${user.firstName} ${user.lastName}` : 'Module Leader',
      allocatedDate: new Date().toISOString().split('T')[0],
    },
  });

  return {
    status: 'success',
    statusCode: 200,
    message: 'Leader allocated successfully',
    data: updated,
  };
};

export const getAllocatedLeader = async (moduleId: number): Promise<AllocatedLeaderResponse | null> => {
  const mod = mockDb.getModuleById(moduleId);
  if (!mod || !mod.leaderId) return null;
  return {
    allocateModuleId: Date.now(),
    moduleId: mod.id,
    userId: mod.leaderId,
    userName: mod.leaderName || 'Leader',
  };
};

export const deallocateModuleLeader = async (allocateModuleId: number) => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Leader deallocated successfully',
    data: { allocateModuleId },
  };
};