import { mockDb } from "../../mock/mockData";

export const deallocateModuleLeaderWithAllocateModuleId = async (allocateModuleId: number) => {
  return { status: 'success', message: 'Deallocated successfully', data: { allocateModuleId } };
};

export const deallocateDeveloperFromModule = async (
  projectId: number,
  moduleId: number,
  userId: number
) => {
  return { status: 'success', message: 'Developer deallocated from module', data: { projectId, moduleId, userId } };
};

export const deallocateSubmoduleDeveloperWithAllocateModuleId = async (
  allocateModuleId: number
) => {
  return { status: 'success', message: 'Submodule developer deallocated', data: { allocateModuleId } };
};

export const deallocateDeveloperFromSubmodule = async (
  projectId: number,
  moduleId: number,
  submoduleId: number,
  userId: number
) => {
  return { status: 'success', message: 'Developer deallocated from submodule', data: { projectId, moduleId, submoduleId, userId } };
};

export const reassignDeveloperWithAllocateModuleId = async (
  allocateModuleId: number,
  newUserId: number
) => {
  return { status: 'success', message: 'Developer reassigned', data: { allocateModuleId, newUserId } };
};

export const reassignSubmoduleDeveloperWithAllocateModuleId = async (
  allocationId: number,
  newUserId: number
) => {
  return { status: 'success', message: 'Submodule developer reassigned', data: { allocationId, newUserId } };
};

export const reassignDeveloperToModule = async (
  projectId: number,
  moduleId: number,
  oldUserId: number,
  newUserId: number
) => {
  return { status: 'success', message: 'Developer reassigned to module', data: { projectId, moduleId, oldUserId, newUserId } };
};

export const reassignDeveloperToSubmodule = async (
  projectId: number,
  moduleId: number,
  submoduleId: number,
  oldUserId: number,
  newUserId: number
) => {
  return { status: 'success', message: 'Developer reassigned to submodule', data: { projectId, moduleId, submoduleId, oldUserId, newUserId } };
};