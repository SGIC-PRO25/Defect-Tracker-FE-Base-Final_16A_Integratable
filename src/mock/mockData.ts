// Central Mock Database for Defect Tracker Pro
// Contains comprehensive mock datasets and stateful helpers for offline/standalone mode.

export interface MockUser {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userGender?: string;
  userStatus: string;
  designationId?: number;
  designationName?: string;
  roleId?: number;
  roleName?: string;
  roles?: string[];
  userType?: string;
  availabilityPercent?: number;
  skills?: string[];
  currentProjects?: string[];
  joinedDate?: string;
  experience?: number;
  department?: string;
  manager?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MockProject {
  id: string | number;
  projectId?: string | number;
  name?: string;
  projectName?: string;
  prefix?: string;
  projectType?: string;
  status?: string;
  projectStatus?: string;
  startDate?: string;
  endDate?: string;
  manager?: string | number;
  userId?: number;
  userFirstName?: string;
  userLastName?: string;
  clientName?: string;
  country?: string;
  clientCountry?: string;
  state?: string;
  clientState?: string;
  email?: string;
  clientEmail?: string;
  phoneNo?: string;
  clientPhone?: string;
  address?: string;
  description?: string;
  progress?: number;
  kloc?: number;
  teamMembers?: string[];
}

export interface MockRelease {
  id: number | string;
  releaseId?: number | string;
  name?: string;
  releaseName?: string;
  version?: string;
  releaseVersion?: string;
  description?: string;
  projectId: number;
  projectName?: string;
  status: string;
  releaseStatus?: string;
  releaseTypeId?: number;
  releaseTypeName?: string;
  startDate?: string;
  releaseDate?: string;
  endDate?: string;
  kloc?: number;
  totalTestCases?: number;
  passedTestCases?: number;
  failedTestCases?: number;
  blockedTestCases?: number;
  unexecutedTestCases?: number;
  features?: string[];
  bugFixes?: string[];
  testCases?: number[];
  createdAt?: string;
}

export interface MockModule {
  id: number;
  moduleId?: number;
  name: string;
  moduleName?: string;
  projectId: number;
  description?: string;
  leaderId?: number | null;
  leaderName?: string | null;
  allocatedLeader?: {
    id: number;
    employeeId: number;
    employeeName: string;
    allocatedDate: string;
  } | null;
  assignedDevs?: string[];
  submodules?: MockSubmodule[];
}

export interface MockSubmodule {
  id: number;
  subModuleId?: number;
  name: string;
  subModuleName?: string;
  moduleId: number;
  description?: string;
  assignedDevs?: Array<{
    id: number;
    employeeId: number;
    employeeName: string;
    assignedDate?: string;
  }>;
}

export interface MockTestCase {
  id: number;
  testcaseNo: string;
  no?: string;
  description: string;
  detailsSteps: string;
  steps?: string;
  expectedResult: string;
  subModuleId: number;
  subModuleName: string;
  moduleId?: number;
  moduleName?: string;
  projectId?: number;
  severityId: number;
  severityName: string;
  severity?: string;
  defectTypeId: number;
  defectTypeName: string;
  type?: string;
  executionStatus?: 'PASS' | 'FAIL' | 'BLOCKED' | 'NOT_RUN' | 'HOLD';
  assignedQaId?: number | null;
  assignedQaName?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface MockDefect {
  id: number;
  defectId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  priorityId?: number;
  priorityName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  severityId?: number;
  severityName?: string;
  status: 'new' | 'open' | 'in-progress' | 'resolved' | 'closed' | 'rejected' | string;
  statusId?: number;
  statusName?: string;
  defectStatusId?: number;
  defectStatusName?: string;
  projectId: number;
  projectName?: string;
  releaseId?: number | string;
  releaseName?: string;
  moduleId?: number;
  moduleName?: string;
  subModuleId?: number;
  subModuleName?: string;
  testCaseId?: number | null;
  steps?: string;
  stepsToReproduce?: string[];
  reOpenCount: number;
  reopenCount?: number;
  attachment?: string | null;
  attachments?: string[];
  reportedBy?: string;
  assignedTo?: string;
  assignedToId?: number;
  assignedToName?: string;
  assignedById?: number;
  assignedByName?: string;
  createdAt: string;
  updatedAt: string;
  defectHistory?: Array<{
    id?: number;
    status: string;
    changedAt: string;
    comment?: string;
    changedBy?: string;
  }>;
  comments?: Array<{
    id: number;
    defectId: number;
    userId: number;
    userName: string;
    userAvatar?: string;
    comment: string;
    createdAt: string;
  }>;
}

// Initial Mock Designations
export const INITIAL_DESIGNATIONS = [
  { id: 1, designationName: 'Project Manager', description: 'Manages overall project execution and delivery', totalEmployees: 4 },
  { id: 2, designationName: 'Senior Software Engineer', description: 'Leads module development and architecture', totalEmployees: 12 },
  { id: 3, designationName: 'Software Engineer', description: 'Develops backend and frontend application modules', totalEmployees: 18 },
  { id: 4, designationName: 'Lead QA Engineer', description: 'Oversees QA strategies, test plans, and release sign-offs', totalEmployees: 5 },
  { id: 5, designationName: 'QA Test Engineer', description: 'Executes test cases and logs defect reports', totalEmployees: 14 },
  { id: 6, designationName: 'DevOps Engineer', description: 'Manages CI/CD pipelines and infrastructure', totalEmployees: 3 },
  { id: 7, designationName: 'UI/UX Designer', description: 'Designs interface and user experience workflows', totalEmployees: 3 },
];

// Initial Mock Roles
export const INITIAL_ROLES = [
  { id: 1, roleName: 'Super Admin', description: 'Full system access and configurations', totalPermissions: 45 },
  { id: 2, roleName: 'Project Manager', description: 'Project, release, module, and allocation management', totalPermissions: 32 },
  { id: 3, roleName: 'Tech Lead / Module Leader', description: 'Module management and developer allocations', totalPermissions: 24 },
  { id: 4, roleName: 'Developer', description: 'Defect fixing and code allocations', totalPermissions: 16 },
  { id: 5, roleName: 'QA Lead', description: 'Test cases, executions, release QA, defect creation', totalPermissions: 28 },
  { id: 6, roleName: 'QA Tester', description: 'Test execution, defect logging, and verification', totalPermissions: 20 },
];

// Initial Permissions
export const INITIAL_PERMISSIONS = [
  { permissionId: 1, action: 'DESIGNATION_CREATE', description: 'Create Designation' },
  { permissionId: 2, action: 'DESIGNATION_UPDATE', description: 'Update Designation' },
  { permissionId: 3, action: 'DESIGNATION_READ', description: 'View Designation' },
  { permissionId: 4, action: 'DESIGNATION_DELETE', description: 'Delete Designation' },
  { permissionId: 5, action: 'ROLE_CREATE', description: 'Create Role' },
  { permissionId: 6, action: 'ROLE_UPDATE', description: 'Update Role' },
  { permissionId: 7, action: 'ROLE_READ', description: 'View Role' },
  { permissionId: 8, action: 'ROLE_DELETE', description: 'Delete Role' },
  { permissionId: 9, action: 'PERMISSION_READ', description: 'View Permissions' },
  { permissionId: 10, action: 'ROLE_PERMISSION_ASSIGN', description: 'Assign Permissions to Role' },
  { permissionId: 11, action: 'ROLE_PERMISSION_READ', description: 'View Role Permissions' },
  { permissionId: 12, action: 'DEFECT_TYPE_CREATE', description: 'Create Defect Type' },
  { permissionId: 13, action: 'DEFECT_TYPE_UPDATE', description: 'Update Defect Type' },
  { permissionId: 14, action: 'DEFECT_TYPE_READ', description: 'View Defect Type' },
  { permissionId: 15, action: 'DEFECT_TYPE_DELETE', description: 'Delete Defect Type' },
  { permissionId: 16, action: 'RELEASE_TYPE_CREATE', description: 'Create Release Type' },
  { permissionId: 17, action: 'RELEASE_TYPE_UPDATE', description: 'Update Release Type' },
  { permissionId: 18, action: 'RELEASE_TYPE_READ', description: 'View Release Type' },
  { permissionId: 19, action: 'RELEASE_TYPE_DELETE', description: 'Delete Release Type' },
  { permissionId: 20, action: 'SEVERITY_CREATE', description: 'Create Severity' },
  { permissionId: 21, action: 'SEVERITY_UPDATE', description: 'Update Severity' },
  { permissionId: 22, action: 'SEVERITY_READ', description: 'View Severity' },
  { permissionId: 23, action: 'SEVERITY_DELETE', description: 'Delete Severity' },
  { permissionId: 24, action: 'PRIORITY_CREATE', description: 'Create Priority' },
  { permissionId: 25, action: 'PRIORITY_UPDATE', description: 'Update Priority' },
  { permissionId: 26, action: 'PRIORITY_READ', description: 'View Priority' },
  { permissionId: 27, action: 'PRIORITY_DELETE', description: 'Delete Priority' },
  { permissionId: 28, action: 'STATUS_TYPE_CREATE', description: 'Create Status Type' },
  { permissionId: 29, action: 'STATUS_TYPE_UPDATE', description: 'Update Status Type' },
  { permissionId: 30, action: 'STATUS_TYPE_READ', description: 'View Status Type' },
  { permissionId: 31, action: 'STATUS_TYPE_DELETE', description: 'Delete Status Type' },
  { permissionId: 32, action: 'WORKFLOW_CREATE', description: 'Create Workflow' },
  { permissionId: 33, action: 'WORKFLOW_READ', description: 'View Workflow' },
  { permissionId: 34, action: 'EMPLOYEE_CREATE', description: 'Create Employee' },
  { permissionId: 35, action: 'EMPLOYEE_UPDATE', description: 'Update Employee' },
  { permissionId: 36, action: 'EMPLOYEE_READ', description: 'View Employee' },
  { permissionId: 37, action: 'EMPLOYEE_DELETE', description: 'Delete Employee' },
  { permissionId: 38, action: 'BENCH_READ', description: 'View Bench' },
  { permissionId: 39, action: 'PROJECT_CREATE', description: 'Create Project' },
  { permissionId: 40, action: 'PROJECT_UPDATE', description: 'Update Project' },
  { permissionId: 41, action: 'PROJECT_READ', description: 'View Project' },
  { permissionId: 42, action: 'PROJECT_DELETE', description: 'Delete Project' },
  { permissionId: 43, action: 'MODULE_CREATE', description: 'Create Module' },
  { permissionId: 44, action: 'MODULE_UPDATE', description: 'Update Module' },
  { permissionId: 45, action: 'MODULE_READ', description: 'View Module' },
  { permissionId: 46, action: 'MODULE_DELETE', description: 'Delete Module' },
  { permissionId: 47, action: 'TEST_CASE_CREATE', description: 'Create Test Case' },
  { permissionId: 48, action: 'TEST_CASE_UPDATE', description: 'Update Test Case' },
  { permissionId: 49, action: 'TEST_CASE_READ', description: 'View Test Case' },
  { permissionId: 50, action: 'TEST_CASE_DELETE', description: 'Delete Test Case' },
  { permissionId: 51, action: 'RELEASE_CREATE', description: 'Create Release' },
  { permissionId: 52, action: 'RELEASE_UPDATE', description: 'Update Release' },
  { permissionId: 53, action: 'RELEASE_READ', description: 'View Release' },
  { permissionId: 54, action: 'RELEASE_DELETE', description: 'Delete Release' },
  { permissionId: 55, action: 'DEFECT_CREATE', description: 'Create Defect' },
  { permissionId: 56, action: 'DEFECT_UPDATE', description: 'Update Defect' },
  { permissionId: 57, action: 'DEFECT_READ', description: 'View Defect' },
  { permissionId: 58, action: 'DEFECT_DELETE', description: 'Delete Defect' },
  { permissionId: 59, action: 'DEFECT_ASSIGN_DEVELOPER', description: 'Assign Developer to Defect' },
  { permissionId: 60, action: 'DEFECT_STATUS_CHANGE', description: 'Change Defect Status' },
  { permissionId: 61, action: 'DEFECT_COMMENT_CREATE', description: 'Add Defect Comment' },
  { permissionId: 62, action: 'DEFECT_COMMENT_READ', description: 'View Defect Comments' },
  { permissionId: 63, action: 'EMAIL_CONFIG_READ', description: 'View Email Configurations' },
  { permissionId: 64, action: 'EMAIL_CONFIG_CREATE', description: 'Create Email Configuration' },
  { permissionId: 65, action: 'EMAIL_CONFIG_UPDATE', description: 'Update Email Configuration' },
  { permissionId: 66, action: 'EMAIL_CONFIG_DELETE', description: 'Delete Email Configuration' },
  { permissionId: 67, action: 'ALL_PERMISSIONS', description: 'Full System Administrator Access' },
];

// Initial Severities
export const INITIAL_SEVERITIES = [
  { id: 1, name: 'Low', color: '#10B981', description: 'Minor cosmetic issue or trivial inconvenience' },
  { id: 2, name: 'Medium', color: '#F59E0B', description: 'Non-critical feature flaw with workaround' },
  { id: 3, name: 'High', color: '#EF4444', description: 'Core functional defect affecting user workflows' },
  { id: 4, name: 'Critical', color: '#7C3AED', description: 'System crash, data loss, or security compromise' },
];

// Initial Priorities
export const INITIAL_PRIORITIES = [
  { id: 1, name: 'Low', color: '#10B981', description: 'Can be addressed in future sprints' },
  { id: 2, name: 'Medium', color: '#3B82F6', description: 'Should be resolved during normal release cycle' },
  { id: 3, name: 'High', color: '#F97316', description: 'High priority fix required before testing sign-off' },
  { id: 4, name: 'Immediate', color: '#DC2626', description: 'Blocker - requires immediate hotfix' },
];

// Initial Defect Types
export const INITIAL_DEFECT_TYPES = [
  { id: 1, defectTypeName: 'UI / UX Design', name: 'UI / UX Design' },
  { id: 2, defectTypeName: 'Functional Bug', name: 'Functional Bug' },
  { id: 3, defectTypeName: 'Performance / Latency', name: 'Performance / Latency' },
  { id: 4, defectTypeName: 'Security Vulnerability', name: 'Security Vulnerability' },
  { id: 5, defectTypeName: 'Database / Data Integrity', name: 'Database / Data Integrity' },
  { id: 6, defectTypeName: 'Integration / API', name: 'Integration / API' },
];

// Initial Release Types
export const INITIAL_RELEASE_TYPES = [
  { id: 1, releaseTypeName: 'Major Release' },
  { id: 2, releaseTypeName: 'Minor Enhancement' },
  { id: 3, releaseTypeName: 'Patch / Hotfix' },
  { id: 4, releaseTypeName: 'Sprint Milestone' },
];

// Initial Status Types
export const INITIAL_STATUS_TYPES = [
  { id: 1, name: 'New', color: '#3B82F6', isInitial: true, description: 'Newly reported defect' },
  { id: 2, name: 'Open', color: '#6366F1', isInitial: false, description: 'Acknowledged and assigned' },
  { id: 3, name: 'In Progress', color: '#F59E0B', isInitial: false, description: 'Actively being investigated or fixed' },
  { id: 4, name: 'Resolved', color: '#10B981', isInitial: false, description: 'Fix committed, awaiting verification' },
  { id: 5, name: 'Closed', color: '#64748B', isInitial: false, description: 'Verified and officially closed' },
  { id: 6, name: 'Reopened', color: '#EF4444', isInitial: false, description: 'Verification failed or defect reoccurred' },
  { id: 7, name: 'Rejected', color: '#94A3B8', isInitial: false, description: 'Invalid, duplicate, or working as designed' },
];

// Initial Users & Employees
export const INITIAL_USERS: MockUser[] = [
  {
    id: 1,
    userId: 'EMP-101',
    firstName: 'Arun',
    lastName: 'Kumar',
    email: 'admin@defecttracker.com',
    phone: '+91 98765 43210',
    userGender: 'Male',
    userStatus: 'ACTIVE',
    designationId: 1,
    designationName: 'Project Manager',
    roleId: 1,
    roleName: 'Super Admin',
    roles: ['Super Admin', 'Project Manager'],
    userType: 'CompanyStaff',
    availabilityPercent: 80,
    skills: ['Agile Leadership', 'System Architecture', 'Release Governance'],
    currentProjects: ['E-Commerce Core Platform', 'Banking Mobile Portal'],
    joinedDate: '2022-01-15',
    experience: 8,
    department: 'Engineering Management',
    address: 'Chennai, India',
    createdAt: '2022-01-15T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 2,
    userId: 'EMP-102',
    firstName: 'Priya',
    lastName: 'Ramesh',
    email: 'priya.ramesh@defecttracker.com',
    phone: '+91 98765 43211',
    userGender: 'Female',
    userStatus: 'ACTIVE',
    designationId: 4,
    designationName: 'Lead QA Engineer',
    roleId: 5,
    roleName: 'QA Lead',
    roles: ['QA Lead'],
    userType: 'Employee',
    availabilityPercent: 90,
    skills: ['Automation Testing', 'Cypress', 'Playwright', 'Test Strategy'],
    currentProjects: ['E-Commerce Core Platform', 'Healthcare Patient Care'],
    joinedDate: '2022-06-01',
    experience: 6,
    department: 'Quality Assurance',
    address: 'Bangalore, India',
    createdAt: '2022-06-01T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 3,
    userId: 'EMP-103',
    firstName: 'Karthik',
    lastName: 'Sundaram',
    email: 'karthik.sundaram@defecttracker.com',
    phone: '+91 98765 43212',
    userGender: 'Male',
    userStatus: 'ACTIVE',
    designationId: 2,
    designationName: 'Senior Software Engineer',
    roleId: 3,
    roleName: 'Tech Lead / Module Leader',
    roles: ['Tech Lead / Module Leader', 'Developer'],
    userType: 'Employee',
    availabilityPercent: 100,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL'],
    currentProjects: ['E-Commerce Core Platform'],
    joinedDate: '2023-02-10',
    experience: 5,
    department: 'Software Engineering',
    address: 'Coimbatore, India',
    createdAt: '2023-02-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 4,
    userId: 'EMP-104',
    firstName: 'Sneha',
    lastName: 'Natarajan',
    email: 'sneha.n@defecttracker.com',
    phone: '+91 98765 43213',
    userGender: 'Female',
    userStatus: 'ACTIVE',
    designationId: 3,
    designationName: 'Software Engineer',
    roleId: 4,
    roleName: 'Developer',
    roles: ['Developer'],
    userType: 'Employee',
    availabilityPercent: 100,
    skills: ['Java', 'Spring Boot', 'Microservices', 'REST APIs', 'Docker'],
    currentProjects: ['Banking Mobile Portal'],
    joinedDate: '2023-09-01',
    experience: 3,
    department: 'Software Engineering',
    address: 'Madurai, India',
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 5,
    userId: 'EMP-105',
    firstName: 'Dinesh',
    lastName: 'Venkatesh',
    email: 'dinesh.v@defecttracker.com',
    phone: '+91 98765 43214',
    userGender: 'Male',
    userStatus: 'ACTIVE',
    designationId: 5,
    designationName: 'QA Test Engineer',
    roleId: 6,
    roleName: 'QA Tester',
    roles: ['QA Tester'],
    userType: 'Employee',
    availabilityPercent: 60,
    skills: ['Manual Testing', 'API Testing', 'Postman', 'Performance Testing'],
    currentProjects: ['E-Commerce Core Platform'],
    joinedDate: '2024-01-10',
    experience: 2,
    department: 'Quality Assurance',
    address: 'Trichy, India',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 6,
    userId: 'EMP-106',
    firstName: 'Meera',
    lastName: 'Krishnan',
    email: 'meera.k@defecttracker.com',
    phone: '+91 98765 43215',
    userGender: 'Female',
    userStatus: 'ACTIVE',
    designationId: 1,
    designationName: 'Project Manager',
    roleId: 2,
    roleName: 'Project Manager',
    roles: ['Project Manager'],
    userType: 'Employee',
    availabilityPercent: 100,
    skills: ['Scrum', 'Stakeholder Management', 'Risk Management', 'Jira'],
    currentProjects: ['Healthcare Patient Care'],
    joinedDate: '2021-11-01',
    experience: 9,
    department: 'Engineering Management',
    address: 'Chennai, India',
    createdAt: '2021-11-01T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 7,
    userId: 'EMP-107',
    firstName: 'Vikram',
    lastName: 'Balaji',
    email: 'vikram.b@defecttracker.com',
    phone: '+91 98765 43216',
    userGender: 'Male',
    userStatus: 'ACTIVE',
    designationId: 3,
    designationName: 'Software Engineer',
    roleId: 4,
    roleName: 'Developer',
    roles: ['Developer'],
    userType: 'Employee',
    availabilityPercent: 100,
    skills: ['Vue.js', 'TailwindCSS', 'TypeScript', 'Node.js'],
    currentProjects: [],
    joinedDate: '2024-03-15',
    experience: 2,
    department: 'Software Engineering',
    address: 'Salem, India',
    createdAt: '2024-03-15T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
];

// Initial Projects
export const INITIAL_PROJECTS: MockProject[] = [
  {
    id: 1,
    projectId: 1,
    name: 'E-Commerce Core Platform',
    projectName: 'E-Commerce Core Platform',
    prefix: 'ECC',
    projectType: 'Web Application',
    status: 'ACTIVE',
    projectStatus: 'ACTIVE',
    startDate: '2025-01-10',
    endDate: '2026-12-31',
    manager: 'Arun Kumar',
    userId: 1,
    userFirstName: 'Arun',
    userLastName: 'Kumar',
    clientName: 'Global Retail Corp',
    country: 'United States',
    clientCountry: 'United States',
    state: 'California',
    clientState: 'California',
    email: 'contact@globalretail.com',
    clientEmail: 'contact@globalretail.com',
    phoneNo: '+1 415 555 0199',
    clientPhone: '+1 415 555 0199',
    address: 'San Francisco, CA',
    description: 'Enterprise omni-channel retail storefront and order management solution.',
    progress: 74,
    kloc: 145,
    teamMembers: ['Arun Kumar', 'Priya Ramesh', 'Karthik Sundaram', 'Dinesh Venkatesh'],
  },
  {
    id: 2,
    projectId: 2,
    name: 'Banking Mobile Portal',
    projectName: 'Banking Mobile Portal',
    prefix: 'BMP',
    projectType: 'Mobile Application',
    status: 'ACTIVE',
    projectStatus: 'ACTIVE',
    startDate: '2025-03-01',
    endDate: '2026-09-30',
    manager: 'Arun Kumar',
    userId: 1,
    userFirstName: 'Arun',
    userLastName: 'Kumar',
    clientName: 'Apex Financial Services',
    country: 'Singapore',
    clientCountry: 'Singapore',
    state: 'Central',
    clientState: 'Central',
    email: 'tech@apexfin.sg',
    clientEmail: 'tech@apexfin.sg',
    phoneNo: '+65 6789 0123',
    clientPhone: '+65 6789 0123',
    address: 'Marina Bay Financial Centre, Singapore',
    description: 'High-security mobile banking and real-time transaction tracking application.',
    progress: 58,
    kloc: 98,
    teamMembers: ['Arun Kumar', 'Sneha Natarajan'],
  },
  {
    id: 3,
    projectId: 3,
    name: 'Healthcare Patient Care Portal',
    projectName: 'Healthcare Patient Care Portal',
    prefix: 'HPC',
    projectType: 'Healthcare SaaS',
    status: 'ACTIVE',
    projectStatus: 'ACTIVE',
    startDate: '2025-05-15',
    endDate: '2026-11-20',
    manager: 'Meera Krishnan',
    userId: 6,
    userFirstName: 'Meera',
    userLastName: 'Krishnan',
    clientName: 'MediLife Health Network',
    country: 'United Kingdom',
    clientCountry: 'United Kingdom',
    state: 'London',
    clientState: 'London',
    email: 'support@medilife.co.uk',
    clientEmail: 'support@medilife.co.uk',
    phoneNo: '+44 20 7946 0912',
    clientPhone: '+44 20 7946 0912',
    address: 'Harley Street, London, UK',
    description: 'HIPAA-compliant telemedicine and electronic patient record management system.',
    progress: 82,
    kloc: 180,
    teamMembers: ['Meera Krishnan', 'Priya Ramesh'],
  },
];

// Initial Releases
export const INITIAL_RELEASES: MockRelease[] = [
  {
    id: 1,
    releaseId: 1,
    name: 'Release 2.4.0 - Summer Major',
    releaseName: 'Release 2.4.0 - Summer Major',
    version: 'v2.4.0',
    releaseVersion: 'v2.4.0',
    description: 'Major release containing checkout redesign and multi-currency billing.',
    projectId: 1,
    projectName: 'E-Commerce Core Platform',
    status: 'In Progress',
    releaseStatus: 'In Progress',
    releaseTypeId: 1,
    releaseTypeName: 'Major Release',
    startDate: '2026-06-01',
    releaseDate: '2026-09-15',
    endDate: '2026-09-15',
    kloc: 45,
    totalTestCases: 38,
    passedTestCases: 28,
    failedTestCases: 6,
    blockedTestCases: 2,
    unexecutedTestCases: 2,
    features: ['One-step Checkout', 'Stripe & Apple Pay Integration', 'Inventory Alerts'],
    bugFixes: ['Cart timeout issue fix', 'Mobile responsive layout patch'],
    testCases: [1, 2, 3, 4, 5, 6],
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 2,
    releaseId: 2,
    name: 'Release 2.3.5 - Hotfix',
    releaseName: 'Release 2.3.5 - Hotfix',
    version: 'v2.3.5',
    releaseVersion: 'v2.3.5',
    description: 'Urgent patch for security vulnerability and database session concurrency.',
    projectId: 1,
    projectName: 'E-Commerce Core Platform',
    status: 'Completed',
    releaseStatus: 'Completed',
    releaseTypeId: 3,
    releaseTypeName: 'Patch / Hotfix',
    startDate: '2026-05-10',
    releaseDate: '2026-05-25',
    endDate: '2026-05-25',
    kloc: 12,
    totalTestCases: 15,
    passedTestCases: 15,
    failedTestCases: 0,
    blockedTestCases: 0,
    unexecutedTestCases: 0,
    features: ['Session Token Encryption'],
    bugFixes: ['Vulnerability CVE-2026 fix', 'PostgreSQL lock resolution'],
    testCases: [1, 2],
    createdAt: '2026-05-10T08:00:00.000Z',
  },
  {
    id: 3,
    releaseId: 3,
    name: 'Release 1.2.0 - Biometric Auth',
    releaseName: 'Release 1.2.0 - Biometric Auth',
    version: 'v1.2.0',
    releaseVersion: 'v1.2.0',
    description: 'FaceID and Fingerprint biometric authentication release.',
    projectId: 2,
    projectName: 'Banking Mobile Portal',
    status: 'In Progress',
    releaseStatus: 'In Progress',
    releaseTypeId: 2,
    releaseTypeName: 'Minor Enhancement',
    startDate: '2026-07-01',
    releaseDate: '2026-09-30',
    endDate: '2026-09-30',
    kloc: 30,
    totalTestCases: 22,
    passedTestCases: 14,
    failedTestCases: 4,
    blockedTestCases: 1,
    unexecutedTestCases: 3,
    features: ['Biometric Login', 'Device Binding Protocol'],
    bugFixes: ['Push notification delay fix'],
    testCases: [7, 8],
    createdAt: '2026-07-01T08:00:00.000Z',
  },
];

// Initial Modules & Submodules
export const INITIAL_MODULES: MockModule[] = [
  {
    id: 1,
    moduleId: 1,
    name: 'Authentication & User Management',
    moduleName: 'Authentication & User Management',
    projectId: 1,
    description: 'OAuth2, JWT authentication, user registration, and MFA',
    leaderId: 3,
    leaderName: 'Karthik Sundaram',
    allocatedLeader: {
      id: 1,
      employeeId: 3,
      employeeName: 'Karthik Sundaram',
      allocatedDate: '2025-01-20',
    },
    assignedDevs: ['Karthik Sundaram', 'Sneha Natarajan'],
    submodules: [
      {
        id: 1,
        subModuleId: 1,
        name: 'Login & Session Security',
        subModuleName: 'Login & Session Security',
        moduleId: 1,
        description: 'Multi-factor authentication and token refresh',
        assignedDevs: [
          { id: 1, employeeId: 3, employeeName: 'Karthik Sundaram', assignedDate: '2025-01-22' },
        ],
      },
      {
        id: 2,
        subModuleId: 2,
        name: 'User Profile & Preferences',
        subModuleName: 'User Profile & Preferences',
        moduleId: 1,
        description: 'Address book, profile photo, and notification settings',
        assignedDevs: [
          { id: 2, employeeId: 4, employeeName: 'Sneha Natarajan', assignedDate: '2025-01-25' },
        ],
      },
    ],
  },
  {
    id: 2,
    moduleId: 2,
    name: 'Cart & Checkout Engine',
    moduleName: 'Cart & Checkout Engine',
    projectId: 1,
    description: 'Shopping cart calculations, coupon codes, tax, and multi-gateway payments',
    leaderId: 3,
    leaderName: 'Karthik Sundaram',
    allocatedLeader: {
      id: 2,
      employeeId: 3,
      employeeName: 'Karthik Sundaram',
      allocatedDate: '2025-02-01',
    },
    assignedDevs: ['Karthik Sundaram', 'Vikram Balaji'],
    submodules: [
      {
        id: 3,
        subModuleId: 3,
        name: 'Payment Gateway Integration',
        subModuleName: 'Payment Gateway Integration',
        moduleId: 2,
        description: 'Stripe, PayPal, and credit card processing',
        assignedDevs: [
          { id: 3, employeeId: 3, employeeName: 'Karthik Sundaram', assignedDate: '2025-02-10' },
          { id: 4, employeeId: 7, employeeName: 'Vikram Balaji', assignedDate: '2025-02-10' },
        ],
      },
      {
        id: 4,
        subModuleId: 4,
        name: 'Order Summary & Discounts',
        subModuleName: 'Order Summary & Discounts',
        moduleId: 2,
        description: 'Promo codes, tax calculations, and shipping rates',
        assignedDevs: [
          { id: 5, employeeId: 7, employeeName: 'Vikram Balaji', assignedDate: '2025-02-12' },
        ],
      },
    ],
  },
  {
    id: 3,
    moduleId: 3,
    name: 'Product Catalog & Search',
    moduleName: 'Product Catalog & Search',
    projectId: 1,
    description: 'ElasticSearch indexing, product filters, categories, and inventory sync',
    leaderId: 3,
    leaderName: 'Karthik Sundaram',
    allocatedLeader: {
      id: 3,
      employeeId: 3,
      employeeName: 'Karthik Sundaram',
      allocatedDate: '2025-03-01',
    },
    assignedDevs: ['Karthik Sundaram'],
    submodules: [
      {
        id: 5,
        subModuleId: 5,
        name: 'Faceted Search & Filters',
        subModuleName: 'Faceted Search & Filters',
        moduleId: 3,
        description: 'Price range, brand, rating, and stock filters',
        assignedDevs: [
          { id: 6, employeeId: 3, employeeName: 'Karthik Sundaram', assignedDate: '2025-03-05' },
        ],
      },
    ],
  },
  {
    id: 4,
    moduleId: 4,
    name: 'Biometric Security & MFA',
    moduleName: 'Biometric Security & MFA',
    projectId: 2,
    description: 'Native biometric prompts, RSA key store, and device authorization',
    leaderId: 4,
    leaderName: 'Sneha Natarajan',
    allocatedLeader: {
      id: 4,
      employeeId: 4,
      employeeName: 'Sneha Natarajan',
      allocatedDate: '2025-04-01',
    },
    assignedDevs: ['Sneha Natarajan'],
    submodules: [
      {
        id: 6,
        subModuleId: 6,
        name: 'FaceID & Biometrics',
        subModuleName: 'FaceID & Biometrics',
        moduleId: 4,
        description: 'iOS FaceID and Android BiometricPrompt APIs',
        assignedDevs: [
          { id: 7, employeeId: 4, employeeName: 'Sneha Natarajan', assignedDate: '2025-04-10' },
        ],
      },
    ],
  },
];

// Initial Test Cases
export const INITIAL_TEST_CASES: MockTestCase[] = [
  {
    id: 1,
    testcaseNo: 'TC-ECC-001',
    no: 'TC-ECC-001',
    description: 'Verify login with valid user credentials and MFA verification',
    detailsSteps: '1. Navigate to /login\n2. Enter valid email and password\n3. Click Login\n4. Enter 6-digit OTP\n5. Verify dashboard redirection',
    steps: '1. Navigate to /login\n2. Enter valid email and password\n3. Click Login\n4. Enter 6-digit OTP\n5. Verify dashboard redirection',
    expectedResult: 'User should successfully authenticate and redirect to dashboard with active JWT token',
    subModuleId: 1,
    subModuleName: 'Login & Session Security',
    moduleId: 1,
    moduleName: 'Authentication & User Management',
    projectId: 1,
    severityId: 3,
    severityName: 'High',
    severity: 'High',
    defectTypeId: 2,
    defectTypeName: 'Functional Bug',
    type: 'Functional Bug',
    executionStatus: 'PASS',
    assignedQaId: 2,
    assignedQaName: 'Priya Ramesh',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-06-15T14:30:00.000Z',
    createdBy: 'Priya Ramesh',
    updatedBy: 'Priya Ramesh',
  },
  {
    id: 2,
    testcaseNo: 'TC-ECC-002',
    no: 'TC-ECC-002',
    description: 'Verify password reset link expiration after 15 minutes',
    detailsSteps: '1. Request password reset email\n2. Wait 16 minutes\n3. Click reset token link\n4. Attempt new password submission',
    steps: '1. Request password reset email\n2. Wait 16 minutes\n3. Click reset token link\n4. Attempt new password submission',
    expectedResult: 'System displays "Reset token has expired" error and prevents password change',
    subModuleId: 1,
    subModuleName: 'Login & Session Security',
    moduleId: 1,
    moduleName: 'Authentication & User Management',
    projectId: 1,
    severityId: 3,
    severityName: 'High',
    severity: 'High',
    defectTypeId: 4,
    defectTypeName: 'Security Vulnerability',
    type: 'Security Vulnerability',
    executionStatus: 'PASS',
    assignedQaId: 2,
    assignedQaName: 'Priya Ramesh',
    createdAt: '2026-01-12T11:00:00.000Z',
    updatedAt: '2026-06-15T15:00:00.000Z',
    createdBy: 'Priya Ramesh',
    updatedBy: 'Priya Ramesh',
  },
  {
    id: 3,
    testcaseNo: 'TC-ECC-003',
    no: 'TC-ECC-003',
    description: 'Verify checkout processing with valid 3D Secure Credit Card',
    detailsSteps: '1. Add items to cart\n2. Proceed to checkout\n3. Enter valid credit card with 3DS\n4. Complete SMS OTP challenge\n5. Verify order confirmation',
    steps: '1. Add items to cart\n2. Proceed to checkout\n3. Enter valid credit card with 3DS\n4. Complete SMS OTP challenge\n5. Verify order confirmation',
    expectedResult: 'Payment succeeds, inventory is decremented, invoice email is dispatched',
    subModuleId: 3,
    subModuleName: 'Payment Gateway Integration',
    moduleId: 2,
    moduleName: 'Cart & Checkout Engine',
    projectId: 1,
    severityId: 4,
    severityName: 'Critical',
    severity: 'Critical',
    defectTypeId: 2,
    defectTypeName: 'Functional Bug',
    type: 'Functional Bug',
    executionStatus: 'FAIL',
    assignedQaId: 5,
    assignedQaName: 'Dinesh Venkatesh',
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-07-01T12:00:00.000Z',
    createdBy: 'Dinesh Venkatesh',
    updatedBy: 'Dinesh Venkatesh',
  },
  {
    id: 4,
    testcaseNo: 'TC-ECC-004',
    no: 'TC-ECC-004',
    description: 'Verify discount voucher code applied across multiple cart items',
    detailsSteps: '1. Add 3 items\n2. Apply promo code "SUMMER20"\n3. Check line item discounts and final total calculation',
    steps: '1. Add 3 items\n2. Apply promo code "SUMMER20"\n3. Check line item discounts and final total calculation',
    expectedResult: '20% discount correctly deducted from eligible items before tax computation',
    subModuleId: 4,
    subModuleName: 'Order Summary & Discounts',
    moduleId: 2,
    moduleName: 'Cart & Checkout Engine',
    projectId: 1,
    severityId: 2,
    severityName: 'Medium',
    severity: 'Medium',
    defectTypeId: 2,
    defectTypeName: 'Functional Bug',
    type: 'Functional Bug',
    executionStatus: 'PASS',
    assignedQaId: 5,
    assignedQaName: 'Dinesh Venkatesh',
    createdAt: '2026-02-18T14:00:00.000Z',
    updatedAt: '2026-07-02T16:00:00.000Z',
    createdBy: 'Dinesh Venkatesh',
    updatedBy: 'Dinesh Venkatesh',
  },
  {
    id: 5,
    testcaseNo: 'TC-ECC-005',
    no: 'TC-ECC-005',
    description: 'Verify search autocomplete responsiveness under high query load',
    detailsSteps: '1. Type search query in navigation bar\n2. Test with rapid keystrokes\n3. Measure API response debounce timing',
    steps: '1. Type search query in navigation bar\n2. Test with rapid keystrokes\n3. Measure API response debounce timing',
    expectedResult: 'Suggestions appear within 200ms without sending duplicate API requests',
    subModuleId: 5,
    subModuleName: 'Faceted Search & Filters',
    moduleId: 3,
    moduleName: 'Product Catalog & Search',
    projectId: 1,
    severityId: 2,
    severityName: 'Medium',
    severity: 'Medium',
    defectTypeId: 3,
    defectTypeName: 'Performance / Latency',
    type: 'Performance / Latency',
    executionStatus: 'PASS',
    assignedQaId: 5,
    assignedQaName: 'Dinesh Venkatesh',
    createdAt: '2026-03-10T15:30:00.000Z',
    updatedAt: '2026-07-05T11:20:00.000Z',
    createdBy: 'Dinesh Venkatesh',
    updatedBy: 'Dinesh Venkatesh',
  },
  {
    id: 6,
    testcaseNo: 'TC-ECC-006',
    no: 'TC-ECC-006',
    description: 'Verify checkout fails cleanly when cart item goes out of stock',
    detailsSteps: '1. Add last remaining unit to cart\n2. Purchase unit in another parallel session\n3. Submit checkout form',
    steps: '1. Add last remaining unit to cart\n2. Purchase unit in another parallel session\n3. Submit checkout form',
    expectedResult: 'System displays "Item is no longer in stock" notification and does not charge credit card',
    subModuleId: 3,
    subModuleName: 'Payment Gateway Integration',
    moduleId: 2,
    moduleName: 'Cart & Checkout Engine',
    projectId: 1,
    severityId: 3,
    severityName: 'High',
    severity: 'High',
    defectTypeId: 2,
    defectTypeName: 'Functional Bug',
    type: 'Functional Bug',
    executionStatus: 'BLOCKED',
    assignedQaId: 2,
    assignedQaName: 'Priya Ramesh',
    createdAt: '2026-03-12T16:00:00.000Z',
    updatedAt: '2026-07-10T09:45:00.000Z',
    createdBy: 'Priya Ramesh',
    updatedBy: 'Priya Ramesh',
  },
  {
    id: 7,
    testcaseNo: 'TC-BMP-001',
    no: 'TC-BMP-001',
    description: 'Verify FaceID authentication prompt opens upon app launch',
    detailsSteps: '1. Enable FaceID in settings\n2. Relaunch mobile app\n3. Scan Face',
    steps: '1. Enable FaceID in settings\n2. Relaunch mobile app\n3. Scan Face',
    expectedResult: 'Biometric prompt unlocks app securely without asking for PIN',
    subModuleId: 6,
    subModuleName: 'FaceID & Biometrics',
    moduleId: 4,
    moduleName: 'Biometric Security & MFA',
    projectId: 2,
    severityId: 4,
    severityName: 'Critical',
    severity: 'Critical',
    defectTypeId: 2,
    defectTypeName: 'Functional Bug',
    type: 'Functional Bug',
    executionStatus: 'PASS',
    assignedQaId: 2,
    assignedQaName: 'Priya Ramesh',
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-07-15T14:00:00.000Z',
    createdBy: 'Priya Ramesh',
    updatedBy: 'Priya Ramesh',
  },
];

// Initial Defects
export const INITIAL_DEFECTS: MockDefect[] = [
  {
    id: 1,
    defectId: 'DEF-ECC-001',
    title: 'Stripe 3DS modal freezes when user clicks back button',
    description: 'When checking out with a 3D Secure credit card, clicking the browser back button on the iframe causes the checkout page to freeze indefinitely without updating the order state.',
    priority: 'high',
    priorityId: 3,
    priorityName: 'High',
    severity: 'critical',
    severityId: 4,
    severityName: 'Critical',
    status: 'open',
    statusId: 2,
    statusName: 'Open',
    defectStatusId: 2,
    defectStatusName: 'Open',
    projectId: 1,
    projectName: 'E-Commerce Core Platform',
    releaseId: 1,
    releaseName: 'Release 2.4.0 - Summer Major',
    moduleId: 2,
    moduleName: 'Cart & Checkout Engine',
    subModuleId: 3,
    subModuleName: 'Payment Gateway Integration',
    testCaseId: 3,
    steps: '1. Add items to cart\n2. Enter 3DS test card\n3. In the 3DS verification modal, click browser back button\n4. Observe infinite loading spinner',
    stepsToReproduce: [
      'Add items to cart',
      'Enter 3DS test card',
      'In the 3DS verification modal, click browser back button',
      'Observe infinite loading spinner',
    ],
    reOpenCount: 0,
    reopenCount: 0,
    attachment: null,
    attachments: [],
    reportedBy: 'Dinesh Venkatesh',
    assignedTo: 'Karthik Sundaram',
    assignedToId: 3,
    assignedToName: 'Karthik Sundaram',
    assignedById: 2,
    assignedByName: 'Priya Ramesh',
    createdAt: '2026-07-01T14:20:00.000Z',
    updatedAt: '2026-07-02T09:15:00.000Z',
    defectHistory: [
      { id: 1, status: 'new', changedAt: '2026-07-01T14:20:00.000Z', comment: 'Defect logged during Sprint 14 QA execution', changedBy: 'Dinesh Venkatesh' },
      { id: 2, status: 'open', changedAt: '2026-07-02T09:15:00.000Z', comment: 'Assigned to Karthik for investigation', changedBy: 'Priya Ramesh' },
    ],
    comments: [
      {
        id: 1,
        defectId: 1,
        userId: 2,
        userName: 'Priya Ramesh',
        comment: 'High priority because customers might double pay if page hangs.',
        createdAt: '2026-07-02T09:20:00.000Z',
      },
      {
        id: 2,
        defectId: 1,
        userId: 3,
        userName: 'Karthik Sundaram',
        comment: 'Reproduced on Chrome 124. Working on handling the iframe unload event.',
        createdAt: '2026-07-02T11:00:00.000Z',
      },
    ],
  },
  {
    id: 2,
    defectId: 'DEF-ECC-002',
    title: 'Discount code error message overlaps mobile checkout button',
    description: 'On mobile screens (< 380px), entering an invalid coupon code renders the error alert box on top of the "Place Order" submit button.',
    priority: 'medium',
    priorityId: 2,
    priorityName: 'Medium',
    severity: 'medium',
    severityId: 2,
    severityName: 'Medium',
    status: 'in-progress',
    statusId: 3,
    statusName: 'In Progress',
    defectStatusId: 3,
    defectStatusName: 'In Progress',
    projectId: 1,
    projectName: 'E-Commerce Core Platform',
    releaseId: 1,
    releaseName: 'Release 2.4.0 - Summer Major',
    moduleId: 2,
    moduleName: 'Cart & Checkout Engine',
    subModuleId: 4,
    subModuleName: 'Order Summary & Discounts',
    testCaseId: 4,
    steps: '1. Open mobile browser with width 360px\n2. Add item to cart\n3. Type "INVALID123" in coupon box and tap apply\n4. Verify layout overlap',
    stepsToReproduce: [
      'Open mobile browser with width 360px',
      'Add item to cart',
      'Type "INVALID123" in coupon box and tap apply',
      'Verify layout overlap',
    ],
    reOpenCount: 0,
    reopenCount: 0,
    attachment: null,
    attachments: [],
    reportedBy: 'Dinesh Venkatesh',
    assignedTo: 'Vikram Balaji',
    assignedToId: 7,
    assignedToName: 'Vikram Balaji',
    assignedById: 2,
    assignedByName: 'Priya Ramesh',
    createdAt: '2026-07-03T11:00:00.000Z',
    updatedAt: '2026-07-04T15:30:00.000Z',
    defectHistory: [
      { id: 3, status: 'new', changedAt: '2026-07-03T11:00:00.000Z', comment: 'Defect logged during mobile UI review', changedBy: 'Dinesh Venkatesh' },
      { id: 4, status: 'in-progress', changedAt: '2026-07-04T15:30:00.000Z', comment: 'Fixing CSS flexbox layout', changedBy: 'Vikram Balaji' },
    ],
    comments: [
      {
        id: 3,
        defectId: 2,
        userId: 7,
        userName: 'Vikram Balaji',
        comment: 'Adjusted z-index and added bottom margin on mobile viewports.',
        createdAt: '2026-07-04T16:00:00.000Z',
      },
    ],
  },
  {
    id: 3,
    defectId: 'DEF-ECC-003',
    title: 'Concurrent purchase causes negative stock in database',
    description: 'When two users simultaneously buy the last unit of an SKU, race condition bypasses stock check and results in inventory quantity = -1.',
    priority: 'critical',
    priorityId: 4,
    priorityName: 'Immediate',
    severity: 'critical',
    severityId: 4,
    severityName: 'Critical',
    status: 'resolved',
    statusId: 4,
    statusName: 'Resolved',
    defectStatusId: 4,
    defectStatusName: 'Resolved',
    projectId: 1,
    projectName: 'E-Commerce Core Platform',
    releaseId: 1,
    releaseName: 'Release 2.4.0 - Summer Major',
    moduleId: 2,
    moduleName: 'Cart & Checkout Engine',
    subModuleId: 3,
    subModuleName: 'Payment Gateway Integration',
    testCaseId: 6,
    steps: '1. Set stock of product P to 1\n2. Trigger concurrent checkout requests for P\n3. Inspect inventory DB table',
    stepsToReproduce: [
      'Set stock of product P to 1',
      'Trigger concurrent checkout requests for P',
      'Inspect inventory DB table',
    ],
    reOpenCount: 1,
    reopenCount: 1,
    attachment: null,
    attachments: [],
    reportedBy: 'Priya Ramesh',
    assignedTo: 'Karthik Sundaram',
    assignedToId: 3,
    assignedToName: 'Karthik Sundaram',
    assignedById: 1,
    assignedByName: 'Arun Kumar',
    createdAt: '2026-07-05T09:30:00.000Z',
    updatedAt: '2026-07-12T17:00:00.000Z',
    defectHistory: [
      { id: 5, status: 'new', changedAt: '2026-07-05T09:30:00.000Z', comment: 'Logged from load test suite', changedBy: 'Priya Ramesh' },
      { id: 6, status: 'in-progress', changedAt: '2026-07-06T10:00:00.000Z', comment: 'Implementing optimistic locking', changedBy: 'Karthik Sundaram' },
      { id: 7, status: 'resolved', changedAt: '2026-07-08T14:00:00.000Z', comment: 'Added SELECT FOR UPDATE in transaction', changedBy: 'Karthik Sundaram' },
      { id: 8, status: 'reopened', changedAt: '2026-07-10T11:00:00.000Z', comment: 'Failed under 50 concurrent threads', changedBy: 'Priya Ramesh' },
      { id: 9, status: 'resolved', changedAt: '2026-07-12T17:00:00.000Z', comment: 'Added Redis distributed lock. Verified with 100 threads.', changedBy: 'Karthik Sundaram' },
    ],
    comments: [
      {
        id: 4,
        defectId: 3,
        userId: 3,
        userName: 'Karthik Sundaram',
        comment: 'Redis distributed lock integrated around inventory decrement routine.',
        createdAt: '2026-07-12T17:05:00.000Z',
      },
    ],
  },
  {
    id: 4,
    defectId: 'DEF-BMP-001',
    title: 'Biometric prompt fails after user updates OS level fingerprint',
    description: 'When user registers a new finger in Android Settings, the key is invalidated but the app crashes instead of offering PIN fallback.',
    priority: 'high',
    priorityId: 3,
    priorityName: 'High',
    severity: 'high',
    severityId: 3,
    severityName: 'High',
    status: 'new',
    statusId: 1,
    statusName: 'New',
    defectStatusId: 1,
    defectStatusName: 'New',
    projectId: 2,
    projectName: 'Banking Mobile Portal',
    releaseId: 3,
    releaseName: 'Release 1.2.0 - Biometric Auth',
    moduleId: 4,
    moduleName: 'Biometric Security & MFA',
    subModuleId: 6,
    subModuleName: 'FaceID & Biometrics',
    testCaseId: 7,
    steps: '1. Register fingerprint A\n2. Add fingerprint B in system settings\n3. Open app\n4. Observe unhandled KeyPermanentlyInvalidatedException crash',
    stepsToReproduce: [
      'Register fingerprint A',
      'Add fingerprint B in system settings',
      'Open app',
      'Observe unhandled KeyPermanentlyInvalidatedException crash',
    ],
    reOpenCount: 0,
    reopenCount: 0,
    attachment: null,
    attachments: [],
    reportedBy: 'Priya Ramesh',
    assignedTo: 'Sneha Natarajan',
    assignedToId: 4,
    assignedToName: 'Sneha Natarajan',
    assignedById: 2,
    assignedByName: 'Priya Ramesh',
    createdAt: '2026-07-18T10:00:00.000Z',
    updatedAt: '2026-07-18T10:00:00.000Z',
    defectHistory: [
      { id: 10, status: 'new', changedAt: '2026-07-18T10:00:00.000Z', comment: 'Defect logged during biometric regression testing', changedBy: 'Priya Ramesh' },
    ],
    comments: [],
  },
];

// Initial Bench Allocations
export const INITIAL_BENCH_RESOURCES = [
  {
    id: 1,
    employeeId: 7,
    userId: 'EMP-107',
    firstName: 'Vikram',
    lastName: 'Balaji',
    designation: 'Software Engineer',
    skills: ['Vue.js', 'TailwindCSS', 'TypeScript', 'Node.js'],
    experience: 2,
    benchStartDate: '2026-06-01',
    benchEndDate: '2026-09-30',
    availability: 100,
    status: 'Available',
    allocationPercentage: 0,
  },
  {
    id: 2,
    employeeId: 5,
    userId: 'EMP-105',
    firstName: 'Dinesh',
    lastName: 'Venkatesh',
    designation: 'QA Test Engineer',
    skills: ['Manual Testing', 'API Testing', 'Postman'],
    experience: 2,
    benchStartDate: '2026-07-01',
    benchEndDate: '2026-10-31',
    availability: 40,
    status: 'Partially Allocated',
    allocationPercentage: 60,
  },
];

// Initial Email Configurations
export const INITIAL_EMAIL_CONFIGS = [
  {
    id: 1,
    name: 'Production SMTP (SendGrid)',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    username: 'apikey',
    password: '••••••••••••••••',
    fromEmail: 'notifications@defecttracker.com',
    fromName: 'Defect Tracker Pro System',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Staging SMTP (Mailtrap)',
    smtpHost: 'sandbox.smtp.mailtrap.io',
    smtpPort: 2525,
    username: 'test_user_mailtrap',
    password: '••••••••••••••••',
    fromEmail: 'staging-alerts@defecttracker.com',
    fromName: 'Staging QA Alerts',
    isActive: false,
    isDefault: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// Initial Email Point Setup & Templates
export const INITIAL_EMAIL_POINT_SETUPS = [
  { id: 1, name: 'Defect Created', eventName: 'DEFECT_CREATED', isEnabled: true, description: 'Triggers when a new defect is reported' },
  { id: 2, name: 'Defect Status Changed', eventName: 'DEFECT_STATUS_CHANGED', isEnabled: true, description: 'Triggers when defect transitions to open/in-progress/resolved/closed' },
  { id: 3, name: 'Defect Reopened', eventName: 'DEFECT_REOPENED', isEnabled: true, description: 'Triggers when QA reopens a failed verification defect' },
  { id: 4, name: 'Release Created', eventName: 'RELEASE_CREATED', isEnabled: true, description: 'Triggers when a new release milestone is planned' },
  { id: 5, name: 'Developer Allocated', eventName: 'DEVELOPER_ALLOCATED', isEnabled: true, description: 'Triggers when developer is assigned to project or submodule' },
];

export const INITIAL_EMAIL_TEMPLATES = [
  {
    id: 1,
    name: 'Defect Notification Template',
    subject: '[{{PROJECT_NAME}}] New Defect #{{DEFECT_ID}}: {{DEFECT_TITLE}}',
    body: '<p>Hello <b>{{ASSIGNEE_NAME}}</b>,</p><p>A defect has been assigned to you in project <b>{{PROJECT_NAME}}</b>.</p><p><b>Severity:</b> {{SEVERITY}}<br/><b>Priority:</b> {{PRIORITY}}</p><p><a href="{{DEFECT_URL}}">Click here to view defect details</a></p>',
    templateKey: 'DEFECT_NOTIFICATION',
  },
];

// State Store Class for managing Mock Data statefully in memory / localStorage
class MockDbStore {
  private users: MockUser[] = [...INITIAL_USERS];
  private projects: MockProject[] = [...INITIAL_PROJECTS];
  private releases: MockRelease[] = [...INITIAL_RELEASES];
  private modules: MockModule[] = [...INITIAL_MODULES];
  private testCases: MockTestCase[] = [...INITIAL_TEST_CASES];
  private defects: MockDefect[] = [...INITIAL_DEFECTS];
  private designations = [...INITIAL_DESIGNATIONS];
  private roles = [...INITIAL_ROLES];
  private permissions = [...INITIAL_PERMISSIONS];
  private severities = [...INITIAL_SEVERITIES];
  private priorities = [...INITIAL_PRIORITIES];
  private defectTypes = [...INITIAL_DEFECT_TYPES];
  private releaseTypes = [...INITIAL_RELEASE_TYPES];
  private statusTypes = [...INITIAL_STATUS_TYPES];
  private benchResources = [...INITIAL_BENCH_RESOURCES];
  private emailConfigs = [...INITIAL_EMAIL_CONFIGS];
  private emailPointSetups = [...INITIAL_EMAIL_POINT_SETUPS];
  private emailTemplates = [...INITIAL_EMAIL_TEMPLATES];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedProjects = localStorage.getItem('mock_projects');
      if (savedProjects) this.projects = JSON.parse(savedProjects);

      const savedDefects = localStorage.getItem('mock_defects');
      if (savedDefects) this.defects = JSON.parse(savedDefects);

      const savedTestCases = localStorage.getItem('mock_testcases');
      if (savedTestCases) this.testCases = JSON.parse(savedTestCases);

      const savedModules = localStorage.getItem('mock_modules');
      if (savedModules) this.modules = JSON.parse(savedModules);

      const savedReleases = localStorage.getItem('mock_releases');
      if (savedReleases) this.releases = JSON.parse(savedReleases);

      const savedUsers = localStorage.getItem('mock_users');
      if (savedUsers) this.users = JSON.parse(savedUsers);
    } catch {
      // Fallback to in-memory initial data
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('mock_projects', JSON.stringify(this.projects));
      localStorage.setItem('mock_defects', JSON.stringify(this.defects));
      localStorage.setItem('mock_testcases', JSON.stringify(this.testCases));
      localStorage.setItem('mock_modules', JSON.stringify(this.modules));
      localStorage.setItem('mock_releases', JSON.stringify(this.releases));
      localStorage.setItem('mock_users', JSON.stringify(this.users));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  // --- Users & Employees ---
  getUsers() { return [...this.users]; }
  getUserById(id: number) { return this.users.find(u => u.id === Number(id)); }
  createUser(userData: Partial<MockUser>) {
    const newUser: MockUser = {
      id: Date.now(),
      userId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      userGender: userData.userGender || 'Male',
      userStatus: userData.userStatus || 'ACTIVE',
      designationId: userData.designationId || 3,
      designationName: userData.designationName || 'Software Engineer',
      roleId: userData.roleId || 4,
      roleName: userData.roleName || 'Developer',
      roles: userData.roles || ['Developer'],
      userType: userData.userType || 'Employee',
      availabilityPercent: userData.availabilityPercent ?? 100,
      skills: userData.skills || [],
      currentProjects: userData.currentProjects || [],
      joinedDate: userData.joinedDate || new Date().toISOString().split('T')[0],
      experience: userData.experience || 1,
      department: userData.department || 'Engineering',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData,
    };
    this.users.unshift(newUser);
    this.saveToStorage();
    return newUser;
  }
  updateUser(id: number, updates: Partial<MockUser>) {
    const idx = this.users.findIndex(u => u.id === Number(id));
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage();
      return this.users[idx];
    }
    return null;
  }
  deleteUser(id: number) {
    this.users = this.users.filter(u => u.id !== Number(id));
    this.saveToStorage();
    return true;
  }

  // --- Projects ---
  getProjects() { return [...this.projects]; }
  getProjectById(id: number | string) {
    return this.projects.find(p => String(p.id) === String(id) || String(p.projectId) === String(id));
  }
  createProject(projectData: Partial<MockProject>) {
    const newId = Date.now();
    const newProject: MockProject = {
      id: newId,
      projectId: newId,
      name: projectData.name || projectData.projectName || 'New Project',
      projectName: projectData.name || projectData.projectName || 'New Project',
      prefix: projectData.prefix || 'PRJ',
      projectType: projectData.projectType || 'Web Application',
      status: projectData.status || 'ACTIVE',
      projectStatus: projectData.projectStatus || 'ACTIVE',
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      endDate: projectData.endDate || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
      manager: projectData.manager || 'Arun Kumar',
      userId: projectData.userId || 1,
      userFirstName: projectData.userFirstName || 'Arun',
      userLastName: projectData.userLastName || 'Kumar',
      clientName: projectData.clientName || 'Client Inc.',
      country: projectData.country || projectData.clientCountry || 'United States',
      clientCountry: projectData.clientCountry || projectData.country || 'United States',
      state: projectData.state || projectData.clientState || 'California',
      clientState: projectData.clientState || projectData.state || 'California',
      email: projectData.email || projectData.clientEmail || 'client@example.com',
      clientEmail: projectData.clientEmail || projectData.email || 'client@example.com',
      phoneNo: projectData.phoneNo || projectData.clientPhone || '+1 555 0199',
      clientPhone: projectData.clientPhone || projectData.phoneNo || '+1 555 0199',
      address: projectData.address || 'Headquarters',
      description: projectData.description || 'Project Description',
      progress: projectData.progress ?? 0,
      kloc: projectData.kloc ?? 10,
      teamMembers: projectData.teamMembers || ['Arun Kumar'],
      ...projectData,
    };
    this.projects.unshift(newProject);
    this.saveToStorage();
    return newProject;
  }
  updateProject(id: number | string, updates: Partial<MockProject>) {
    const idx = this.projects.findIndex(p => String(p.id) === String(id) || String(p.projectId) === String(id));
    if (idx !== -1) {
      this.projects[idx] = { ...this.projects[idx], ...updates };
      this.saveToStorage();
      return this.projects[idx];
    }
    return null;
  }
  deleteProject(id: number | string) {
    this.projects = this.projects.filter(p => String(p.id) !== String(id) && String(p.projectId) !== String(id));
    this.saveToStorage();
    return true;
  }

  // --- Releases ---
  getReleases(projectId?: number) {
    if (projectId) return this.releases.filter(r => Number(r.projectId) === Number(projectId));
    return [...this.releases];
  }
  getReleaseById(id: number | string) {
    return this.releases.find(r => String(r.id) === String(id) || String(r.releaseId) === String(id));
  }
  createRelease(releaseData: Partial<MockRelease>) {
    const newId = Date.now();
    const newRelease: MockRelease = {
      id: newId,
      releaseId: newId,
      name: releaseData.name || releaseData.releaseName || 'New Release',
      releaseName: releaseData.name || releaseData.releaseName || 'New Release',
      version: releaseData.version || releaseData.releaseVersion || 'v1.0.0',
      releaseVersion: releaseData.version || releaseData.releaseVersion || 'v1.0.0',
      description: releaseData.description || 'Release Description',
      projectId: Number(releaseData.projectId) || 1,
      projectName: releaseData.projectName || 'Project',
      status: releaseData.status || 'In Progress',
      releaseStatus: releaseData.releaseStatus || releaseData.status || 'In Progress',
      releaseTypeId: releaseData.releaseTypeId || 1,
      releaseTypeName: releaseData.releaseTypeName || 'Major Release',
      startDate: releaseData.startDate || new Date().toISOString().split('T')[0],
      releaseDate: releaseData.releaseDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      endDate: releaseData.endDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      kloc: releaseData.kloc ?? 20,
      totalTestCases: 0,
      passedTestCases: 0,
      failedTestCases: 0,
      blockedTestCases: 0,
      unexecutedTestCases: 0,
      features: releaseData.features || [],
      bugFixes: releaseData.bugFixes || [],
      testCases: [],
      createdAt: new Date().toISOString(),
      ...releaseData,
    };
    this.releases.unshift(newRelease);
    this.saveToStorage();
    return newRelease;
  }
  updateRelease(id: number | string, updates: Partial<MockRelease>) {
    const idx = this.releases.findIndex(r => String(r.id) === String(id) || String(r.releaseId) === String(id));
    if (idx !== -1) {
      this.releases[idx] = { ...this.releases[idx], ...updates };
      this.saveToStorage();
      return this.releases[idx];
    }
    return null;
  }
  deleteRelease(id: number | string) {
    this.releases = this.releases.filter(r => String(r.id) !== String(id) && String(r.releaseId) !== String(id));
    this.saveToStorage();
    return true;
  }

  // --- Modules & Submodules ---
  getModules(projectId?: number) {
    if (projectId) return this.modules.filter(m => Number(m.projectId) === Number(projectId));
    return [...this.modules];
  }
  getModuleById(id: number) { return this.modules.find(m => m.id === Number(id)); }
  createModule(moduleData: Partial<MockModule>) {
    const newId = Date.now();
    const newModule: MockModule = {
      id: newId,
      moduleId: newId,
      name: moduleData.name || moduleData.moduleName || 'New Module',
      moduleName: moduleData.name || moduleData.moduleName || 'New Module',
      projectId: Number(moduleData.projectId) || 1,
      description: moduleData.description || '',
      leaderId: moduleData.leaderId || null,
      leaderName: moduleData.leaderName || null,
      allocatedLeader: moduleData.leaderId ? {
        id: Date.now(),
        employeeId: moduleData.leaderId,
        employeeName: moduleData.leaderName || 'Leader',
        allocatedDate: new Date().toISOString().split('T')[0],
      } : null,
      assignedDevs: moduleData.assignedDevs || [],
      submodules: [],
      ...moduleData,
    };
    this.modules.push(newModule);
    this.saveToStorage();
    return newModule;
  }
  updateModule(id: number, updates: Partial<MockModule>) {
    const idx = this.modules.findIndex(m => m.id === Number(id));
    if (idx !== -1) {
      this.modules[idx] = { ...this.modules[idx], ...updates };
      this.saveToStorage();
      return this.modules[idx];
    }
    return null;
  }
  deleteModule(id: number) {
    this.modules = this.modules.filter(m => m.id !== Number(id));
    this.saveToStorage();
    return true;
  }

  // Submodules
  getSubmodulesByModule(moduleId: number) {
    const mod = this.getModuleById(moduleId);
    return mod?.submodules || [];
  }
  createSubmodule(moduleId: number, subData: any) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      const newSubId = Date.now();
      const newSub: MockSubmodule = {
        id: newSubId,
        subModuleId: newSubId,
        name: subData.name || subData.subModuleName || 'New Submodule',
        subModuleName: subData.name || subData.subModuleName || 'New Submodule',
        moduleId: Number(moduleId),
        description: subData.description || '',
        assignedDevs: [],
      };
      if (!mod.submodules) mod.submodules = [];
      mod.submodules.push(newSub);
      this.saveToStorage();
      return newSub;
    }
    return null;
  }
  updateSubmodule(moduleId: number, subModuleId: number, updates: any) {
    const mod = this.getModuleById(moduleId);
    if (mod && mod.submodules) {
      const idx = mod.submodules.findIndex(s => s.id === Number(subModuleId));
      if (idx !== -1) {
        mod.submodules[idx] = { ...mod.submodules[idx], ...updates };
        this.saveToStorage();
        return mod.submodules[idx];
      }
    }
    return null;
  }
  deleteSubmodule(moduleId: number, subModuleId: number) {
    const mod = this.getModuleById(moduleId);
    if (mod && mod.submodules) {
      mod.submodules = mod.submodules.filter(s => s.id !== Number(subModuleId));
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // --- Test Cases ---
  getTestCases(subModuleId?: number) {
    if (subModuleId) return this.testCases.filter(t => Number(t.subModuleId) === Number(subModuleId));
    return [...this.testCases];
  }
  getTestCaseById(id: number) { return this.testCases.find(t => t.id === Number(id)); }
  createTestCase(testCaseData: Partial<MockTestCase>) {
    const newId = Date.now();
    const newTestCase: MockTestCase = {
      id: newId,
      testcaseNo: testCaseData.testcaseNo || `TC-${Math.floor(100 + Math.random() * 900)}`,
      no: testCaseData.testcaseNo || `TC-${Math.floor(100 + Math.random() * 900)}`,
      description: testCaseData.description || '',
      detailsSteps: testCaseData.detailsSteps || testCaseData.steps || '',
      steps: testCaseData.steps || testCaseData.detailsSteps || '',
      expectedResult: testCaseData.expectedResult || '',
      subModuleId: Number(testCaseData.subModuleId) || 1,
      subModuleName: testCaseData.subModuleName || 'Submodule',
      moduleId: Number(testCaseData.moduleId) || 1,
      moduleName: testCaseData.moduleName || 'Module',
      projectId: Number(testCaseData.projectId) || 1,
      severityId: Number(testCaseData.severityId) || 2,
      severityName: testCaseData.severityName || 'Medium',
      severity: testCaseData.severity || testCaseData.severityName || 'Medium',
      defectTypeId: Number(testCaseData.defectTypeId) || 2,
      defectTypeName: testCaseData.defectTypeName || 'Functional Bug',
      type: testCaseData.type || testCaseData.defectTypeName || 'Functional Bug',
      executionStatus: testCaseData.executionStatus || 'NOT_RUN',
      assignedQaId: testCaseData.assignedQaId || 2,
      assignedQaName: testCaseData.assignedQaName || 'Priya Ramesh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: testCaseData.createdBy || 'QA Tester',
      updatedBy: testCaseData.updatedBy || 'QA Tester',
      ...testCaseData,
    };
    this.testCases.unshift(newTestCase);
    this.saveToStorage();
    return newTestCase;
  }
  updateTestCase(id: number, updates: Partial<MockTestCase>) {
    const idx = this.testCases.findIndex(t => t.id === Number(id));
    if (idx !== -1) {
      this.testCases[idx] = { ...this.testCases[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage();
      return this.testCases[idx];
    }
    return null;
  }
  deleteTestCase(id: number) {
    this.testCases = this.testCases.filter(t => t.id !== Number(id));
    this.saveToStorage();
    return true;
  }

  // --- Defects ---
  getDefects(projectId?: number) {
    if (projectId) return this.defects.filter(d => Number(d.projectId) === Number(projectId));
    return [...this.defects];
  }
  getDefectById(id: number) { return this.defects.find(d => d.id === Number(id)); }
  createDefect(defectData: Partial<MockDefect>) {
    const newId = Date.now();
    const newDefect: MockDefect = {
      id: newId,
      defectId: defectData.defectId || `DEF-${Math.floor(100 + Math.random() * 900)}`,
      title: defectData.title || defectData.description || 'New Defect',
      description: defectData.description || defectData.title || '',
      priority: (defectData.priority as any) || 'medium',
      priorityId: defectData.priorityId || 2,
      priorityName: defectData.priorityName || 'Medium',
      severity: (defectData.severity as any) || 'medium',
      severityId: defectData.severityId || 2,
      severityName: defectData.severityName || 'Medium',
      status: defectData.status || 'new',
      statusId: defectData.statusId || 1,
      statusName: defectData.statusName || 'New',
      defectStatusId: defectData.defectStatusId || 1,
      defectStatusName: defectData.defectStatusName || 'New',
      projectId: Number(defectData.projectId) || 1,
      projectName: defectData.projectName || 'Project',
      releaseId: defectData.releaseId || 1,
      releaseName: defectData.releaseName || 'Release 1.0',
      moduleId: defectData.moduleId || 1,
      moduleName: defectData.moduleName || 'Module',
      subModuleId: defectData.subModuleId || 1,
      subModuleName: defectData.subModuleName || 'Submodule',
      testCaseId: defectData.testCaseId || null,
      steps: defectData.steps || '',
      stepsToReproduce: defectData.stepsToReproduce || (defectData.steps ? [defectData.steps] : []),
      reOpenCount: 0,
      reopenCount: 0,
      attachment: defectData.attachment || null,
      attachments: defectData.attachments || [],
      reportedBy: defectData.reportedBy || 'Priya Ramesh',
      assignedTo: defectData.assignedTo || 'Karthik Sundaram',
      assignedToId: defectData.assignedToId || 3,
      assignedToName: defectData.assignedToName || 'Karthik Sundaram',
      assignedById: defectData.assignedById || 2,
      assignedByName: defectData.assignedByName || 'Priya Ramesh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      defectHistory: [
        {
          id: Date.now(),
          status: 'new',
          changedAt: new Date().toISOString(),
          comment: 'Defect created',
          changedBy: defectData.reportedBy || 'QA Tester',
        },
      ],
      comments: [],
      ...defectData,
    };
    this.defects.unshift(newDefect);
    this.saveToStorage();
    return newDefect;
  }
  updateDefect(id: number, updates: Partial<MockDefect>) {
    const idx = this.defects.findIndex(d => d.id === Number(id));
    if (idx !== -1) {
      const old = this.defects[idx];
      const updated = { ...old, ...updates, updatedAt: new Date().toISOString() };
      
      // If status changed, record in history
      if (updates.status && updates.status !== old.status) {
        if (!updated.defectHistory) updated.defectHistory = [];
        updated.defectHistory.push({
          id: Date.now(),
          status: updates.status,
          changedAt: new Date().toISOString(),
          comment: (updates as any).comment || `Status changed from ${old.status} to ${updates.status}`,
          changedBy: (updates as any).changedBy || 'System User',
        });
        if (updates.status.toLowerCase() === 'reopened') {
          updated.reOpenCount = (updated.reOpenCount || 0) + 1;
          updated.reopenCount = updated.reOpenCount;
        }
      }
      this.defects[idx] = updated;
      this.saveToStorage();
      return this.defects[idx];
    }
    return null;
  }
  deleteDefect(id: number) {
    this.defects = this.defects.filter(d => d.id !== Number(id));
    this.saveToStorage();
    return true;
  }
  addDefectComment(defectId: number, commentText: string, user?: MockUser) {
    const def = this.getDefectById(defectId);
    if (def) {
      if (!def.comments) def.comments = [];
      const newComment = {
        id: Date.now(),
        defectId: Number(defectId),
        userId: user?.id || 1,
        userName: user ? `${user.firstName} ${user.lastName}` : 'Arun Kumar',
        comment: commentText,
        createdAt: new Date().toISOString(),
      };
      def.comments.push(newComment);
      this.saveToStorage();
      return newComment;
    }
    return null;
  }

  // --- Bench ---
  getBenchResources() { return [...this.benchResources]; }
  allocateBenchResource(employeeId: number, projectId: number, allocationPercent: number) {
    const user = this.getUserById(employeeId);
    if (user) {
      user.availabilityPercent = Math.max(0, (user.availabilityPercent || 100) - allocationPercent);
      const proj = this.getProjectById(projectId);
      if (proj && !user.currentProjects?.includes(proj.name || '')) {
        user.currentProjects = [...(user.currentProjects || []), proj.name || ''];
      }
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // --- Configurations ---
  getDesignations() { return [...this.designations]; }
  createDesignation(data: any) {
    const newDesig = { id: Date.now(), designationName: data.designationName || data.name, description: data.description || '', totalEmployees: 0 };
    this.designations.push(newDesig);
    return newDesig;
  }
  updateDesignation(id: number, data: any) {
    const idx = this.designations.findIndex(d => d.id === Number(id));
    if (idx !== -1) {
      this.designations[idx] = { ...this.designations[idx], ...data };
      return this.designations[idx];
    }
    return null;
  }
  deleteDesignation(id: number) {
    this.designations = this.designations.filter(d => d.id !== Number(id));
    return true;
  }

  getRoles() { return [...this.roles]; }
  createRole(data: any) {
    const newRole = { id: Date.now(), roleName: data.roleName || data.name, description: data.description || '', totalPermissions: 10 };
    this.roles.push(newRole);
    return newRole;
  }
  updateRole(id: number, data: any) {
    const idx = this.roles.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      this.roles[idx] = { ...this.roles[idx], ...data };
      return this.roles[idx];
    }
    return null;
  }
  deleteRole(id: number) {
    this.roles = this.roles.filter(r => r.id !== Number(id));
    return true;
  }

  getPermissions() { return [...this.permissions]; }
  getSeverities() { return [...this.severities]; }
  createSeverity(data: any) {
    const newSev = { id: Date.now(), name: data.name, color: data.color || '#3B82F6', description: data.description || '' };
    this.severities.push(newSev);
    return newSev;
  }
  updateSeverity(id: number, data: any) {
    const idx = this.severities.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      this.severities[idx] = { ...this.severities[idx], ...data };
      return this.severities[idx];
    }
    return null;
  }
  deleteSeverity(id: number) {
    this.severities = this.severities.filter(s => s.id !== Number(id));
    return true;
  }

  getPriorities() { return [...this.priorities]; }
  createPriority(data: any) {
    const newPrio = { id: Date.now(), name: data.name, color: data.color || '#3B82F6', description: data.description || '' };
    this.priorities.push(newPrio);
    return newPrio;
  }
  updatePriority(id: number, data: any) {
    const idx = this.priorities.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      this.priorities[idx] = { ...this.priorities[idx], ...data };
      return this.priorities[idx];
    }
    return null;
  }
  deletePriority(id: number) {
    this.priorities = this.priorities.filter(p => p.id !== Number(id));
    return true;
  }

  getDefectTypes() { return [...this.defectTypes]; }
  createDefectType(data: any) {
    const newDT = { id: Date.now(), defectTypeName: data.defectTypeName || data.name, name: data.defectTypeName || data.name };
    this.defectTypes.push(newDT);
    return newDT;
  }
  updateDefectType(id: number, data: any) {
    const idx = this.defectTypes.findIndex(d => d.id === Number(id));
    if (idx !== -1) {
      this.defectTypes[idx] = { ...this.defectTypes[idx], ...data, defectTypeName: data.defectTypeName || data.name || this.defectTypes[idx].defectTypeName };
      return this.defectTypes[idx];
    }
    return null;
  }
  deleteDefectType(id: number) {
    this.defectTypes = this.defectTypes.filter(d => d.id !== Number(id));
    return true;
  }

  getReleaseTypes() { return [...this.releaseTypes]; }
  createReleaseType(data: any) {
    const newRT = { id: Date.now(), releaseTypeName: data.releaseTypeName || data.name };
    this.releaseTypes.push(newRT);
    return newRT;
  }
  updateReleaseType(id: number, data: any) {
    const idx = this.releaseTypes.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      this.releaseTypes[idx] = { ...this.releaseTypes[idx], ...data };
      return this.releaseTypes[idx];
    }
    return null;
  }
  deleteReleaseType(id: number) {
    this.releaseTypes = this.releaseTypes.filter(r => r.id !== Number(id));
    return true;
  }

  getStatusTypes() { return [...this.statusTypes]; }
  getStatuses() { return [...this.statusTypes]; }
  getDefectStatuses() { return [...this.statusTypes]; }
  createStatusType(data: any) {
    const newST = { id: Date.now(), name: data.name, color: data.color || '#3B82F6', isInitial: data.isInitial || false, description: data.description || '' };
    this.statusTypes.push(newST);
    return newST;
  }
  updateStatusType(id: number, data: any) {
    const idx = this.statusTypes.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      this.statusTypes[idx] = { ...this.statusTypes[idx], ...data };
      return this.statusTypes[idx];
    }
    return null;
  }
  deleteStatusType(id: number) {
    this.statusTypes = this.statusTypes.filter(s => s.id !== Number(id));
    return true;
  }

  getEmailConfigs() { return [...this.emailConfigs]; }
  createEmailConfig(data: any) {
    const newEC = { id: Date.now(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.emailConfigs.push(newEC);
    return newEC;
  }
  updateEmailConfig(id: number, data: any) {
    const idx = this.emailConfigs.findIndex(e => e.id === Number(id));
    if (idx !== -1) {
      this.emailConfigs[idx] = { ...this.emailConfigs[idx], ...data, updatedAt: new Date().toISOString() };
      return this.emailConfigs[idx];
    }
    return null;
  }
  deleteEmailConfig(id: number) {
    this.emailConfigs = this.emailConfigs.filter(e => e.id !== Number(id));
    return true;
  }

  getEmailPointSetups() { return [...this.emailPointSetups]; }
  getEmailTemplates() { return [...this.emailTemplates]; }
}

export const mockDb = new MockDbStore();
