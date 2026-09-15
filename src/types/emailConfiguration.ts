

export interface SmtpConfig {
  id: number;
  name: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface UserEmailPreferences {
  defectEmailStatus: boolean;
  projectAllocationEmailStatus: boolean;
  moduleAllocationEmailStatus: boolean;
  submoduleAllocationEmailStatus: boolean;
}

export interface SimpleUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

interface EmailTemplate {
  id: string;
  eventType: string;
  eventLabel: string;
  description: string;
  subject: string;
  body: string;
  variables: string[];
  isCustom: boolean;
  lastModified?: string;
}

export interface NotificationRule {
  id: string;
  eventType: string;
  eventLabel: string;
  description: string;
  enabled: boolean;
  recipientRoles: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}