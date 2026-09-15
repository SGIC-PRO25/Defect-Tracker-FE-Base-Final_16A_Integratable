export const submoduleBulkAllocate = async (
  _projectId: number,
  _moduleId: number,
  _subModuleId: number,
  _userIds: number[]
) => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Submodule developers allocated successfully',
  };
};
