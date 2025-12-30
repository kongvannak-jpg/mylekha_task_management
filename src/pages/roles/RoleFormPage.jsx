import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import { useTranslation } from 'react-i18next';
import ButtonSubmit from '../../components/layouts/buttons/ButtonSumit';

const RoleFormPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useRef(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        guard_name: 'web',
        selectedPermissions: []
    });

    // Group permissions by module/category
    const permissionGroups = [
        {
            module: 'Users',
            permissions: [
                { id: 1, name: 'view_users', label: 'View Users' },
                { id: 2, name: 'create_users', label: 'Create Users' },
                { id: 3, name: 'edit_users', label: 'Edit Users' },
                { id: 4, name: 'delete_users', label: 'Delete Users' }
            ]
        },
        {
            module: 'Roles',
            permissions: [
                { id: 5, name: 'view_roles', label: 'View Roles' },
                { id: 6, name: 'create_roles', label: 'Create Roles' },
                { id: 7, name: 'edit_roles', label: 'Edit Roles' },
                { id: 8, name: 'delete_roles', label: 'Delete Roles' }
            ]
        },
        {
            module: 'Content',
            permissions: [
                { id: 9, name: 'view_content', label: 'View Content' },
                { id: 10, name: 'create_content', label: 'Create Content' },
                { id: 11, name: 'edit_content', label: 'Edit Content' },
                { id: 12, name: 'delete_content', label: 'Delete Content' },
                { id: 13, name: 'publish_content', label: 'Publish Content' }
            ]
        },
        {
            module: 'Settings',
            permissions: [
                { id: 14, name: 'view_settings', label: 'View Settings' },
                { id: 15, name: 'edit_settings', label: 'Edit Settings' }
            ]
        }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(permissionId)
                ? prev.selectedPermissions.filter(id => id !== permissionId)
                : [...prev.selectedPermissions, permissionId]
        }));
    };

    const handleSelectAllInGroup = (groupPermissions) => {
        const groupIds = groupPermissions.map(p => p.id);
        const allSelected = groupIds.every(id => formData.selectedPermissions.includes(id));

        if (allSelected) {
            setFormData(prev => ({
                ...prev,
                selectedPermissions: prev.selectedPermissions.filter(id => !groupIds.includes(id))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                selectedPermissions: [...new Set([...prev.selectedPermissions, ...groupIds])]
            }));
        }
    };

    const handleSelectAll = () => {
        const allPermissionIds = permissionGroups.flatMap(group =>
            group.permissions.map(p => p.id)
        );

        if (formData.selectedPermissions.length === allPermissionIds.length) {
            setFormData(prev => ({ ...prev, selectedPermissions: [] }));
        } else {
            setFormData(prev => ({ ...prev, selectedPermissions: allPermissionIds }));
        }
    };

    const isGroupFullySelected = (groupPermissions) => {
        return groupPermissions.every(p => formData.selectedPermissions.includes(p.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Role name is required',
                life: 3000
            });
            return;
        }

        if (formData.selectedPermissions.length === 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select at least one permission',
                life: 3000
            });
            return;
        }

        console.log('Form submitted:', formData);

        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: id ? 'Role updated successfully' : 'Role created successfully',
            life: 3000
        });

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            navigate('/roles');
        }, 2000);
    };

    const allPermissionIds = permissionGroups.flatMap(group => group.permissions.map(p => p.id));
    const allSelected = formData.selectedPermissions.length === allPermissionIds.length;

    return (
        <div className="">
            <Toast ref={toast} />

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8">
                <h4 className='mb-5'>{id ? t('edit_role') : t('create_role')}</h4>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h5 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                            {t('basic_information')}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Role Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('role_name')} <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., Content Manager, Editor"
                                    className="w-full"
                                />
                            </div>

                            {/* Guard Name */}
                            <div>
                                <label htmlFor="guard_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('guard_name')}
                                </label>
                                <InputText
                                    id="guard_name"
                                    value={formData.guard_name}
                                    onChange={(e) => handleInputChange('guard_name', e.target.value)}
                                    placeholder="web"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                {t('permissions')} <span className="text-red-500">*</span>
                            </h5>
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
                                                    onChange={() => handleSelectAllInGroup(group.permissions)}
                                                    className="flex-shrink-0"
                                                />
                                                <label
                                                    htmlFor={`group-${index}`}
                                                    className="font-semibold cursor-pointer"
                                                >
                                                    {group.module}
                                                </label>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    ({group.permissions.filter(p => formData.selectedPermissions.includes(p.id)).length}/{group.permissions.length})
                                                </span>
                                            </div>
                                        }
                                        toggleable
                                        className="border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                            {group.permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center">
                                                    <Checkbox
                                                        inputId={`permission-${permission.id}`}
                                                        checked={formData.selectedPermissions.includes(permission.id)}
                                                        onChange={() => handlePermissionToggle(permission.id)}
                                                    />
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="ml-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300"
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

                        {/* Selected Permissions Summary */}
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-semibold">{formData.selectedPermissions.length}</span> {t('permissions_selected')}
                            </p>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse justify-end sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            label={t('cancel')}
                            severity="secondary"
                            outlined
                            onClick={() => navigate('/roles')}
                            className="w-full sm:w-auto"
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