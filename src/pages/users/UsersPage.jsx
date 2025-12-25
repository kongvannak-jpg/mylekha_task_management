import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import ButtonCreate from '../../components/layouts/buttons/ButtonCreate';
import { InputText } from 'primereact/inputtext';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const menu = useRef(null);

    useEffect(() => {
        setUsers([
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        ]);
    }, []);

    // 1. Define the Menu Items with Navigation
    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Edit User',
                    icon: 'pi pi-pencil',
                    command: () => navigate(`/users/edit/${selectedUser.id}`)
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    className: 'text-red-500', // Styling for delete action
                    command: () => handleDelete(selectedUser.id)
                }
            ]
        }
    ];

    const handleDelete = (id) => {
        if (window.confirm("Delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex justify-center">
                <button onClick={(e) => {
                    setSelectedUser(rowData);
                    menu.current.toggle(e);
                }} className='text-gray-600 dark:text-gray-300 cursor-pointer'><i className="pi pi-ellipsis-v"></i></button>
            </div>
        );
    };

    return (
        <div className="bg-white py-3 dark:bg-slate-800 shadow-[0_4px_20px_rgba(255,255,255,0.1) rounded">
            {/* 2. Place Menu outside table to avoid overflow clipping */}
            <Menu model={items} popup ref={menu} id="popup_menu" appendTo="self" />

            <div className="flex justify-between items-center mb-6 px-3 ">
                <h1 className="text-xl font-bold dark:text-white">Users Management</h1>
                <div className='flex'>
                    <div className="relative hidden md:block mr-2">
                        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <InputText placeholder="Type here..." className="!pl-10 !py-2 p-inputtext-sm rounded-lg bg-gray-50 border-none dark:bg-slate-700 dark:text-white" />
                    </div>
                    <ButtonCreate
                        label="Add User"
                        onClick={() => navigate('/users/form')}
                    />
                </div>
            </div>

            <div className="rounded-xl shadow-ld  overflow-visible">
                <DataTable value={users} size="small" responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    pt={{
                        header: { className: 'p-2' },
                        bodyRow: { className: 'p-0' },
                        column: {
                            headerCell: { className: 'p-2' },
                            bodyCell: { className: 'p-2' }
                        }
                    }}>
                    <Column field="id" header="ID" style={{ width: '5rem' }} />
                    <Column header="User" body={(row) => (
                        <div className="flex items-center gap-2">
                            {/* <Avatar label={row.name.charAt(0)} shape="circle" className="bg-emerald-100 text-emerald-700" /> */}
                            <span className="font-medium dark:text-slate-200">{row.name}</span>
                        </div>
                    )} />
                    <Column field="email" header="Email" />
                    <Column header="Action" body={actionTemplate} style={{ width: '6rem' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default UsersPage;