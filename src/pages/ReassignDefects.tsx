import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Checkbox } from '../components/ui/Checkbox';
import { getDevelopersWithRolesByProjectId } from '../api/bench/projectAllocation';
import { getAllSubmoduleAllocatedDevBySubmoduleId } from '../api/subModuleDevAlloc';
import { usePermission } from '../context/PermissionContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { getDefectsByProjectId, filterDefects } from '../api/defect/filterDefectByProject';
import { getModulesByProjectId } from '../api/module/getModule';
import { getSubmodulesByModuleId } from '../api/submodule/submoduleget';

interface Defect {
  id: number;
  defectId: string;
  description: string;
  assigned_to_name: string;
  assigned_to_id: number | null;
  module_name: string;
  sub_module_name: string;
  subModuleId?: number;
  moduleId?: number;
  defect_status_name: string;
  [key: string]: any;
}

interface ReassignDefectsProps {
  defects: Defect[];
  projectId: string;
  onReassign: (defectIds: number[], assignedToId: number) => Promise<void>;
  onClose: () => void;
  className?: string;
  onSuccess?: () => void;
}

const INACTIVE_STATUSES = ['CLOSED', 'FIXED'];

export const ReassignDefects: React.FC<ReassignDefectsProps> = ({
  defects,
  projectId,
  onReassign,
  onClose,
  className = '',
  onSuccess,
}) => {
  const [selectedDefects, setSelectedDefects] = useState<Set<number>>(new Set());
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [selectedSubmodule, setSelectedSubmodule] = useState<string>('');
  const [developers, setDevelopers] = useState<{ userId: number; userName: string; empId: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submoduleDevsLoading, setSubmoduleDevsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousSubmodule, setPreviousSubmodule] = useState<string>('');
  const { can } = usePermission();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [pendingReassignData, setPendingReassignData] = useState<{
    defectIds: number[];
    assigneeId: number;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [defectsPerPage, setDefectsPerPage] = useState(10);
  const [totalPagesFromServer, setTotalPagesFromServer] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isServerPaginated, setIsServerPaginated] = useState(false);

  const [projectSubmodules, setProjectSubmodules] = useState<{ value: string; label: string; id: number }[]>([]);
  const [projectDevelopers, setProjectDevelopers] = useState<{ userId: number; userName: string; empId: number }[]>([]);

  const [allProjectDefects, setAllProjectDefects] = useState<Defect[]>([]);
  const [isLoadingDefects, setIsLoadingDefects] = useState(false);

  // Fetch all project submodules for filtering
  useEffect(() => {
    if (!projectId) return;
    getModulesByProjectId(projectId)
      .then((modules) => {
        const mArray = Array.isArray(modules) ? modules : modules?.data || [];
        
        // Fetch submodules for all modules in parallel
        Promise.all(
          mArray.map((m: any) => {
            const mId = m.id || m.moduleId;
            if (!mId) return Promise.resolve([]);
            return getSubmodulesByModuleId(Number(mId))
              .then((res) => {
                const subModulesList = res?.data || res?.content || [];
                return subModulesList.map((sm: any) => ({
                  value: sm.name || sm.subModuleName,
                  label: sm.name || sm.subModuleName,
                  id: sm.id || sm.subModuleId,
                }));
              })
              .catch((err) => {
                console.error(`Error fetching submodules for module ${mId}:`, err);
                return [];
              });
          })
        ).then((results) => {
          // Flatten all submodule lists
          const flattened = results.flat().filter((sm: any) => sm && sm.value && sm.id);
          setProjectSubmodules(flattened);
        });
      })
      .catch((err) => console.error("Error fetching project modules:", err));
  }, [projectId]);

  // Fetch all project developers for filtering
  useEffect(() => {
    if (!projectId) return;
    getDevelopersWithRolesByProjectId(projectId)
      .then((res) => {
        const users = Array.isArray(res) 
          ? res 
          : res?.data || res?.users || [];
        const mapped = users.map((user: any) => ({
          userId: user.employeeId || user.userId || user.id,
          userName: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`.trim()
            : user.userName || user.name || 'Unknown User',
          empId: user.employeeId || user.userId || user.id,
        }));
        setProjectDevelopers(mapped);
      })
      .catch((err) => console.error("Error fetching project developers:", err));
  }, [projectId]);

  const submoduleIdMap = useMemo(() => {
    const map = new Map<string, number>();
    projectSubmodules.forEach((sm) => {
      if (sm.value && sm.id) {
        map.set(sm.value, Number(sm.id));
      }
    });
    return map;
  }, [projectSubmodules]);

  
  useEffect(() => {
    if (!projectId) return;

    const fetchAllDefects = async () => {
      setIsLoadingDefects(true);
      setError(null);
      try {
        const hasFilters = !!(filterAssignee || selectedSubmodule);
        let responseData: any;

        if (!hasFilters) {
          responseData = await getDefectsByProjectId(
            Number(projectId),
            currentPage - 1,
            defectsPerPage
          );
        } else {
          const filterParams: any = { projectId: Number(projectId) };
          if (filterAssignee) {
            filterParams.assignedToIds = [Number(filterAssignee)];
          }
          if (selectedSubmodule) {
            const subId = submoduleIdMap.get(selectedSubmodule);
            if (subId) {
              filterParams.subModuleIds = [subId];
            }
          }
          responseData = await filterDefects(
            filterParams,
            currentPage - 1,
            defectsPerPage
          );
        }

        const defectsData =
          responseData?.content ||
          responseData?.data?.content ||
          responseData?.data ||
          (Array.isArray(responseData) ? responseData : []);

        const hasServerPage = !!(
          responseData?.totalPages !== undefined ||
          responseData?.data?.totalPages !== undefined
        );
        const tPages =
          responseData?.totalPages ??
          responseData?.data?.totalPages ??
          1;
        const tElements =
          responseData?.totalElements ??
          responseData?.data?.totalElements ??
          defectsData.length;

        const mapped = defectsData.map((d: any) => ({
          id: d.id,
          defectId: `DEF-${d.id.toString().padStart(3, "0")}`,
          defect_status_name: d.defectStatusName || d.status || "",
          description: d.defectDescription || d.description || "",
          steps: d.stepsToRecreation || d.steps || "",
          type_name: d.defectTypeName || d.type || "",
          severity_name: d.defectSeverityName || d.severity || "",
          projectName: d.projectName || "",
          project_name: d.projectName || "",
          name: d.priorityName || "",
          assigned_to_name: d.assignedToName || "",
          assigned_by_name: d.createdByName || d.createdBy,
          assigned_to_id: d.assignedToId,
          assigned_by_id: d.assignedById,
          attachment: d.image || d.attachment || null,
          reOpenCount: d.reOpenCount || 0,
          stepsToRecreation: d.stepsToRecreation || d.steps || "",
          release_test_case_description: d.releaseTestCaseDescription || "",
          commentsCount: d.commentsCount || 0,
          subModuleId: d.subModuleId,
          sub_module_name: d.subModuleName || "",
          module_name: d.moduleName || "",
        }));

        setAllProjectDefects(mapped);
        setTotalPagesFromServer(tPages);
        setTotalElements(tElements);
        setIsServerPaginated(hasServerPage);
      } catch (err: any) {
        console.error("Failed to fetch defects for reassignment:", err);
        setError("Failed to load defects");
      } finally {
        setIsLoadingDefects(false);
      }
    };

    fetchAllDefects();
  }, [projectId, currentPage, defectsPerPage, filterAssignee, selectedSubmodule, submoduleIdMap]);

  const activeDefects = useMemo(() => {
    const sourceDefects = allProjectDefects.length > 0 ? allProjectDefects : (defects || []);
    return sourceDefects.filter((defect) => {
      const status = (defect.defect_status_name || '').toUpperCase();
      return !INACTIVE_STATUSES.includes(status);
    });
  }, [allProjectDefects, defects]);

  const assignedDevOptions = useMemo(() => {
    const devMap = new Map();
    const devSet = new Set<string>();
    
    projectDevelopers.forEach((dev) => {
      const key = dev.userId.toString();
      if (!devSet.has(key)) {
        devSet.add(key);
        devMap.set(key, {
          value: key,
          label: dev.userName,
        });
      }
    });
    
    return Array.from(devMap.values());
  }, [projectDevelopers]);

  const filteredByAssignee = useMemo(() => {
    if (isServerPaginated || !filterAssignee) return activeDefects;
    return activeDefects.filter((d) => String(d.assigned_to_id) === filterAssignee);
  }, [activeDefects, filterAssignee, isServerPaginated]);

  const filteredDefects = useMemo(() => {
    if (isServerPaginated || !selectedSubmodule) return filteredByAssignee;
    return filteredByAssignee.filter((d) => d.sub_module_name === selectedSubmodule);
  }, [filteredByAssignee, selectedSubmodule, isServerPaginated]);

  const totalPages = isServerPaginated
    ? totalPagesFromServer
    : (Math.ceil(filteredDefects.length / defectsPerPage) || 1);

  const paginatedDefects = isServerPaginated
    ? filteredDefects
    : filteredDefects.slice(
        (currentPage - 1) * defectsPerPage,
        currentPage * defectsPerPage
      );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAssignee, selectedSubmodule]);

  useEffect(() => {
    if (previousSubmodule && selectedSubmodule && previousSubmodule !== selectedSubmodule) {
      setSelectedDefects(new Set());
      setSelectedAssignee('');
      setError(null);
    }
    setPreviousSubmodule(selectedSubmodule);
  }, [selectedSubmodule]);

  const currentAssigneeIds = useMemo(() => {
    const ids = new Set<number>();
    const selectedDefectIds = Array.from(selectedDefects);
    
    selectedDefectIds.forEach((defectId) => {
      const defect = activeDefects.find(d => d.id === defectId);
      if (defect && defect.assigned_to_id) {
        ids.add(Number(defect.assigned_to_id));
      }
    });
    
    return ids;
  }, [selectedDefects, activeDefects]);

  useEffect(() => {
    if (!projectId || !selectedSubmodule) {
      setDevelopers([]);
      setSelectedAssignee('');
      return;
    }

    const fetchSubmoduleDevelopers = async () => {
      setSubmoduleDevsLoading(true);
      setError(null);
      try {
        const subModuleId = submoduleIdMap.get(selectedSubmodule);
        
        if (!subModuleId) {
          setDevelopers([]);
          setSubmoduleDevsLoading(false);
          return;
        }

        const subModuleDevRes = await getAllSubmoduleAllocatedDevBySubmoduleId(subModuleId);
        const projectDevsRaw = await getDevelopersWithRolesByProjectId(projectId);
        
        const assignedEmployeeIds = new Set(
          (subModuleDevRes?.data || []).map((d: any) => Number(d.employeeId))
        );
        
        const users = Array.isArray(projectDevsRaw) 
          ? projectDevsRaw 
          : projectDevsRaw?.data || projectDevsRaw?.users || [];
        
        const mappedUsers = users
          .map((user: any) => ({
            userId: user.employeeId || user.userId || user.id,
            userName: user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`.trim()
              : user.userName || user.name || 'Unknown User',
            empId: user.employeeId || user.userId || user.id,
          }))
          .filter((u: any) => u.userId && u.userName && assignedEmployeeIds.has(Number(u.userId)));
        
        setDevelopers(mappedUsers);
        setSelectedAssignee('');
      } catch (error) {
        console.error('Failed to fetch submodule developers:', error);
        setDevelopers([]);
        setError('Failed to load developers for this submodule');
      } finally {
        setSubmoduleDevsLoading(false);
      }
    };

    fetchSubmoduleDevelopers();
  }, [selectedSubmodule, projectId, submoduleIdMap]);

  const availableDevelopers = useMemo(() => {
    if (selectedDefects.size === 0) {
      return developers;
    }
    
    if (selectedDefects.size === 1) {
      return developers.filter(dev => !currentAssigneeIds.has(dev.userId));
    }
    
    if (currentAssigneeIds.size === 1) {
      return developers.filter(dev => !currentAssigneeIds.has(dev.userId));
    }
    
    return developers;
  }, [developers, currentAssigneeIds, selectedDefects.size]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allIds = paginatedDefects.map((d) => d.id);
      setSelectedDefects(new Set(allIds));
    } else {
      setSelectedDefects(new Set());
      setSelectedAssignee('');
    }
  };

  const handleSelectDefect = (defectId: number, checked: boolean | 'indeterminate') => {
    const newSet = new Set(selectedDefects);
    if (checked === true) {
      newSet.add(defectId);
    } else {
      newSet.delete(defectId);
    }
    setSelectedDefects(newSet);
    
    if (newSet.size === 0) {
      setSelectedAssignee('');
    }
  };

  const isAllSelected = paginatedDefects.length > 0 && 
    paginatedDefects.every((d) => selectedDefects.has(d.id));

  const resetAll = () => {
    setSelectedDefects(new Set());
    setSelectedAssignee('');
    setFilterAssignee('');
    setSelectedSubmodule('');
    setDevelopers([]);
    setError(null);
    setCurrentPage(1);
    setPreviousSubmodule('');
    setShowConfirmation(false);
    setPendingReassignData(null);
  };

  const performReassign = async (defectIds: number[], assigneeId: number) => {
    setSubmitting(true);
    setError(null);
    try {
      await onReassign(defectIds, assigneeId);
      resetAll();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Reassignment failed:', error);
      setError(error.message || 'Failed to reassign defects. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReassign = async () => {
    if (selectedDefects.size === 0) {
      setError('Please select at least one defect to reassign.');
      return;
    }

    if (!selectedAssignee) {
      setError('Please select a developer to reassign to.');
      return;
    }

    const assigneeId = parseInt(selectedAssignee);
    const defectIds = Array.from(selectedDefects);

    const alreadyAssigned = defectIds.some(defectId => {
      const defect = activeDefects.find(d => d.id === defectId);
      return defect && defect.assigned_to_id === assigneeId;
    });

    if (alreadyAssigned) {
      setConfirmationMessage('One or more selected defects are already assigned to this developer.\nDo you want to continue?');
      setPendingReassignData({ defectIds, assigneeId });
      setShowConfirmation(true);
      return;
    }

    await performReassign(defectIds, assigneeId);
  };

  const handleConfirmReassign = () => {
    setShowConfirmation(false);
    if (pendingReassignData) {
      performReassign(pendingReassignData.defectIds, pendingReassignData.assigneeId);
      setPendingReassignData(null);
    }
  };

  const handleCancelReassign = () => {
    setShowConfirmation(false);
    setPendingReassignData(null);
  };

  const developerOptions = availableDevelopers.map((dev) => ({
    value: dev.userId.toString(),
    label: dev.userName,
  }));

  const allDevelopersAssigned = selectedDefects.size > 0 && 
    developers.length > 0 && 
    availableDevelopers.length === 0;

  const reassignTotalCount = isServerPaginated ? totalElements : filteredDefects.length;

  if (!can.defect.edit) {
    return (
      <Card className="mb-6 border border-yellow-200 bg-yellow-50">
        <CardContent className="p-4 text-center text-yellow-700">
          You don't have permission to reassign defects.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`border border-blue-200 bg-blue-50/30 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Reassign Defects</h3>
              <p className="text-sm text-gray-500 mt-1">
                Select active defects and reassign them to a different developer
                <span className="ml-2 text-xs text-blue-600 font-medium">
                  ({activeDefects.length} active defects)
                </span>
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                resetAll();
                onClose();
              }}
              className="border-gray-300 hover:bg-gray-100"
            >
              Close
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
               {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Filter by Assigned Dev
              </label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-10"
              >
                <option value="">All assigned developers</option>
                {assignedDevOptions.map((dev) => (
                  <option key={dev.value} value={dev.value}>
                    {dev.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-400 mt-1 block">
                {assignedDevOptions.length} developer(s) assigned to defects
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Filter by Submodule
              </label>
              <select
                value={selectedSubmodule}
                onChange={(e) => {
                  if (selectedSubmodule && selectedSubmodule !== e.target.value) {
                    setSelectedDefects(new Set());
                    setSelectedAssignee('');
                  }
                  setSelectedSubmodule(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-10"
              >
                <option value="">All submodules</option>
                {projectSubmodules.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-400 mt-1 block">
                {projectSubmodules.length} submodule(s) available
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reassign To <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-10"
                disabled={submoduleDevsLoading || !selectedSubmodule || availableDevelopers.length === 0}
              >
                <option value="">
                  {!selectedSubmodule 
                    ? 'Select submodule first' 
                    : submoduleDevsLoading 
                      ? 'Loading developers...' 
                      : availableDevelopers.length === 0 
                        ? 'All developers already assigned' 
                        : 'Select developer'}
                </option>
                {developerOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {selectedSubmodule && (
                <span className="text-xs text-gray-400 mt-1 block">
                  {availableDevelopers.length} developer(s) available
                  {selectedDefects.size > 0 && currentAssigneeIds.size === 1 && availableDevelopers.length > 0 && (
                    <span className="ml-1 text-blue-600">
                      (current assignee excluded)
                    </span>
                  )}
                  {allDevelopersAssigned && (
                    <span className="ml-1 text-orange-600">
                      ⚠️ All developers already assigned to selected defects
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Button
              onClick={handleReassign}
              disabled={selectedDefects.size === 0 || !selectedAssignee || submitting || availableDevelopers.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {submitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Reassigning...
                </>
              ) : (
                `Reassign (${selectedDefects.size})`
              )}
            </Button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-10">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={paginatedDefects.length === 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Defect ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submodule
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                    Current Assignee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoadingDefects ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-500">Loading active defects...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedDefects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      {activeDefects.length === 0 
                        ? 'No active defects found to reassign.' 
                        : 'No defects match the selected filters.'}
                    </td>
                  </tr>
                ) : (
                  paginatedDefects.map((defect) => (
                    <tr key={defect.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedDefects.has(defect.id)}
                          onCheckedChange={(checked) => handleSelectDefect(defect.id, checked)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                        {defect.defectId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[180px] truncate" title={defect.description}>
                        {defect.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {defect.module_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {defect.sub_module_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {defect.assigned_to_name || 'Unassigned'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          (defect.defect_status_name || '').toUpperCase() === 'NEW' ? 'bg-green-100 text-green-800' :
                          (defect.defect_status_name || '').toUpperCase() === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                          (defect.defect_status_name || '').toUpperCase() === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          (defect.defect_status_name || '').toUpperCase() === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          (defect.defect_status_name || '').toUpperCase() === 'ON_HOLD' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {defect.defect_status_name || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-500">
              <span>
                {selectedDefects.size} of {reassignTotalCount} defects selected
                {!isServerPaginated && filteredDefects.length !== activeDefects.length && 
                  ` (filtered from ${activeDefects.length} active)`}
              </span>
              {selectedDefects.size > 0 && selectedAssignee && (
                <span className="ml-3 text-blue-600 font-medium">
                  ✓ Ready to reassign {selectedDefects.size} defect(s)
                </span>
              )}
              {selectedDefects.size > 0 && availableDevelopers.length === 0 && (
                <span className="ml-3 text-orange-600 font-medium">
                  ⚠️ No available developers to reassign
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>

                <select
                  value={defectsPerPage}
                  onChange={(e) => {
                    setDefectsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showConfirmation}
        message={confirmationMessage}
        onConfirm={handleConfirmReassign}
        onCancel={handleCancelReassign}
        confirmText="Continue"
        cancelText="Cancel"
        title="Confirm Reassign"
        type="warning"
      />
    </>
  );
};