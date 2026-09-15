import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { mockDb } from "../mock/mockData";

interface ProjectInfo {
  projectId: number;
  projectName: string;
  role: string;
}

interface PermissionContextType {
  can: any;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permList: string[]) => boolean;
  allPermissions: string[];
  isLoading: boolean;
  permissionsReady: boolean;
  projects: ProjectInfo[];
  selectedProjectId: number | null;
  switchProject: (projectId: number | null) => Promise<void>;
  refreshPermissions: () => Promise<void>;
  isAdmin: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error("usePermission must be used within PermissionProvider");
  return context;
};

// Create a proxy that returns true for every property access at any depth
const createAlwaysAllowedProxy = (): any => {
  return new Proxy({}, {
    get: (_target, _prop) => {
      return true;
    }
  });
};

const ALWAYS_CAN = new Proxy({}, {
  get: (_target, _module) => {
    return createAlwaysAllowedProxy();
  }
});

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [permissions] = useState<string[]>(["ALL_PERMISSIONS"]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionsReady, setPermissionsReady] = useState(true);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [isAdmin] = useState(true);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(() => {
    const saved = localStorage.getItem("selectedProjectId");
    return saved ? parseInt(saved) : 1;
  });

  const fetchProjects = useCallback(async () => {
    const projectList = mockDb.getProjects().map(p => ({
      projectId: Number(p.id || p.projectId),
      projectName: p.name || p.projectName || 'Project',
      role: 'Project Manager',
    }));
    setProjects(projectList);
    return projectList;
  }, []);

  const switchProject = useCallback(
    async (projectId: number | null) => {
      if (projectId) {
        localStorage.setItem("selectedProjectId", String(projectId));
      } else {
        localStorage.removeItem("selectedProjectId");
      }
      setSelectedProjectId(projectId);
    },
    []
  );

  const refreshPermissions = async () => {
    await fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
    setIsLoading(false);
    setPermissionsReady(true);
  }, [user, fetchProjects]);

  const hasPermission = (_permission: string): boolean => true;
  const hasAnyPermission = (_permList: string[]): boolean => true;

  return (
    <PermissionContext.Provider
      value={{
        can: ALWAYS_CAN,
        hasPermission,
        hasAnyPermission,
        allPermissions: permissions,
        isLoading,
        permissionsReady,
        projects,
        selectedProjectId,
        switchProject,
        refreshPermissions,
        isAdmin,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};