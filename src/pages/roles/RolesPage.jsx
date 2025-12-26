import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton'; // Import Skeleton
import ButtonCreate from '../../components/layouts/buttons/ButtonCreate';
import { useTranslation } from 'react-i18next';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

const RolesPage = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // 1. Add loading state
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const menu = useRef(null);

    useEffect(() => {
        // Simulate an API call
        setLoading(true);
        setTimeout(() => {
            setUsers([
                { id: 1, name: 'Admin', permissions: 15 },
                { id: 2, name: 'User', permissions: 7 },
                { id: 3, name: 'Editor', permissions: 3 },
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Permissions',
                    icon: 'pi pi-shield',
                    command: () => navigate(`/roles/permissions/${selectedUser?.id}`)
                },
                {
                    label: 'Edit User',
                    icon: 'pi pi-pencil',
                    command: () => navigate(`/roles/edit/${selectedUser?.id}`)
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    className: 'text-red-500',
                    command: () => handleDelete(selectedUser?.id)
                }
            ]
        }
    ];

    const handleDelete = (id) => {
        if (window.confirm("Delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    // 2. Define Skeleton Templates for Columns
    const idBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="2rem" />;
        return rowData.id;
    };

    const userBodyTemplate = (rowData) => {
        if (loading) {
            return (
                <div className="flex items-center gap-2">
                    <Skeleton shape="circle" size="2rem" />
                    <Skeleton width="6rem" />
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm dark:text-slate-200">{rowData.name}</span>
            </div>
        );
    };

    const permissionsBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="10rem" />;
        return <Tag severity="success" className='px-5 py-[1px] bg-emerald-50 dark:bg-blue-50 dark:text-blue-800 text-emerald-800 rounded-2xl' value={rowData.permissions}></Tag>

    };

    const actionBodyTemplate = (rowData) => {
        if (loading) return <Skeleton shape="circle" size="1.5rem" className="mx-auto" />;
        return (
            <div className="flex justify-center">
                <button
                    onClick={(e) => {
                        setSelectedUser(rowData);
                        menu.current.toggle(e);
                    }}
                    className='text-gray-600 dark:text-gray-300 cursor-pointer'
                >
                    <i className="pi pi-ellipsis-v"></i>
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white py-3 dark:bg-slate-800 shadow-sm rounded-lg border border-gray-100 dark:border-slate-700">
            <Menu model={items} popup ref={menu} id="popup_menu" />
            <div className="flex justify-between items-center mb-6 px-4">
                {loading ? (
                    <Skeleton width="12rem" height="2rem" />
                ) : (
                    <h1 className="text-xl font-bold dark:text-white">{t('roles')}</h1>
                )}

                <div className='flex items-center gap-2'>
                    <div className="relative hidden md:block">
                        {loading ? (
                            <Skeleton width="200px" height="2.5rem" className="rounded-lg" />
                        ) : (
                            <>
                                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <InputText
                                    placeholder={t('type_to_search')}
                                    className="pl-10 py-2 p-inputtext-sm rounded-lg bg-gray-50 border-none dark:bg-slate-700 dark:text-white w-64"
                                />
                            </>
                        )}
                    </div>
                    {loading ? (
                        <Skeleton width="100px" height="2.5rem" className="rounded-lg" />
                    ) : (
                        <ButtonCreate
                            label={t('new_role')}
                            onClick={() => navigate('/roles/form')}
                        />
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="px-2">
                <DataTable
                    value={loading ? Array.from({ length: 5 }) : users}
                    size="small"
                    responsiveLayout="scroll"
                    paginator={!loading}
                    rows={5}
                    className="overflow-visible"
                    pt={{
                        header: { className: 'p-2 bg-transparent border-none' },
                        column: {
                            headerCell: { className: 'bg-gray-50 dark:bg-slate-700/50 p-3 text-sm' },
                            bodyCell: { className: 'p-3 border-b border-gray-100 dark:border-slate-700' }
                        }
                    }}
                >
                    <Column header="ID" body={idBodyTemplate} style={{ width: '5rem' }} />
                    <Column header={t('name')} body={userBodyTemplate} />
                    <Column header={t('permissions')} body={permissionsBodyTemplate} />
                    <Column header={t('actions')} body={actionBodyTemplate} style={{ width: '6rem' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default RolesPage;