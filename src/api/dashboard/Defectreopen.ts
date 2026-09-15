import { mockDb } from "../../mock/mockData";

export async function getReopenCountSummary(projectId: number) {
  const defects = mockDb.getDefects(projectId);
  const reopened = defects.filter(d => (d.reOpenCount || 0) > 0).length;
  const notReopened = Math.max(0, defects.length - reopened);

  return {
    status: "success",
    data: [
      { label: "Reopened", count: reopened || 2 },
      { label: "Not Reopened", count: notReopened || 8 },
    ],
  };
}