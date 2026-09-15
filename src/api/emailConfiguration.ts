import { mockDb } from "../mock/mockData";

export interface CreateSmtpConfigRequest {
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface CreateSmtpConfigResponse {
  id: number;
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export const createSmtpConfig = async (data: CreateSmtpConfigRequest): Promise<CreateSmtpConfigResponse> => {
  const created = mockDb.createEmailConfig(data);
  return created as any;
};

export const getSmtpConfigs = async (): Promise<CreateSmtpConfigResponse[]> => {
  return mockDb.getEmailConfigs() as any[];
};

export const updateSmtpConfig = async (id: number, data: CreateSmtpConfigRequest): Promise<CreateSmtpConfigResponse> => {
  const updated = mockDb.updateEmailConfig(id, data);
  return (updated || data) as any;
};

export const deleteSmtpConfig = async (id: number): Promise<void> => {
  mockDb.deleteEmailConfig(id);
};