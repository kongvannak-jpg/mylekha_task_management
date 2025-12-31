import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import { Skeleton } from 'primereact/skeleton';
import { useTranslation } from 'react-i18next';
import ButtonSubmit from '../../components/layouts/buttons/ButtonSumit';

// ✅ Import Service
import { rolesService } from '../../services/roles.service';

const RoleFormPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams(); // If ID exists, we are in "Edit Mode"
    const toast = useRef(null);

    // --- STATE ---
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Data Storage
    const [permissionGroups, setPermissionGroups] = useState([]); // For UI Grouping
    const [flatPermissions, setFlatPermissions] = useState([]);   // For ID<->Name lookup

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        guard_name: 'api',
        selectedPermissions: [] // We store IDs here for the UI checkboxes
    });

    // --- 1. LOAD DATA ON MOUNT ---
    useEffect(() => {
        loadPageData();
    }, [id]);

    const loadPageData = async () => {
        setIsLoading(true);
        try {
            // A. Fetch All Available Permissions (Reference List)
            const permsResponse = await rolesService.getAllPermissions();
            const responseBody = permsResponse.data || permsResponse;
            const allPerms = Array.isArray(responseBody) ? responseBody : (responseBody.data || []);

            setFlatPermissions(allPerms);
            setPermissionGroups(groupPermissionsByModule(allPerms));

            // B. If Editing, Fetch Role & Assigned Permissions
            if (id) {
                // 1. Get Role Details
                const roleResponse = await rolesService.getRoleById(id);
                const roleData = roleResponse.data?.data || roleResponse.data || roleResponse;

                // 2. Get Assigned Permissions (RPC returns Names: ["view:user", "create:task"])
                let currentPermissionIDs = [];
                try {
                    const rpcResponse = await rolesService.getRolePermissions(id);
                    const rpcData = rpcResponse.data || rpcResponse;

                    // The API returns { permissions: ["view:user", ...] }
                    const assignedNames = rpcData.permissions || [];

                    // ✅ MAP NAMES TO IDs: UI needs IDs to check the boxes
                    currentPermissionIDs = allPerms
                        .filter(p => assignedNames.includes(p.name))
                        .map(p => p.id);

                } catch (rpcError) {
                    console.warn("RPC fetch failed, falling back to role object");
                    // Fallback if permissions came nested in the role object
                    if (roleData.permissions) {
                        currentPermissionIDs = roleData.permissions.map(p => p.id);
                    }
                }

                setFormData({
                    name: roleData.name,
                    guard_name: roleData.guard_name || 'web',
                    selectedPermissions: currentPermissionIDs
                });
            }
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not load data.' });
        } finally {
            setIsLoading(false);
        }
    };

    // --- HELPER: Group Permissions Dynamically ---
    const groupPermissionsByModule = (permissions) => {
        const groups = {};
        permissions.forEach(p => {
            let moduleName = 'General';
            let label = p.name;

            // Logic to split "view:user" -> Module: "User"
            if (p.name.includes(':')) {
                const parts = p.name.split(':');
                if (parts.length > 1) moduleName = parts[1];
                label = p.name.replace(/:/g, ' ');
            } else if (p.name.includes('.')) {
                const parts = p.name.split('.');
                if (parts.length > 0) moduleName = parts[0];
                label = p.name;
            } else if (p.name.includes('_')) {
                const parts = p.name.split('_');
                if (parts.length > 1) moduleName = parts.slice(1).join(' ');
                label = p.name.replace(/_/g, ' ');
            }

            moduleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

            if (!groups[moduleName]) groups[moduleName] = [];
            groups[moduleName].push({ id: p.id, name: p.name, label: label });
        });
        return Object.keys(groups).sort().map(key => ({ module: key, permissions: groups[key] }));
    };

    // --- HANDLERS ---
    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(permissionId)
                ? prev.selectedPermissions.filter(pid => pid !== permissionId)
                : [...prev.selectedPermissions, permissionId]
        }));
    };

    const handleSelectAllInGroup = (groupPermissions) => {
        const groupIds = groupPermissions.map(p => p.id);
        const allSelected = groupIds.every(id => formData.selectedPermissions.includes(id));
        setFormData(prev => ({
            ...prev,
            selectedPermissions: allSelected
                ? prev.selectedPermissions.filter(id => !groupIds.includes(id))
                : [...new Set([...prev.selectedPermissions, ...groupIds])]
        }));
    };

    const handleSelectAll = () => {
        const allIds = flatPermissions.map(p => p.id);
        setFormData(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.length === allIds.length ? [] : allIds
        }));
    };

    const isGroupFullySelected = (groupPermissions) => groupPermissions.every(p => formData.selectedPermissions.includes(p.id));
    const allSelected = flatPermissions.length > 0 && formData.selectedPermissions.length === flatPermissions.length;

    // --- SUBMIT LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Role name is required' });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                name: formData.name,
                guard_name: formData.guard_name,
            };

            let roleId = id;

            // 1. Save Role Basic Info
            if (id) {
                await rolesService.updateRole(id, payload);
            } else {
                const response = await rolesService.createRole(payload);
                const responseData = response.data || response;
                roleId = responseData.id || responseData.data?.id;
            }

            // 2. Sync Permissions (RPC)
            if (roleId) {
                // ✅ MAP IDs TO NAMES: API expects names ["view:user", ...]
                const permissionNames = flatPermissions
                    .filter(p => formData.selectedPermissions.includes(p.id))
                    .map(p => p.name);

                // Call the service (which now sends { "id": roleId, "permissions": [...] })
                await rolesService.syncPermissions(roleId, permissionNames);
            }

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: id ? 'Role updated!' : 'Role created!',
                life: 2000
            });

            setTimeout(() => navigate('/roles'), 1000);

        } catch (error) {
            console.error("Submit Error:", error);
            const msg = error.response?.data?.message || error.message || "Operation failed";
            toast.current.show({ severity: 'error', summary: 'Error', detail: msg });
        } finally {
            setIsSaving(false);
        }
    };

    // --- LOADING VIEW ---
    if (isLoading) {
        return (
            <div className="p-6">
                <Skeleton width="100%" height="4rem" className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Skeleton height="3rem" />
                    <Skeleton height="3rem" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton height="12rem" />
                    <Skeleton height="12rem" />
                    <Skeleton height="12rem" />
                </div>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="">
            <Toast ref={toast} />
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8">
                <h4 className='mb-5 text-xl font-bold dark:text-white'>{id ? t('edit_role') : t('create_role')}</h4>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    {t('role_name')} <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    {t('guard_name')}
                                </label>
                                <InputText
                                    value={formData.guard_name}
                                    disabled
                                    className="w-full bg-slate-100 dark:bg-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-semibold text-slate-800 dark:text-white">{t('permissions')} <span className="text-red-500">*</span></h5>
                            <Button
                                type="button"
                                label={allSelected ? t('deselect_all') : t('select_all')}
                                size="small"
                                text
                                onClick={handleSelectAll}
                            />
                        </div>

                        <div className="space-y-4">
                            {permissionGroups.map((group, index) => {
                                const isFullySelected = isGroupFullySelected(group.permissions);
                                return (
                                    <Panel
                                        key={index}
                                        header={
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    inputId={`group-${index}`}
                                                    checked={isFullySelected}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectAllInGroup(group.permissions);
                                                    }}
                                                />
                                                <label className="font-semibold cursor-pointer text-slate-700 dark:text-slate-200">
                                                    {group.module}
                                                </label>
                                                <span className="text-sm text-slate-500">
                                                    ({group.permissions.filter(p => formData.selectedPermissions.includes(p.id)).length}/{group.permissions.length})
                                                </span>
                                            </div>
                                        }
                                        toggleable
                                        collapsed={!isFullySelected && formData.selectedPermissions.length > 0}
                                        className="border border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                            {group.permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <Checkbox
                                                        inputId={`permission-${permission.id}`}
                                                        checked={formData.selectedPermissions.includes(permission.id)}
                                                        onChange={() => handlePermissionToggle(permission.id)}
                                                    />
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="ml-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 select-none flex-1"
                                                        title={permission.name}
                                                    >
                                                        {permission.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>
                                );
                            })}
                        </div>
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-semibold">{formData.selectedPermissions.length}</span> {t('permissions_selected')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse justify-end sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            label={t('cancel')}
                            severity="secondary"
                            outlined
                            onClick={() => navigate('/roles')}
                            className="w-full sm:w-auto"
                            type="button"
                        />
                        <ButtonSubmit
                            label={id ? t('update_role') : t('create_role')}
                            loading={isSaving}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleFormPage;