
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Users, Bell, Search, Loader2, Save, CheckCircle, AlertCircle, Mail, Shield, MessageCircle, Smartphone, XCircle, Zap, Lock } from "lucide-react";
import { SimpleUser, ToastState } from "../types/emailConfiguration";
import { getAllEmailPointSetups, updateUserExtraPoints } from "../services/emailConfigurationApi";
import { getAllUsersSimple } from "../api/users/getallusers";
import { getViewAllocations } from "../api/bench/projectAllocation";
import { usePermission } from "../context/PermissionContext";

type NotificationChannel = 'none' | 'whatsapp' | 'email' | 'both';

export const UserPreferencesTab: React.FC = () => {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
  const [emailPoints, setEmailPoints] = useState<any[]>([]);
  const [roleBasedPoints, setRoleBasedPoints] = useState<Set<number>>(new Set());
  const [roleBasedChannels, setRoleBasedChannels] = useState<Map<number, string>>(new Map());
  const [userExtraPoints, setUserExtraPoints] = useState<Map<number, NotificationChannel>>(new Map());
  const [originalExtraPoints, setOriginalExtraPoints] = useState<Map<number, NotificationChannel>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRoles, setUserRoles] = useState<{ id: number; name: string }[]>([]);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const { can } = usePermission();
  const canAssign = can.employeeEmailRecipient?.assign;

  
  const IGNORED_TEMPLATES: string[] = [
    "EMPLOYEE_CREATED",
    "PASSWORD_RESET"
  ];

  
  const DISABLED_TEMPLATES: string[] = [];

  useEffect(() => {
    loadUsers();
    loadEmailPoints();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadUserNotificationPoints(selectedUser);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsersSimple();
      const userList = Array.isArray(data?.data?.content) ? data.data.content : [];
      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);
      showToast("Failed to load users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailPoints = async () => {
    try {
      const pointsData = await getAllEmailPointSetups();
      const filteredPoints = pointsData.filter((point: any) => {
        return !IGNORED_TEMPLATES.includes(point.eventType);
      });
      setEmailPoints(filteredPoints);
    } catch {
      showToast("Failed to load email points", "error");
    }
  };

  const loadUserNotificationPoints = async (user: SimpleUser) => {
    setLoading(true);
    try {
      
      const allocationsResponse = await getViewAllocations(user.id);
      const allocations = allocationsResponse?.data?.availablePeriods || [];
      
      const roles = [...new Map(allocations.map((alloc: any) => [alloc.roleId, alloc.roleName])).entries()]
        .filter(([id]) => id)
        .map(([id, name]) => ({ id: Number(id), name }));
      
      setUserRoles(roles);
      
      
      const allRoleChannels = new Map<number, string>();
      const allRolePoints = new Set<number>();
      
      const mockRoleChannels: Record<number, string> = { 1: 'email', 2: 'email', 3: 'in-app', 4: 'email' };
      Object.entries(mockRoleChannels).forEach(([pointId, channel]) => {
        const id = Number(pointId);
        allRolePoints.add(id);
        allRoleChannels.set(id, channel);
      });

      setRoleBasedPoints(allRolePoints);
      setRoleBasedChannels(allRoleChannels);

      const extraPointsMap = new Map<number, NotificationChannel>();
      extraPointsMap.set(1, 'email');
      extraPointsMap.set(2, 'email');

      setUserExtraPoints(extraPointsMap);
      setOriginalExtraPoints(new Map(extraPointsMap));
      
    } catch (error) {
      console.error("Error loading user notification points:", error);
      showToast("Failed to load notification settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExtraPointChange = (pointId: number, channel: NotificationChannel) => {
    const point = emailPoints.find(p => p.id === pointId);
    
    if (point && DISABLED_TEMPLATES.includes(point.eventType)) {
      if (channel === 'none') {
        showToast("This notification cannot be turned off - it's always enabled", "error");
        return;
      }
    }
    
    setUserExtraPoints(prev => {
      const newMap = new Map(prev);
      if (channel === 'none') {
        newMap.delete(pointId);
      } else {
        newMap.set(pointId, channel);
      }
      return newMap;
    });
  };

  const handleSave = async () => {
    if (!selectedUser) {
      showToast("Please select a user", "error");
      return;
    }

    setSaving(true);
    try {
      await updateUserExtraPoints(selectedUser.id, userExtraPoints);
      setOriginalExtraPoints(new Map(userExtraPoints));
      showToast("Preferences updated successfully", "success");
    } catch (error) {
      console.error("Error saving preferences:", error);
      showToast("Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (userExtraPoints.size !== originalExtraPoints.size) return true;
    for (const [id, channel] of userExtraPoints) {
      if (originalExtraPoints.get(id) !== channel) return true;
    }
    return false;
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const filteredUsers = users.filter((user) => {
    const name = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const filteredPoints = emailPoints.filter(point => {
    const search = searchTerm.toLowerCase();
    const eventLabel = point.eventType?.replaceAll("_", " ") || "";
    return eventLabel.toLowerCase().includes(search) || 
           (point.description || "").toLowerCase().includes(search);
  });

  const getIconForEvent = (eventType: string): string => {
    const iconMap: Record<string, string> = {
      'EMPLOYEE_ACTIVATED': '✅',
      'EMPLOYEE_DEACTIVATED': '⛔',
      'PROJECT_CREATED': '📁',
      'PROJECT_ALLOCATION': '🎯',
      'PROJECT_DEALLOCATION': '🚫',
      'MODULE_ALLOCATION': '📦',
      'SUBMODULE_ALLOCATION': '🔧',
      'DEFECT_CREATED': '🐛',
      'DEFECT_ASSIGNED': '📋',
      'DEFECT_REASSIGNED': '🔄',
      'DEFECT_UPDATED': '✏️',
      'PASSWORD_CHANGED': '🔒',
      'ACCOUNT_LOCKED': '🔐'
    };
    return iconMap[eventType] || '📧';
  };

  const getChannelDisplay = (pointId: number): string => {
    if (roleBasedChannels.has(pointId)) {
      const channel = roleBasedChannels.get(pointId);
      if (channel === 'whatsapp') return 'WhatsApp';
      if (channel === 'both') return 'Both';
      return 'Email';
    }
    if (roleBasedPoints.has(pointId)) return 'Email';
    return '';
  };

  const stats = {
    total: filteredPoints.length,
    roleBased: roleBasedPoints.size,
    extra: userExtraPoints.size,
    extraEmail: Array.from(userExtraPoints.values()).filter(c => c === 'email' || c === 'both').length,
    extraWhatsapp: Array.from(userExtraPoints.values()).filter(c => c === 'whatsapp' || c === 'both').length,
  };

  return (
    <div className="space-y-6">
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          toast.type === "success"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {toast.message}
        </div>
      )}

      {}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Notification Preferences</h1>
              <p className="text-gray-500 mt-1">Configure extra notifications for individual users</p>
            </div>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>{stats.extra} extra rules active</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-gray-50"
            />
          </div>
          <div className="sm:w-80">
            <Select
              value={selectedUser ? String(selectedUser.id) : ""}
              onValueChange={(val) => {
                const user = users.find((u) => String(u.id) === val);
                setSelectedUser(user || null);
              }}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl h-11">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-gray-50">
                {filteredUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{`${user.firstName} ${user.lastName}`}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedUser && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-semibold text-lg shadow-sm">
                {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                {userRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userRoles.map(role => (
                      <span key={role.id} className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {role.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {}
      {!selectedUser ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No User Selected</h3>
            <p className="text-gray-400">Please select a user from the dropdown above to configure notification preferences</p>
          </div>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
          <p className="text-gray-400 mt-3">Loading preferences...</p>
        </div>
      ) : (
        <>
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Role-based Rules</p>
                  <p className="text-2xl font-bold text-gray-700">{stats.roleBased}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Auto-assigned from roles • Cannot be changed</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Extra Rules</p>
                  <p className="text-2xl font-bold text-green-500">{stats.extra}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                <span className="text-blue-500">{stats.extraEmail}</span> email · 
                <span className="text-green-500 ml-1">{stats.extraWhatsapp}</span> whatsapp
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-700">Notification Events</h3>
              <p className="text-sm text-gray-400 mt-0.5">Role-based (auto) vs Extra notifications (configurable)</p>
            </div>

            <div className="divide-y divide-gray-50">
              {filteredPoints.map(point => {
                const pointId = point.id;
                const isRoleBased = roleBasedPoints.has(pointId);
                const isDisabled = DISABLED_TEMPLATES.includes(point.eventType);
                const currentExtraChannel = userExtraPoints.get(pointId) || (isDisabled ? 'email' : 'none');
                const isPointEnabled = point.isEnabled;
                const eventLabel = point.eventType?.replaceAll("_", " ") || "";
                const canEdit = !isRoleBased && isPointEnabled && canAssign;
                const roleChannelDisplay = getChannelDisplay(pointId);
                
                if (isRoleBased) {
                  return (
                    <div key={pointId} className="p-5 bg-blue-50/20">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            <div className="text-3xl">{getIconForEvent(point.eventType)}</div>
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-2 mb-1">
                                <h4 className="font-medium text-gray-700">{eventLabel}</h4>
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Shield className="w-3 h-3" /> Role-based
                                </span>
                                {!isPointEnabled && (
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Disabled</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">{point.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-auto">
                          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white shadow-sm">
                              <Lock className="w-3.5 h-3.5" />
                              {roleChannelDisplay === 'WhatsApp' ? (
                                <MessageCircle className="w-3.5 h-3.5 ml-1" />
                              ) : roleChannelDisplay === 'Both' ? (
                                <Smartphone className="w-3.5 h-3.5 ml-1" />
                              ) : (
                                <Mail className="w-3.5 h-3.5 ml-1" />
                              )}
                              <span className="hidden sm:inline">{roleChannelDisplay}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={pointId} className={`p-5 transition-all ${isDisabled ? 'bg-gray-100' : 'hover:bg-gray-50/50'} ${currentExtraChannel !== 'none' && !isDisabled ? 'bg-green-50/20' : ''}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{getIconForEvent(point.eventType)}</div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <h4 className="font-medium text-gray-700">{eventLabel}</h4>
                              {isDisabled ? (
                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Cannot Disable
                                </span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Bell className="w-3 h-3" /> Extra
                                </span>
                              )}
                              {!isPointEnabled && !isDisabled && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Disabled</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{point.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-auto">
                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                          {isDisabled ? (
                            <>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'whatsapp')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'whatsapp' ? 'bg-green-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'email')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'email' ? 'bg-blue-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Email</span>
                              </button>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'both')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'both' ? 'bg-purple-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Both</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'none')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'none' ? 'bg-gray-400 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">None</span>
                              </button>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'whatsapp')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'whatsapp' ? 'bg-green-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'email')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'email' ? 'bg-blue-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Email</span>
                              </button>
                              <button
                                onClick={() => handleExtraPointChange(pointId, 'both')}
                                disabled={!canEdit}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${currentExtraChannel === 'both' ? 'bg-purple-500 text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'} ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Both</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredPoints.length === 0 && (
                <div className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No notification events match your search</p>
                </div>
              )}
            </div>

            {}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-500">
                Role-based: <span className="font-medium text-gray-600">{stats.roleBased}</span> (Auto-assigned) | 
                Extra: <span className="font-medium text-gray-600">{stats.extra}</span> active
              </div>
              <Button 
                onClick={handleSave} 
                disabled={!selectedUser || saving || !hasChanges() || !canAssign}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow transition-all px-6"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {saving ? 'Saving Changes...' : 'Save Extra Rules'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};