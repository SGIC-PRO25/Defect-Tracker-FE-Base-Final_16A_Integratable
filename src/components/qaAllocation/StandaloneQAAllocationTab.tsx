import { roleTypesBasedRoleFetch } from "../../utils/roleTypeBasedRoleFetch";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowRightLeft,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import { mockDb } from "../../mock/mockData";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Toast } from "../ui/Toast";

interface ApiResponse<T> {
  data?: T;
  status?: string;
  statusCode?: number;
  message?: string;
  statusMessage?: string;
}

interface ReleaseOption {
  id?: string | number;
  releaseId?: string | number;
  projectId?: string | number;
  project?: {
    id?: string | number;
    projectId?: string | number;
  };
  name?: string;
  releaseName?: string;
  version?: string | number;
}

interface ModuleOption {
  id: string | number;
  name: string;
  submodules: SubmoduleOption[];
}

interface SubmoduleOption {
  id: string | number;
  name: string;
}

interface EmployeeOption {
  id: number;
  name: string;
  roleName: string;
}

interface ProjectAllocationEmployee {
  employeeId?: number;
  userId?: number;
  id?: number;
  firstName?: string;
  lastName?: string;
  userFullName?: string;
  employeeName?: string;
  roleName?: string;
  role?: string;
  userRole?: string;
  designationName?: string;
  employee?: ProjectAllocationEmployee;
}


interface ReleaseQaTestCase {
  testcaseId: number;
  testCaseNo: string;
  name: string;
  moduleId: number;
  submoduleId: number;
  assignedTo: number | null;
}

type AllocationMode = "assign" | "reassign";

const unwrapArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object" && Array.isArray((value as ApiResponse<T[]>).data)) {
    return (value as ApiResponse<T[]>).data || [];
  }

  return [];
};

const unwrapList = <T,>(value: unknown): T[] => {
  const directList = unwrapArray<T>(value);
  if (directList.length > 0) return directList;

  if (value && typeof value === "object") {
    const response = value as { content?: unknown; data?: unknown };
    if (Array.isArray(response.content)) return response.content as T[];

    if (response.data && typeof response.data === "object") {
      const data = response.data as { content?: unknown };
      if (Array.isArray(data.content)) return data.content as T[];
    }
  }

  return [];
};


const unwrapInfoList = <T,>(value: unknown): T[] => {
  if (value && typeof value === "object") {
    const response = value as { data?: { info?: unknown }; info?: unknown };
    if (response.data && Array.isArray(response.data.info)) return response.data.info as T[];
    if (Array.isArray(response.info)) return response.info as T[];
  }
  return unwrapList<T>(value);
};

const getReleaseId = (release: ReleaseOption) => String(release.releaseId || release.id || "");

const normalizeRoleName = (value: unknown): string =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

const mapProjectAllocationEmployees = (
  allocations: ProjectAllocationEmployee[],
): EmployeeOption[] =>
  allocations
    .map((allocation) => {
      const employee = allocation.employee || {};

      const id =
        allocation.employeeId ||
        employee.employeeId ||
        allocation.id ||
        employee.id ||
        allocation.userId ||
        employee.userId ||
        0;

      const name =
        allocation.userFullName ||
        employee.userFullName ||
        allocation.employeeName ||
        employee.employeeName ||
        `${allocation.firstName || employee.firstName || ""} ${allocation.lastName || employee.lastName || ""}`.trim() ||
        `Employee ${id}`;

      const roleName = normalizeRoleName(
        allocation.roleName ||
          allocation.role ||
          allocation.userRole ||
          employee.roleName ||
          employee.role ||
          employee.userRole,
      );

      return { id, name, roleName };
    })
    .filter((employee) => employee.id);

const mapReleaseQaTestCases = (rows: any[]): ReleaseQaTestCase[] =>
  rows
    .map((row) => {
      const testcaseId = Number(row.testcaseId ?? row.testCaseId ?? row.id ?? 0);
      const rawAssignedTo = row.assignedTo ?? row.assignedToId ?? row.employeeId ?? null;
      const assignedTo =
        rawAssignedTo === null || rawAssignedTo === undefined || rawAssignedTo === ""
          ? null
          : Number(rawAssignedTo);

      return {
        testcaseId,
        testCaseNo: row.testCaseNo || row.no || `TC${String(testcaseId).padStart(5, "0")}`,
        name: row.name || row.description || row.testCaseDescription || "No description",
        moduleId: Number(row.moduleId ?? row.module?.id ?? 0),
        submoduleId: Number(row.submoduleId ?? row.subModuleId ?? row.submodule?.id ?? 0),
        assignedTo: assignedTo !== null && Number.isFinite(assignedTo) ? assignedTo : null,
      };
    })
    .filter((testCase) => testCase.testcaseId);

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

interface StandaloneQAAllocationTabProps {
  projectId?: string | number | null;
}

export const StandaloneQAAllocationTab: React.FC<StandaloneQAAllocationTabProps> = ({
  projectId,
}) => {
  const { projectId: routeProjectId } = useParams();
  const projectIdValue = String(projectId || routeProjectId || "");

  const [releases, setReleases] = useState<ReleaseOption[]>([]);
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [allocatedEmployees, setAllocatedEmployees] = useState<EmployeeOption[]>([]);
  const [qaMembers, setQaMembers] = useState<EmployeeOption[]>([]);
  const [allTestCases, setAllTestCases] = useState<ReleaseQaTestCase[]>([]);

  const [selectedReleaseId, setSelectedReleaseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState("");

  const [mode, setMode] = useState<AllocationMode>("assign");
  const [manualReassign, setManualReassign] = useState(false);

  const [selectedQaId, setSelectedQaId] = useState("");
  const [fromEmployeeId, setFromEmployeeId] = useState("");
  const [toEmployeeId, setToEmployeeId] = useState("");

  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<number[]>([]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [dependencyLoading, setDependencyLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [testCaseLoading, setTestCaseLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string; open: boolean }>({
    type: "success",
    text: "",
    open: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Reset everything when the project changes.
  useEffect(() => {
    setReleases([]);
    setModules([]);
    setAllocatedEmployees([]);
    setQaMembers([]);
    setAllTestCases([]);

    setSelectedReleaseId("");
    setSelectedModuleId("");
    setSelectedSubmoduleId("");

    setMode("assign");
    setManualReassign(false);

    setSelectedQaId("");
    setFromEmployeeId("");
    setToEmployeeId("");

    setSelectedTestCaseIds([]);
    setPageSize(10);
    setCurrentPage(1);

    setSearchTerm("");
    setMessage(null);

    setDependencyLoading(false);
    setQaLoading(false);
    setTestCaseLoading(false);
    setSaving(false);
  }, [projectIdValue]);

  // Load releases + modules/submodules (used for names).
  useEffect(() => {
    if (!projectIdValue) {
      setReleases([]);
      setModules([]);
      return;
    }

    const loadDependencies = async () => {
      setDependencyLoading(true);
      setMessage(null);

      try {
        const releaseData = mockDb.getReleases(Number(projectIdValue)).map((release) => ({
          ...release,
          releaseName: release.name || release.releaseName,
        }));
        setReleases(releaseData);

        const moduleData = mockDb.getModules(Number(projectIdValue));
        const modulesWithSubmodules = moduleData.map((module) => ({
          id: module.id,
          name: module.name || module.moduleName || `Module ${module.id}`,
          submodules: (module.submodules || []).map((s: any) => ({
            id: s.id,
            name: s.name || s.subModuleName || `Submodule ${s.id}`,
          })),
        }));

        setModules(modulesWithSubmodules);
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to load releases and modules.",
        });
      } finally {
        setDependencyLoading(false);
      }
    };

    void loadDependencies();
  }, [projectIdValue]);

  // Load project allocated employees (all) + QA filtered subset.
  useEffect(() => {
    if (!projectIdValue) {
      setAllocatedEmployees([]);
      setQaMembers([]);
      return;
    }

    const loadEmployees = async () => {
      setQaLoading(true);

      try {
        const qaRoleNames = await roleTypesBasedRoleFetch(["QA_ENGINEER","QA_LEAD"]);
        const allowedRoles = new Set(qaRoleNames.map(normalizeRoleName));

        const allUsers = mockDb.getUsers();
        const employees = allUsers.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          roleName: u.roleName || "Developer",
        }));

        setAllocatedEmployees(employees);
        setQaMembers(employees.filter((employee) => allowedRoles.has(employee.roleName) || employee.roleName.includes("QA")));
      } catch (error) {
        setAllocatedEmployees([]);
        setQaMembers([]);
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to load QA members.",
        });
      } finally {
        setQaLoading(false);
      }
    };

    void loadEmployees();
  }, [projectIdValue]);

  // Fetch all release-allocated test cases in one go.
  const loadReleaseAllocation = useCallback(async () => {
    if (!projectIdValue || !selectedReleaseId) {
      setAllTestCases([]);
      return;
    }

    setTestCaseLoading(true);
    setMessage(null);

    try {
      const testCases = mockDb.getTestCases();
      setAllTestCases(
        testCases.map((tc) => ({
          testcaseId: tc.id,
          testCaseNo: tc.testcaseNo,
          name: tc.description,
          moduleId: tc.moduleId || 1,
          submoduleId: tc.subModuleId || 1,
          assignedTo: tc.assignedQaId || (tc.id % 2 === 0 ? 2 : null),
        }))
      );
    } catch (error) {
      setAllTestCases([]);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load release test cases.",
      });
    } finally {
      setTestCaseLoading(false);
    }
  }, [projectIdValue, selectedReleaseId]);

  useEffect(() => {
    void loadReleaseAllocation();
  }, [loadReleaseAllocation]);

  const employeeNameById = useMemo(() => {
    const map = new Map<number, string>();
    allocatedEmployees.forEach((employee) => map.set(employee.id, employee.name));
    return map;
  }, [allocatedEmployees]);

  // Modules that actually have allocated test cases.
  const availableModules = useMemo(() => {
    const moduleIds = new Set(allTestCases.map((testCase) => testCase.moduleId));
    return modules.filter((module) => moduleIds.has(Number(module.id)));
  }, [modules, allTestCases]);

  // Submodules with allocated test cases for the selected module.
  const availableSubmodules = useMemo(() => {
    const selectedModule = modules.find((module) => String(module.id) === selectedModuleId);
    if (!selectedModule) return [];

    const submoduleIds = new Set(
      allTestCases
        .filter((testCase) => testCase.moduleId === Number(selectedModuleId))
        .map((testCase) => testCase.submoduleId),
    );

    return selectedModule.submodules.filter((submodule) => submoduleIds.has(Number(submodule.id)));
  }, [modules, allTestCases, selectedModuleId]);

  // Employees that currently have test cases assigned (source for "From").
  const fromEmployees = useMemo(() => {
    const ids = Array.from(
      new Set(
        allTestCases
          .filter((testCase) => testCase.assignedTo != null)
          .map((testCase) => Number(testCase.assignedTo)),
      ),
    );
    return ids.map((id) => ({ id, name: employeeNameById.get(id) || `Employee ${id}` }));
  }, [allTestCases, employeeNameById]);

  const isManualMode = mode === "reassign" && manualReassign;

  // Apply mode + filters + search.
  const filteredTestCases = useMemo(() => {
    let base = allTestCases;

    if (mode === "assign") {
      base = base.filter((testCase) => testCase.assignedTo == null);
    } else if (isManualMode) {
      base = base.filter(
        (testCase) =>
          testCase.assignedTo != null &&
          (!fromEmployeeId || testCase.assignedTo === Number(fromEmployeeId)),
      );
    } else {
      base = base.filter((testCase) => testCase.assignedTo != null);
    }

    if (selectedModuleId) {
      base = base.filter((testCase) => testCase.moduleId === Number(selectedModuleId));
    }
    if (selectedSubmoduleId) {
      base = base.filter((testCase) => testCase.submoduleId === Number(selectedSubmoduleId));
    }

    const search = searchTerm.trim().toLowerCase();
    if (search) {
      base = base.filter((testCase) =>
        [testCase.testCaseNo, testCase.name, testCase.testcaseId]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search)),
      );
    }

    const sorted = [...base].sort((a, b) =>
      a.testCaseNo.localeCompare(b.testCaseNo, undefined, { numeric: true, sensitivity: "base" }),
    );

    return sortOrder === "asc" ? sorted : sorted.reverse();
  }, [allTestCases, mode, isManualMode, fromEmployeeId, selectedModuleId, selectedSubmoduleId, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredTestCases.length / pageSize));

  const paginatedTestCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTestCases.slice(start, start + pageSize);
  }, [filteredTestCases, currentPage, pageSize]);

  // Keep current page valid when the filtered list shrinks.
  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  // Reset to first page when filters/mode change.
  useEffect(() => {
    setCurrentPage(1);
  }, [mode, manualReassign, selectedModuleId, selectedSubmoduleId, fromEmployeeId, searchTerm, pageSize]);

  const canSelectTestCases = isManualMode
    ? Boolean(fromEmployeeId && toEmployeeId)
    : Boolean(selectedQaId);

  // In manual reassign mode, default to selecting all of the source employee's test cases.
  useEffect(() => {
    if (isManualMode && fromEmployeeId && toEmployeeId) {
      setSelectedTestCaseIds(filteredTestCases.map((testCase) => testCase.testcaseId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualMode, fromEmployeeId, toEmployeeId]);

  const toggleTestCase = (testCaseId: number) => {
    if (!canSelectTestCases) return;

    setSelectedTestCaseIds((previous) =>
      previous.includes(testCaseId)
        ? previous.filter((id) => id !== testCaseId)
        : [...previous, testCaseId],
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canSelectTestCases) return;

    const allIds = filteredTestCases.map((testCase) => testCase.testcaseId);
    setSelectedTestCaseIds(event.target.checked ? allIds : []);
  };

  const allFilteredSelected =
    filteredTestCases.length > 0 &&
    filteredTestCases.every((testCase) => selectedTestCaseIds.includes(testCase.testcaseId));

  const resetSelection = () => {
    setSelectedTestCaseIds([]);
    setMessage(null);
  };

  const handleModeChange = (nextMode: AllocationMode) => {
    setMode(nextMode);
    setManualReassign(false);
    setSelectedQaId("");
    setFromEmployeeId("");
    setToEmployeeId("");
    resetSelection();
  };

  const handleToggleManualReassign = () => {
    setManualReassign((previous) => !previous);
    setSelectedQaId("");
    setFromEmployeeId("");
    setToEmployeeId("");
    resetSelection();
  };

  const handleSave = async () => {
    const targetEmployeeId = isManualMode ? toEmployeeId : selectedQaId;

    const showToast = (type: "success" | "error", text: string) =>
      setToast({ type, text, open: true });

    if (!selectedReleaseId) {
      showToast("error", "Please select a release first.");
      return;
    }
    if (!targetEmployeeId) {
      showToast(
        "error",
        isManualMode ? "Please select the QA to reassign to." : "Please select a QA member.",
      );
      return;
    }
    if (selectedTestCaseIds.length === 0) {
      showToast("error", "Please select at least one test case.");
      return;
    }

    setSaving(true);

    // Build the success message on the frontend (backend messages may include
    // de-allocation details that don't apply to this screen).
    const count = selectedTestCaseIds.length;
    const testCaseLabel = `${count} test case${count === 1 ? "" : "s"}`;

    const getEmployeeName = (id: string) =>
      qaMembers.find((member) => String(member.id) === id)?.name ||
      employeeNameById.get(Number(id)) ||
      `Employee ${id}`;

    let successText: string;
    if (isManualMode) {
      successText = `Reassigned ${testCaseLabel} from ${getEmployeeName(fromEmployeeId)} to ${getEmployeeName(
        toEmployeeId,
      )}.`;
    } else {
      const targetName = getEmployeeName(selectedQaId);
      successText =
        mode === "assign"
          ? `Assigned ${testCaseLabel} to ${targetName}.`
          : `Reassigned ${testCaseLabel} to ${targetName}.`;
    }

    try {
      selectedTestCaseIds.forEach((id) => {
        mockDb.updateTestCase(id, { assignedQaId: Number(targetEmployeeId) });
      });

      showToast("success", successText);
      setSelectedTestCaseIds([]);
      await loadReleaseAllocation();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to save QA allocation.",
      );
    } finally {
      setSaving(false);
    }
  };

  const pageStart = filteredTestCases.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, filteredTestCases.length);

  const targetSelectLabel = mode === "assign" ? "Assign To (QA)" : "Reassign To (QA)";

  return (
    <div className="space-y-6">
      <Toast
        message={toast.text}
        type={toast.type}
        isOpen={toast.open}
        onClose={() => setToast((previous) => ({ ...previous, open: false }))}
      />

      {!projectIdValue && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Select a project before using QA allocation.
        </div>
      )}

      {message && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">QA Allocation</h3>
              <p className="text-sm text-gray-500">
                Select a release to load its allocated test cases, then assign or reassign them to QA members.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Assign / Reassign toggle */}
              <div className="inline-flex rounded-md border border-gray-300 bg-gray-100 p-0.5">
                <button
                  type="button"
                  onClick={() => handleModeChange("assign")}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition ${
                    mode === "assign"
                      ? "bg-white text-blue-700 shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("reassign")}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition ${
                    mode === "reassign"
                      ? "bg-white text-blue-700 shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Reassign
                </button>
              </div>

              {mode === "reassign" && (
                <Button
                  type="button"
                  size="sm"
                  variant={manualReassign ? "primary" : "secondary"}
                  icon={manualReassign ? X : ArrowRightLeft}
                  onClick={handleToggleManualReassign}
                >
                  {manualReassign ? "Cancel Bulk Assign" : "Bulk Assign"}
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={loadReleaseAllocation}
                disabled={dependencyLoading || testCaseLoading || !selectedReleaseId}
              >
                {testCaseLoading ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                )}
                Reload
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Release */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release</label>
              <select
                value={selectedReleaseId}
                onChange={(event) => {
                  setSelectedReleaseId(event.target.value);
                  setSelectedModuleId("");
                  setSelectedSubmoduleId("");
                  setFromEmployeeId("");
                  setSelectedTestCaseIds([]);
                }}
                disabled={dependencyLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">{dependencyLoading ? "Loading releases..." : "Choose release"}</option>
                {releases.map((release) => {
                  const releaseId = getReleaseId(release);
                  return (
                    <option key={releaseId} value={releaseId}>
                      {release.releaseName || release.name || `Release ${releaseId}`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select
                value={selectedModuleId}
                onChange={(event) => {
                  setSelectedModuleId(event.target.value);
                  setSelectedSubmoduleId("");
                }}
                disabled={!selectedReleaseId || testCaseLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">{selectedReleaseId ? "All modules" : "Select a release first"}</option>
                {availableModules.map((module) => (
                  <option key={module.id} value={String(module.id)}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submodule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submodule</label>
              <select
                value={selectedSubmoduleId}
                onChange={(event) => setSelectedSubmoduleId(event.target.value)}
                disabled={!selectedReleaseId || !selectedModuleId}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">{selectedModuleId ? "All submodules" : "Select a module first"}</option>
                {availableSubmodules.map((submodule) => (
                  <option key={submodule.id} value={String(submodule.id)}>
                    {submodule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target / From-To selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {isManualMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From (current QA)</label>
                  <select
                    value={fromEmployeeId}
                    onChange={(event) => {
                      setFromEmployeeId(event.target.value);
                      setSelectedTestCaseIds([]);
                    }}
                    disabled={!selectedReleaseId}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Choose source QA</option>
                    {fromEmployees.map((employee) => (
                      <option key={employee.id} value={String(employee.id)}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To (new QA)</label>
                  <select
                    value={toEmployeeId}
                    onChange={(event) => setToEmployeeId(event.target.value)}
                    disabled={!fromEmployeeId || qaLoading}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">{qaLoading ? "Loading QA members..." : "Choose target QA"}</option>
                    {qaMembers
                      .filter((member) => String(member.id) !== fromEmployeeId)
                      .map((member) => (
                        <option key={member.id} value={String(member.id)}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{targetSelectLabel}</label>
                <select
                  value={selectedQaId}
                  onChange={(event) => {
                    setSelectedQaId(event.target.value);
                    setSelectedTestCaseIds([]);
                  }}
                  disabled={qaLoading || !selectedReleaseId}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">{qaLoading ? "Loading QA members..." : "Choose QA"}</option>
                  {qaMembers.map((member) => (
                    <option key={member.id} value={String(member.id)}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === "assign" ? "Unassigned Test Cases" : "Assigned Test Cases"}
              </h3>
              <p className="text-sm text-gray-500">
                {mode === "assign"
                  ? "Select test cases and assign them to the chosen QA member."
                  : isManualMode
                    ? "Pick a source and target QA, then reassign all or specific test cases."
                    : "Select already-assigned test cases and reassign them to the chosen QA member."}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full max-w-md">
              <button
                type="button"
                onClick={() => setSortOrder((order) => (order === "asc" ? "desc" : "asc"))}
                title={`Sort by test case number (${sortOrder === "asc" ? "ascending" : "descending"})`}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </button>
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search test cases..."
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {testCaseLoading ? (
            <div className="text-center py-12 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading test cases...
            </div>
          ) : filteredTestCases.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={handleSelectAll}
                  disabled={!canSelectTestCases}
                  className="disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({filteredTestCases.length})
                </span>
                {!canSelectTestCases && (
                  <span className="text-xs text-gray-400 ml-2">
                    {isManualMode
                      ? "Select both From and To QA to enable selection"
                      : "Select a QA member to enable selection"}
                  </span>
                )}
              </div>

              <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-200">
                {paginatedTestCases.map((testCase) => (
                  <div key={testCase.testcaseId} className="relative group">
                    <label
                      className={`flex items-start gap-3 p-4 ${
                        canSelectTestCases
                          ? "hover:bg-gray-50 cursor-pointer"
                          : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTestCaseIds.includes(testCase.testcaseId)}
                        onChange={() => toggleTestCase(testCase.testcaseId)}
                        disabled={!canSelectTestCases}
                        className="mt-1 disabled:cursor-not-allowed"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{testCase.testCaseNo}</span>
                          {testCase.assignedTo != null && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                              {employeeNameById.get(testCase.assignedTo) ||
                                `Employee ${testCase.assignedTo}`}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{testCase.name}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2">
                    {pageStart}-{pageEnd} of {filteredTestCases.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <UserCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              {selectedReleaseId
                ? mode === "assign"
                  ? "No unassigned test cases for the current filters."
                  : "No assigned test cases for the current filters."
                : "Select a release to load allocated test cases."}
            </div>
          )}

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {selectedTestCaseIds.length} test case(s) selected
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || selectedTestCaseIds.length === 0 || !canSelectTestCases}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {mode === "assign" ? "Save QA Allocation" : "Save QA Reassignment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
