import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { PermissionProvider, usePermission } from "./context/PermissionContext";

import { Layout } from "./components/layout/Layout";
import ProjectAccessGuard from "./components/auth/ProjectAccessGuard";
import PermissionRouteGuard from "./components/auth/PermissionRouteGuard";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Employees } from "./pages/Employees";
import { Bench } from "./pages/Bench";
import { Projects } from "./pages/Projects";
import { Defects } from "./pages/Defects";
import { TestCase } from "./pages/TestCase";
import { TestExecution } from "./pages/TestExecution";
import { ModuleManagement } from "./pages/ModuleManagement";
import { ProjectManagement } from "./pages/ProjectManagement";
import ProjectAllocationHistory from "./pages/projectAllocationHistory";
import { Releases } from "./pages/release";
import { Allocation } from "./pages/allocation";
import { ReleaseView } from "./pages/ReleaseView";
import Configurations from "./pages/Configurations";
import Designation from "./pages/Designation";
import Role from "./pages/Role";
import DefectType from "./pages/DefectType";
import Privileges from "./pages/Privileges";
import EmailConfiguration from "./pages/EmailConfiguration";
import ReleaseType from "./pages/ReleaseType";
import Severity from "./pages/Severity";
import Priority from "./pages/Priority";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StatusWorkflow from "./pages/StatusWorkflow";
import StatusType from "./pages/StatusType";
import BenchAllocate from "./pages/BenchAllocate";
import Status from "./pages/Status";
import ReleaseDetails from "./pages/ReleaseDetails";
import { AccessDenied } from "./pages/AccessDenied";
import { NotFound } from "./pages/NotFound";


const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  noLayout?: boolean;
}> = ({ children, noLayout }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading DefectTracker Pro...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
  sessionStorage.setItem(
    "redirectUrl",
    window.location.pathname + window.location.search
  );

  return <Navigate to="/login" replace />;
}

  if (noLayout) return <>{children}</>;

  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  const { can } = usePermission();

  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard>
                <Dashboard />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.employee.view}>
                <Employees />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bench"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.bench.view}>
                <Bench />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.project.view}>
                <Projects />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/test-cases"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.testCase.view}>
                  <TestCase />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/releases"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.release.view}>
                  <Releases />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/releases/allocation"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.release.view}>
                  <Allocation />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/releases/test-execution"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.testCase.view}>
                  <TestExecution />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/project-management/view"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.release.view}>
                  <ReleaseView />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/defects"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.defect.view}>
                  <Defects />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/project-management"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.project.view}>
                  <ProjectManagement />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/project-management/allocation-history"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.projectAllocation.view}>
                  <ProjectAllocationHistory />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/project-management/module-management"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.module.view}>
                  <ModuleManagement />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/releases/:releaseId/details"
          element={
            <ProtectedRoute>
              <ProjectAccessGuard>
                <PermissionRouteGuard permission={can.release.view}>
                  <ReleaseDetails />
                </PermissionRouteGuard>
              </ProjectAccessGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard
                permission={
                  can.designation.view ||
                  can.role.view ||
                  can.defectType.view ||
                  can.permission.view ||
                  can.emailConfig.view ||
                  can.pointSetup.view ||
                  can.roleEmailRecipient.view ||
                  can.employeeEmailRecipient.view ||
                  can.releaseType.view ||
                  can.severity.view ||
                  can.priority.view ||
                  can.statusType.view ||
                  can.workflow.view
                }
              >
                <Configurations />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/designation"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.designation.view}>
                <Designation />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/role"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.role.view}>
                <Role />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/defect-type"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.defectType.view}>
                <DefectType />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/privileges"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.permission.view}>
                <Privileges />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
  path="/configurations/email-configuration"
  element={
    <ProtectedRoute>
      <PermissionRouteGuard
        permission={
          can.emailConfig.view ||
          can.pointSetup.view ||
          can.roleEmailRecipient.view ||
          can.employeeEmailRecipient.view
        }
      >
        <EmailConfiguration />
      </PermissionRouteGuard>
    </ProtectedRoute>
  }
/>

        <Route
          path="/configurations/release-type"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.releaseType.view}>
                <ReleaseType />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/severity"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.severity.view}>
                <Severity />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/priority"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.priority.view}>
                <Priority />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/status"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.statusType.view}>
                <Status />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/status/workflow"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.workflow.view}>
                <StatusWorkflow />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configurations/status/type"
          element={
            <ProtectedRoute>
              <PermissionRouteGuard permission={can.statusType.view}>
                <StatusType />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bench-allocate"
          element={
            <ProtectedRoute noLayout>
              <PermissionRouteGuard permission={can.projectAllocation.create}>
                <BenchAllocate />
              </PermissionRouteGuard>
            </ProtectedRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <PermissionProvider>
          <AppRoutes />
        </PermissionProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;