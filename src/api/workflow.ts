import { mockDb } from "../mock/mockData";

interface WorkflowNodeRequest {
  id: number;
  positionX: number;
  positionY: number;
}

interface WorkflowConnectionRequest {
  fromStatusId: number;
  toStatusId: number;
}

export interface SaveWorkflowRequest {
  nodes: WorkflowNodeRequest[];
  connections: WorkflowConnectionRequest[];
}

export interface SaveWorkflowResponse {
  status: string;
  statusMessage: string;
  data?: any;
  statusCode: number;
}

interface StatusInfo {
  id: number;
  name: string;
  color: string;
}

interface WorkflowTransitionResponse {
  id: number;
  fromStatus: StatusInfo;
  toStatus: StatusInfo;
}

export interface GetAllWorkflowsResponse {
  status: string;
  statusMessage: string;
  data: WorkflowTransitionResponse[];
  statusCode: number;
}

export interface NextStatusResponse {
  status: string;
  statusMessage: string;
  data: StatusInfo[];
  statusCode: number;
}

export const getAllWorkflows = async (): Promise<GetAllWorkflowsResponse> => {
  const statuses = mockDb.getStatuses();
  const transitions: WorkflowTransitionResponse[] = [];
  
  for (let i = 0; i < statuses.length - 1; i++) {
    transitions.push({
      id: i + 1,
      fromStatus: { id: statuses[i].id, name: statuses[i].statusName, color: statuses[i].color },
      toStatus: { id: statuses[i + 1].id, name: statuses[i + 1].statusName, color: statuses[i + 1].color },
    });
  }

  return {
    status: 'success',
    statusMessage: 'Workflows fetched successfully',
    statusCode: 200,
    data: transitions,
  };
};

export const saveWorkflow = async (workflowData: SaveWorkflowRequest): Promise<SaveWorkflowResponse> => {
  return {
    status: 'success',
    statusMessage: 'Workflow saved successfully',
    statusCode: 200,
    data: workflowData,
  };
};

export const getNextStatuses = async (
  fromStatusId: number
): Promise<NextStatusResponse> => {
  const statuses = mockDb.getStatuses();
  const filtered = statuses.filter(s => s.id !== fromStatusId);

  return {
    status: 'success',
    statusMessage: 'Next statuses fetched',
    statusCode: 200,
    data: filtered.map(s => ({ id: s.id, name: s.statusName, color: s.color })),
  };
};
