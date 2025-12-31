import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import ButtonCreate from '../../components/layouts/buttons/ButtonCreate';
import { usersService } from '../../services/users.service';

const UsersPage = () => {
    const navigate = useNavigate();
    const menu = useRef(null);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        search: ''
    });

    const searchTimeout = useRef(null);

    useEffect(() => {
        loadUsers();
    }, [lazyParams]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await usersService.getAllUsers({
                page: lazyParams.page,
                limit: lazyParams.rows,
                search: lazyParams.search
            });

            const userArray = response.data?.data || [];
            setUsers(Array.isArray(userArray) ? userArray : []);

            if (response.data?.meta?.total) {
                setTotalRecords(response.data.meta.total);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

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

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            setLazyParams({
                ...lazyParams,
                first: 0,
                page: 1,
                search: value
            });
        }, 500);
    };

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Edit User',
                    icon: 'pi pi-pencil',
                    command: () => navigate(`/users/edit/${selectedUser?.id}`)
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

    // --- TEMPLATES ---
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

    const emailBodyTemplate = (rowData) => {
        if (loading) return <Skeleton width="10rem" />;
        return <span className="text-sm">{rowData.email}</span>;
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
                    className='text-gray-600 dark:text-gray-300 cursor-pointer p-2 hover:bg-gray-100 rounded-full'
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
                <h1 className="text-xl font-bold dark:text-white">Users Management</h1>

                <div className='flex items-center gap-2'>
                    {/* ✅ FIX 1: Search Input is NO LONGER hidden during loading */}
                    <div className="relative hidden md:block">
                        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <InputText
                            placeholder="Type here..."
                            onChange={onSearch}
                            className="pl-10 py-2 p-inputtext-sm rounded-lg bg-gray-50 border-none dark:bg-slate-700 dark:text-white w-64"
                        />
                    </div>

                    {/* Button can show skeleton if desired */}
                    {loading ? (
                        <Skeleton width="100px" height="2.5rem" className="rounded-lg" />
                    ) : (
                        <ButtonCreate
                            label="Add User"
                            onClick={() => navigate('/users/form')}
                        />
                    )}
                </div>
            </div>

            <div className="px-2">
                <DataTable
                    // If loading, create a dummy array of 10 items to show 10 skeletons
                    value={loading ? Array.from({ length: lazyParams.rows }) : users}
                    size="small"
                    responsiveLayout="scroll"
                    className="overflow-visible"

                    lazy={true}
                    paginator={true}
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={totalRecords}
                    onPage={onPage}

                    // ✅ FIX 2: Disable default spinner so Skeletons show clearly
                    loading={false}

                    rowsPerPageOptions={[5, 10, 20, 50]}
                    emptyMessage="No users found."
                    pt={{
                        header: { className: 'p-2 bg-transparent border-none' },
                        column: {
                            headerCell: { className: 'bg-gray-50 dark:bg-slate-700/50 p-3 text-sm' },
                            bodyCell: { className: 'p-3 border-b border-gray-100 dark:border-slate-700' }
                        }
                    }}
                >
                    <Column header="ID" body={idBodyTemplate} style={{ width: '5rem' }} />
                    <Column header="User" body={userBodyTemplate} />
                    <Column header="Email" body={emailBodyTemplate} />
                    <Column header="Action" body={actionBodyTemplate} style={{ width: '6rem' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default UsersPage;