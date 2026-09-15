import { SmtpConfig } from "../types/emailConfiguration";
import { mockDb, INITIAL_EMAIL_POINT_SETUPS, INITIAL_EMAIL_TEMPLATES } from "../mock/mockData";

export interface CreateSmtpConfigRequest {
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  isEnabled?: boolean;
}

export const createSmtpConfig = async (data: CreateSmtpConfigRequest): Promise<SmtpConfig> => {
  const created = mockDb.createEmailConfig(data);
  return created as any;
};

export const getSmtpConfigs = async (): Promise<SmtpConfig[]> => {
  return mockDb.getEmailConfigs() as any[];
};

export const updateSmtpConfig = async (id: number, data: CreateSmtpConfigRequest): Promise<SmtpConfig> => {
  const updated = mockDb.updateEmailConfig(id, data);
  return (updated || data) as any;
};

export const deleteSmtpConfig = async (id: number): Promise<void> => {
  mockDb.deleteEmailConfig(id);
};

export const updateSmtpConfigStatus = async (id: number, isEnabled: boolean) => {
  const updated = mockDb.updateEmailConfig(id, { isEnabled });
  return {
    status: 'success',
    statusCode: 200,
    data: updated,
  };
};

export const getAllEmailPointSetups = async () => {
  return INITIAL_EMAIL_POINT_SETUPS;
};

export const getRoleNotificationChannels = async (_roleId: number): Promise<Record<number, string>> => {
  return {
    1: 'email',
    2: 'email',
    3: 'in-app',
    4: 'email',
  };
};

export const updateRoleNotificationRules = async (_roleId: number, _pointChannels: Map<number, string>): Promise<void> => {
  return Promise.resolve();
};

export const updateUserExtraPoints = async (_userId: number, _pointChannels: Map<number, string>): Promise<void> => {
  return Promise.resolve();
};

export const updateEmailPointSetupStatus = async (id: number, isEnabled: boolean) => {
  return {
    status: 'success',
    statusCode: 200,
    data: { id, isEnabled },
  };
};

export const getAllEmailTemplates = async () => {
  return {
    status: 'success',
    statusCode: 200,
    data: INITIAL_EMAIL_TEMPLATES,
  };
};

export const updateEmailTemplate = async (id: number, data: { subject: string; body: string }) => {
  return {
    status: 'success',
    statusCode: 200,
    data: { id, ...data },
  };
};

export const resetEmailTemplate = async (id: number) => {
  const template = INITIAL_EMAIL_TEMPLATES.find(t => t.id === id);
  return {
    status: 'success',
    statusCode: 200,
    data: template,
  };
};