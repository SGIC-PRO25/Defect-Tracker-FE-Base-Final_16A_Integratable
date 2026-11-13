import { SmtpConfig } from "../types/emailConfiguration";
import { mockDb, NotificationChannel } from "../mock/mockData";

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
  return mockDb.getEmailPointSetups();
};

export const getRoleNotificationChannels = async (roleId: number): Promise<Record<number, string>> => {
  return mockDb.getRoleNotificationChannels(roleId);
};

export const updateRoleNotificationRules = async (roleId: number, pointChannels: Map<number, string>): Promise<void> => {
  mockDb.setRoleNotificationChannels(roleId, Object.fromEntries(pointChannels) as Record<number, NotificationChannel>);
};

export const getUserExtraPoints = async (userId: number): Promise<Record<number, string>> => {
  return mockDb.getUserExtraPoints(userId);
};

export const updateUserExtraPoints = async (userId: number, pointChannels: Map<number, string>): Promise<void> => {
  mockDb.setUserExtraPoints(userId, Object.fromEntries(pointChannels) as Record<number, NotificationChannel>);
};

export const updateEmailPointSetupStatus = async (id: number, isEnabled: boolean) => {
  const updated = mockDb.setEmailPointEnabled(id, isEnabled);
  return {
    status: 'success',
    statusCode: 200,
    data: updated ?? { id, isEnabled },
  };
};

export const getAllEmailTemplates = async () => {
  return {
    status: 'success',
    statusCode: 200,
    data: mockDb.getEmailTemplates(),
  };
};

export const updateEmailTemplate = async (id: number, data: { subject: string; body: string }) => {
  const updated = mockDb.updateEmailTemplate(id, data);
  return {
    status: 'success',
    statusCode: 200,
    data: updated ?? { id, ...data },
  };
};

export const resetEmailTemplate = async (id: number) => {
  return {
    status: 'success',
    statusCode: 200,
    data: mockDb.resetEmailTemplate(id),
  };
};