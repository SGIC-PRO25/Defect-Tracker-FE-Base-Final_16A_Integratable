export interface ImportTestCaseResponse {
  status: string;
  message: string;
  data: any;
  statusCode: number;
}

export const importTestCases = async (_formData: FormData, _projectId: string | number): Promise<ImportTestCaseResponse> => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Test cases imported successfully',
    data: { importedCount: 5 },
  };
};

export const importDefects = async (_formData: FormData, _projectId: string) => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Defects imported successfully',
    data: { importedCount: 3 },
  };
};

export const testAuthHeader = async (): Promise<void> => {
  return Promise.resolve();
};