import { mockDb } from "../../mock/mockData";

export const searchTestCaseByCriteria = async (
  _moduleId: number,
  description?: string,
  defectTypeId?: number,
  severityId?: number
) => {
  let testCases = mockDb.getTestCases();
  if (description) {
    const term = description.toLowerCase();
    testCases = testCases.filter(t => t.description.toLowerCase().includes(term));
  }
  if (defectTypeId) {
    testCases = testCases.filter(t => t.defectTypeId === defectTypeId);
  }
  if (severityId) {
    testCases = testCases.filter(t => t.severityId === severityId);
  }
  return testCases;
};