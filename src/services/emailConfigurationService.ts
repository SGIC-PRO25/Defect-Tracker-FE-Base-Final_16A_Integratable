import { mockDb } from "../mock/mockData";

export interface SmtpConfigRequest {
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface SmtpConfigResponse {
  id: number;
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserEmailPreferences {
  defectEmailStatus: boolean;
  projectAllocationEmailStatus: boolean;
  moduleAllocationEmailStatus: boolean;
  submoduleAllocationEmailStatus: boolean;
}

export interface SimpleUser {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export const createSmtpConfig = async (data: SmtpConfigRequest): Promise<SmtpConfigResponse> => {
  const created = mockDb.createEmailConfig(data);
  return created as any;
};

export const getSmtpConfigs = async (): Promise<SmtpConfigResponse[]> => {
  return mockDb.getEmailConfigs() as any[];
};

export const updateSmtpConfig = async (id: number, data: SmtpConfigRequest): Promise<SmtpConfigResponse> => {
  const updated = mockDb.updateEmailConfig(id, data);
  return (updated || data) as any;
};

export const deleteSmtpConfig = async (id: number): Promise<void> => {
  mockDb.deleteEmailConfig(id);
};

export const getAllUsers = async (): Promise<SimpleUser[]> => {
  const users = mockDb.getUsers();
  return users.map(u => ({
    id: u.id,
    userId: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
  }));
};

export const getUserEmailPreferences = async (userId: string): Promise<UserEmailPreferences> => {
  const prefs = mockDb.getUserPreferences(Number(userId));
  return prefs.emailNotifications ? {
    defectEmailStatus: true,
    projectAllocationEmailStatus: true,
    moduleAllocationEmailStatus: true,
    submoduleAllocationEmailStatus: true,
  } : {
    defectEmailStatus: false,
    projectAllocationEmailStatus: false,
    moduleAllocationEmailStatus: false,
    submoduleAllocationEmailStatus: false,
  };
};

export const updateUserEmailPreferences = async (
  userId: string,
  preferences: UserEmailPreferences
): Promise<ApiResponse<UserEmailPreferences>> => {
  mockDb.updateUserPreferences(Number(userId), {
    emailNotifications: preferences.defectEmailStatus,
  });

  return {
    status: 'success',
    message: 'Email preferences updated successfully',
    data: preferences,
  };
};

export interface NotificationRule {
  id: string;
  eventType: string;
  eventLabel: string;
  description: string;
  enabled: boolean;
  recipientRoles: string[];
}

export const getNotificationRules = async (): Promise<NotificationRule[]> => {
  const savedRules = localStorage.getItem('email_notification_rules');
  if (savedRules) {
    return JSON.parse(savedRules);
  }

  return [
    {
      id: 'rule_1',
      eventType: 'defect_created',
      eventLabel: 'Defect Created',
      description: 'When a new defect is created',
      enabled: true,
      recipientRoles: ['project_manager', 'team_lead'],
    },
    {
      id: 'rule_2',
      eventType: 'defect_assigned',
      eventLabel: 'Defect Assigned',
      description: 'When a defect is assigned to a user',
      enabled: true,
      recipientRoles: ['developer', 'tester'],
    },
    {
      id: 'rule_3',
      eventType: 'project_allocated',
      eventLabel: 'Project Allocated',
      description: 'When user is allocated to a project',
      enabled: true,
      recipientRoles: ['developer', 'tester', 'team_lead'],
    },
    {
      id: 'rule_4',
      eventType: 'module_allocated',
      eventLabel: 'Module Allocated',
      description: 'When user is allocated to a module',
      enabled: true,
      recipientRoles: ['developer', 'tester'],
    },
  ];
};

export const updateNotificationRule = async (rule: NotificationRule): Promise<NotificationRule> => {
  const rules = await getNotificationRules();
  const index = rules.findIndex(r => r.id === rule.id);
  if (index !== -1) {
    rules[index] = rule;
    localStorage.setItem('email_notification_rules', JSON.stringify(rules));
  }
  return rule;
};

export const updateAllNotificationRules = async (rules: NotificationRule[]): Promise<NotificationRule[]> => {
  localStorage.setItem('email_notification_rules', JSON.stringify(rules));
  return rules;
};

export const getAvailableRoles = async (): Promise<{ id: string; name: string; description: string }[]> => {
  return [
    { id: 'admin', name: 'Admin', description: 'Full system access' },
    { id: 'project_manager', name: 'Project Manager', description: 'Manage projects' },
    { id: 'team_lead', name: 'Team Lead', description: 'Lead development team' },
    { id: 'developer', name: 'Developer', description: 'Development' },
    { id: 'tester', name: 'Tester', description: 'Quality assurance' },
  ];
};