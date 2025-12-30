import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Badge } from 'primereact/badge';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import ButtonCreate from '../../components/layouts/buttons/ButtonCreate';
import { Tag } from 'primereact/tag';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const navigate = useNavigate();
    const menu = useRef(null);
    const toast = useRef(null);

    const filterOptions = [
        { label: 'All Tasks', value: null },
        { label: 'Pending', value: 'Pending' },
        { label: 'Progress', value: 'Progress' },
        { label: 'Complete', value: 'Complete' },
        { label: 'Block', value: 'Block' }
    ];

    useEffect(() => {
        // Simulate an API call
        setLoading(true);
        setTimeout(() => {
            setTasks([
                { id: 1, task: 'Create Mid-Fidelity Wireframes', priority: 'P2', approval: 'Pending', startDate: 'Jun 29, 2025', dueDate: 'Jun 29, 2025' },
                { id: 2, task: 'Develop UI Component Library', priority: 'P1', approval: 'Complete', startDate: 'Oct 15 2025', dueDate: 'Oct 15 2025' },
                { id: 3, task: 'Run Usability Testing', priority: 'P3', approval: 'Progress', startDate: 'Mar 3 2025', dueDate: 'Mar 3 2025' },
                { id: 4, task: 'Design Responsive Layouts', priority: 'P1', approval: 'Block', startDate: 'Jun 20, 2025', dueDate: 'Jun 20, 2025' },
                { id: 5, task: 'Design Responsive Layouts', priority: 'P3', approval: 'Complete', startDate: 'Jun 20, 2025', dueDate: 'Jun 20, 2025' },
                { id: 6, task: 'Design Responsive Layouts', priority: 'P2', approval: 'Progress', startDate: 'Oct 15 2025', dueDate: 'Oct 15 2025' },
                { id: 7, task: 'Design Responsive Layouts', priority: 'P1', approval: 'Block', startDate: 'Mar 3 2025', dueDate: 'Mar 3 2025' },
                { id: 8, task: 'Design Responsive Layouts', priority: 'P1', approval: 'Pending', startDate: 'Oct 15 2025', dueDate: 'Oct 15 2025' },
                { id: 9, task: 'Design Responsive Layouts', priority: 'P2', approval: 'Complete', startDate: 'Jun 20, 2025', dueDate: 'Jun 20, 2025' },
                { id: 10, task: 'Design Responsive Layouts', priority: 'P3', approval: 'Complet', startDate: 'Mar 3 2025', dueDate: 'Mar 3 2025' },
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Edit Task',
                    icon: 'pi pi-pencil',
                    command: () => navigate(`/tasks/edit/${selectedTask?.id}`)
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    className: 'text-red-500',
                    command: () => handleDelete(selectedTask?.id)
                }
            ]
        }
    ];

    const handleDelete = (id) => {
        confirmDialog({
            message: 'Are you sure you want to delete this task? This action cannot be undone.',
            header: 'Delete Task Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                setTasks(tasks.filter(t => t.id !== id));
                toast.current.show({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Task deleted successfully',
                    life: 3000
                });
            },
            reject: () => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Task deletion cancelled',
                    life: 3000
                });
            }
        });
    };

    // Skeleton Templates
    const idBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="2rem" />;
        return <span className="text-sm text-gray-600 dark:text-gray-400">{rowData.id}</span>;
    };

    const taskBodyTemplate = (rowData) => {
        if (loading) {
            return <Skeleton width="12rem" />;
        }
        return (
            <span className="text-sm text-gray-800 dark:text-slate-200 font-medium">
                {rowData.task}
            </span>
        );
    };

    const priorityBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="3rem" />;

        const getPriorityColor = (priority) => {
            switch (priority) {
                case 'P1': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
                case 'P2': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
                case 'P3': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
                default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
            }
        };

        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rowData.priority)}`}>
                {rowData.priority}
            </span>
        );
    };

    const approvalBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="5rem" />;

        const getApprovalSeverity = (approval) => {
            switch (approval) {
                case 'Complete': return 'success';
                case 'Progress': return 'info';
                case 'Pending': return 'warning';
                case 'Block': return 'danger';
                default: return 'secondary';
            }
        };

        return (
            <Tag
                value={rowData.approval}
                severity={getApprovalSeverity(rowData.approval)}
                className="text-xs py-0"
            />
        );
    };

    const startDateBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="6rem" />;
        return <span className="text-sm text-gray-600 dark:text-gray-400">{rowData.startDate}</span>;
    };

    const dueDateBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="6rem" />;
        return <span className="text-sm text-gray-600 dark:text-gray-400">{rowData.dueDate}</span>;
    };

    const actionBodyTemplate = (rowData) => {
        if (loading) return <Skeleton shape="circle" size="1.5rem" className="mx-auto" />;
        return (
            <div className="flex justify-center gap-2">
                <button
                    onClick={(e) => {
                        setSelectedTask(rowData);
                        menu.current.toggle(e);
                    }}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer"
                    title="More options"
                >
                    <i className="pi pi-ellipsis-v text-sm"></i>
                </button>
            </div>
        );
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = !selectedFilter || task.approval === selectedFilter;
        const matchesSearch = !globalFilter ||
            task.task.toLowerCase().includes(globalFilter.toLowerCase()) ||
            task.priority.toLowerCase().includes(globalFilter.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="bg-white py-3 dark:bg-slate-800 shadow-sm rounded-lg border border-gray-100 dark:border-slate-700">
            <Toast ref={toast} />
            <ConfirmDialog />
            <Menu model={items} popup ref={menu} id="popup_menu" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-4">
                <div className="flex items-center gap-3">
                    {loading ? (
                        <Skeleton width="12rem" height="2rem" />
                    ) : (
                        <>
                            <h1 className="text-xl font-bold dark:text-white">All Tasks</h1>
                        </>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        {loading ? (
                            <Skeleton width="200px" height="2.5rem" className="rounded-lg" />
                        ) : (
                            <>
                                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <InputText
                                    placeholder="Search..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="pl-10 py-2 p-inputtext-sm rounded-lg bg-gray-50 border-none dark:bg-slate-700 dark:text-white w-full sm:w-64"
                                />
                            </>
                        )}
                    </div>

                    {loading ? (
                        <Skeleton width="100px" height="2.5rem" className="rounded-lg" />
                    ) : (
                        <Dropdown
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.value)}
                            options={filterOptions}
                            placeholder="Filter"
                            dropdownIcon="pi pi-filter"
                            className="p-inputtext-sm w-full sm:w-auto"
                            pt={{
                                root: { className: 'bg-gray-50 h-[37px] dark:bg-slate-700 border-none' }
                            }}
                        />
                    )}

                    {loading ? (
                        <Skeleton width="100px" height="2.5rem" className="rounded-lg" />
                    ) : (
                        <ButtonCreate
                            label="Add Task"
                            onClick={() => navigate('/tasks/form')}
                        />
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="px-2">
                <DataTable
                    value={loading ? Array.from({ length: 10 }) : filteredTasks}
                    size="small"
                    responsiveLayout="scroll"
                    paginator={!loading}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    className="overflow-visible"
                    emptyMessage="No tasks found"
                    pt={{
                        header: { className: 'p-2 bg-transparent border-none' },
                        column: {
                            headerCell: { className: 'bg-gray-50 dark:bg-slate-700/50 p-3 text-sm font-semibold text-gray-700 dark:text-gray-300' },
                            bodyCell: { className: 'p-3 border-b border-gray-100 dark:border-slate-700' }
                        },
                        paginator: {
                            root: { className: 'bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700' }
                        }
                    }}
                >
                    <Column
                        header=""
                        body={idBodyTemplate}
                        style={{ width: '3rem' }}
                    />
                    <Column
                        header="Task"
                        body={taskBodyTemplate}
                        style={{ minWidth: '15rem' }}
                    />
                    <Column
                        header="Priority"
                        body={priorityBodyTemplate}
                        style={{ width: '6rem' }}
                    />
                    <Column
                        header="Approval"
                        body={approvalBodyTemplate}
                        style={{ width: '8rem' }}
                    />
                    <Column
                        header="Start Date"
                        body={startDateBodyTemplate}
                        style={{ width: '10rem' }}
                    />
                    <Column
                        header="Due Date"
                        body={dueDateBodyTemplate}
                        style={{ width: '10rem' }}
                    />
                    <Column
                        header="Action"
                        body={actionBodyTemplate}
                        style={{ width: '6rem' }}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default TasksPage;