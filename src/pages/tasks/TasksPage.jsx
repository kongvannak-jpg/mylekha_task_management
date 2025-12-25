import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ProgressBar } from 'primereact/progressbar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Menu } from 'primereact/menu';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const taskTableData = [
    { id: 1, task: 'Create Mid-Fidelity Wireframes', teamMembers: ['M', 'P', 'B'], deadline: 'Jun 20, 2025', priority: 'Priority 1', priorityColor: 'danger', status: 'Completed', statusColor: 'success', progress: 100 },
    { id: 2, task: 'Develop UI Component Library', teamMembers: ['P', 'M'], deadline: 'Jun 29, 2025', priority: 'Priority 2', priorityColor: 'warning', status: 'In Progress', statusColor: 'info', progress: 70 },
    { id: 3, task: 'Run Usability Testing', teamMembers: ['B', 'P'], deadline: 'Oct 15 2025', priority: 'Priority 3', priorityColor: 'info', status: 'Completed', statusColor: 'success', progress: 100 },
    { id: 4, task: 'Design Responsive Layouts', teamMembers: ['L', 'O'], deadline: 'Mar 3 2025', priority: 'Priority 1', priorityColor: 'danger', status: 'Up Coming', statusColor: 'danger', progress: 76 },
    { id: 5, task: 'Document Design Guidelines', teamMembers: ['M', 'H', 'B'], deadline: 'Jun 20, 2025', priority: 'Priority 3', priorityColor: 'info', status: 'In Progress', statusColor: 'info', progress: 20 },
];

export default function TasksPage() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const menu = useRef(null);

    const menuItems = [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
                console.log('Edit clicked');
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                console.log('Delete clicked');
            }
        }
    ];

    const getAvatarColor = (letter) => {
        const colors = {
            'M': '#ef4444',
            'P': '#3b82f6',
            'B': '#8b5cf6',
            'H': '#10b981',
            'L': '#6b7280',
            'O': '#f59e0b'
        };
        return colors[letter] || '#6b7280';
    };

    const teamMembersTemplate = (rowData) => {
        return (
            <AvatarGroup>
                {rowData.teamMembers.map((member, idx) => (
                    <Avatar
                        key={idx}
                        label={member}
                        size="normal"
                        style={{
                            backgroundColor: getAvatarColor(member),
                            color: '#ffffff'
                        }}
                        shape="circle"
                    />
                ))}
            </AvatarGroup>
        );
    };

    const priorityTemplate = (rowData) => {
        return (
            <Badge
                value={rowData.priority}
                severity={rowData.priorityColor}
            />
        );
    };

    const statusTemplate = (rowData) => {
        return (
            <Badge
                value={rowData.status}
                severity={rowData.statusColor}
            />
        );
    };

    const progressTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <ProgressBar
                    value={rowData.progress}
                    style={{ width: '100px', height: '8px' }}
                    showValue={false}
                />
                <span className="text-sm font-semibold">{rowData.progress}%</span>
            </div>
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-ellipsis-v"
                    rounded
                    text
                    severity="secondary"
                    onClick={(e) => menu.current.toggle(e)}
                    aria-controls="action-menu"
                    aria-haspopup
                />
                <Menu
                    model={menuItems}
                    popup
                    ref={menu}
                    id="action-menu"
                />
            </>
        );
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Header */}
            <div className="bg-white border-bottom px-4 py-3">
                <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between gap-3">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-list text-xl"></i>
                        <h2 className="text-xl font-semibold m-0">All Tasks</h2>
                    </div>

                    <div className="flex flex-column sm:flex-row align-items-stretch sm:align-items-center gap-2 w-full md:w-auto">
                        <span className="p-input-icon-left w-full sm:w-auto">
                            <i className="pi pi-search" />
                            <InputText placeholder="Search..." size="small" className="w-full" />
                        </span>
                        <Button
                            label="Filter"
                            icon="pi pi-filter"
                            outlined
                            size="small"
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>

            {/* Task Table */}
            <div >
                <Card>
                    <div style={{ overflowX: 'auto' }} className='p-5'>
                        <DataTable
                            value={taskTableData}
                            stripedRows
                            showGridlines
                            responsiveLayout="scroll"
                            breakpoint="960px"
                            style={{ minWidth: '800px' }}
                        >
                            <Column field="task" header="Task" style={{ minWidth: '200px' }}></Column>
                            <Column
                                field="teamMembers"
                                header="Team Members"
                                body={teamMembersTemplate}
                                style={{ minWidth: '150px' }}
                            ></Column>
                            <Column field="deadline" header="Deadline" style={{ minWidth: '120px' }}></Column>
                            <Column
                                field="priority"
                                header="Priority"
                                body={priorityTemplate}
                                style={{ minWidth: '120px' }}
                            ></Column>
                            <Column
                                field="status"
                                header="Status"
                                body={statusTemplate}
                                style={{ minWidth: '120px' }}
                            ></Column>
                            <Column
                                field="progress"
                                header="Progress"
                                body={progressTemplate}
                                style={{ minWidth: '150px' }}
                            ></Column>
                            <Column
                                header="Action"
                                body={actionTemplate}
                                style={{ minWidth: '80px', width: '80px' }}
                            ></Column>
                        </DataTable>
                    </div>

                    <div className="flex flex-column md:flex-row align-items-center justify-content-between mt-3 gap-3">
                        <span className="text-sm text-gray-600">Showing 1-5 from 28</span>
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={28}
                            onPageChange={onPageChange}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}