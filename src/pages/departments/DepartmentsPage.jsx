import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import ButtonCreate from '../../components/layouts/buttons/ButtonCreate';
import { departmentsService } from '../../services/departments.service';
import { useTranslation } from 'react-i18next';

const DepartmentsPage = () => {
    const navigate = useNavigate();
    const menu = useRef(null);
    const toast = useRef(null);
    const { t } = useTranslation();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        search: ''
    });

    const searchTimeout = useRef(null);

    // --- MENU ACTIONS (Edit / Delete) ---
    const menuItems = [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
                if (selectedDepartment) {
                    navigate(`/departments/edit/${selectedDepartment.id}`);
                }
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            className: 'text-red-500',
            command: () => {
                if (selectedDepartment) {
                    confirmDelete(selectedDepartment);
                }
            }
        }
    ];

    // --- LOAD DATA ---
    useEffect(() => {
        loadDepartments();
    }, [lazyParams]);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const filters = {
                page: lazyParams.page,
                limit: lazyParams.rows,
                search: lazyParams.search
            };

            const response = await departmentsService.getAllDepartments(filters);

            // Handle { data: [...] } or { data: { data: [...] } }
            const responseData = response.data?.data || response.data || [];
            const departArray = Array.isArray(responseData) ? responseData : (responseData.data || []);

            setDepartments(departArray);
            setTotalRecords(response.data?.meta?.total || response.data?.total || 0);

        } catch (error) {
            console.error("Failed to load departments:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    const onPage = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page + 1
        });
    };

    const onSearch = (e) => {
        const value = e.target.value;
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            setLazyParams({ ...lazyParams, first: 0, page: 1, search: value });
        }, 500);
    };

    const confirmDelete = (department) => {
        confirmDialog({
            message: `Are you sure you want to delete "${department.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await departmentsService.deleteDepartment(department.id);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Department deleted', life: 3000 });
                    loadDepartments(); // Refresh list
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
                }
            }
        });
    };

    // --- TEMPLATES ---
    const idBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="2rem" />;
        return rowData.id;
    };

    const codeBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="4rem" />;
        return <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">{rowData.code}</span>;
    };

    const nameBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="8rem" />;
        return <span className="font-medium text-slate-700 dark:text-slate-200">{rowData.name}</span>;
    };

    const actionBodyTemplate = (rowData) => {
        if (loading) return <Skeleton shape="circle" size="2rem" className="mx-auto" />;

        return (
            <div className="flex justify-center">
                <Button
                    icon="pi pi-ellipsis-v"
                    rounded
                    text
                    severity="secondary"
                    onClick={(event) => {
                        setSelectedDepartment(rowData);
                        menu.current.toggle(event);
                    }}
                />
            </div>
        );
    };

    return (
        <div className="bg-white py-4 dark:bg-slate-800 shadow-sm rounded-lg border border-gray-100 dark:border-slate-700">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Context Menu for Actions */}
            <Menu model={menuItems} popup ref={menu} id="popup_menu" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-4 gap-4">
                <h1 className="text-xl font-bold dark:text-white">{t('departments')}</h1>

                <div className='flex items-center gap-3 w-full md:w-auto'>
                    <div className="relative flex-1 md:flex-none">
                        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <InputText
                            placeholder={t('search_placeholder')}
                            onChange={onSearch}
                            className="pl-10 py-2 p-inputtext-sm rounded-lg bg-gray-50 border-none dark:bg-slate-700 dark:text-white w-full md:w-64"
                        />
                    </div>

                    <ButtonCreate
                        label={t('new_department')}
                        onClick={() => navigate('/departments/form')}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="px-2">
                <DataTable
                    value={loading ? Array.from({ length: lazyParams.rows }) : departments}
                    size="small"
                    responsiveLayout="scroll"
                    lazy={true}
                    paginator={true}
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    loading={false}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    emptyMessage="No departments found."
                    pt={{
                        header: { className: 'p-2 bg-transparent border-none' },
                        column: {
                            headerCell: { className: 'bg-gray-50 dark:bg-slate-700/50 p-3 text-sm font-semibold text-slate-600 dark:text-slate-300' },
                            bodyCell: { className: 'p-3 border-b border-gray-100 dark:border-slate-700' }
                        }
                    }}
                >
                    <Column header="ID" body={idBodyTemplate} style={{ width: '4rem' }} />
                    <Column header={t('code')} body={codeBodyTemplate} style={{ width: '8rem' }} />
                    <Column header={t('name')} body={nameBodyTemplate} />
                    <Column header="Action" body={actionBodyTemplate} style={{ width: '6rem', textAlign: 'center' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default DepartmentsPage;