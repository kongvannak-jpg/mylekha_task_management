import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { useTranslation } from 'react-i18next';
import ButtonSubmit from '../../components/layouts/buttons/ButtonSumit';
import { Tag } from 'primereact/tag';

const TaskFormPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showMemberDialog, setShowMemberDialog] = useState(false);
    const [showChecklistDialog, setShowChecklistDialog] = useState(false);
    const [showTagDialog, setShowTagDialog] = useState(false);

    const [formData, setFormData] = useState({
        taskName: '',
        list: 'To Do',
        description: '',
        priority: null,
        status: null,
        startDate: null,
        deadline: null,
        approved: null,
        assignedMembers: [],
        tags: [],
        checklist: []
    });

    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [newTag, setNewTag] = useState('');

    const lists = [
        { label: 'To Do', value: 'To Do' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Done', value: 'Done' }
    ];

    const priorities = [
        { label: 'P1', value: 'P1' },
        { label: 'P2', value: 'P2' },
        { label: 'P3', value: 'P3' }
    ];

    const statuses = [
        { label: 'Pending', value: 'Pending' },
        { label: 'Progress', value: 'Progress' },
        { label: 'Complete', value: 'Complete' },
        { label: 'Block', value: 'Block' }
    ];

    const approvalOptions = [
        { label: 'Approved', value: 'Approved' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    const availableMembers = [
        { id: 1, name: 'John Doe', avatar: null, color: 'bg-emerald-500' },
        { id: 2, name: 'Jane Smith', avatar: null, color: 'bg-orange-500' },
        { id: 3, name: 'Mike Johnson', avatar: null, color: 'bg-yellow-500' },
        { id: 4, name: 'Sarah Wilson', avatar: null, color: 'bg-blue-500' },
        { id: 5, name: 'Tom Brown', avatar: null, color: 'bg-purple-500' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMemberToggle = (member) => {
        setFormData(prev => ({
            ...prev,
            assignedMembers: prev.assignedMembers.find(m => m.id === member.id)
                ? prev.assignedMembers.filter(m => m.id !== member.id)
                : [...prev.assignedMembers, member]
        }));
    };

    const addChecklistItem = () => {
        if (newChecklistItem.trim()) {
            setFormData(prev => ({
                ...prev,
                checklist: [...prev.checklist, { id: Date.now(), text: newChecklistItem, completed: false }]
            }));
            setNewChecklistItem('');
        }
    };

    const toggleChecklistItem = (itemId) => {
        setFormData(prev => ({
            ...prev,
            checklist: prev.checklist.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        }));
    };

    const removeChecklistItem = (itemId) => {
        setFormData(prev => ({
            ...prev,
            checklist: prev.checklist.filter(item => item.id !== itemId)
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.taskName.trim()) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Task name is required',
                life: 3000
            });
            return;
        }

        console.log('Form submitted:', formData);

        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: id ? 'Task updated successfully' : 'Task created successfully',
            life: 3000
        });

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            navigate('/tasks');
        }, 2000);
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            'P1': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            'P2': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
            'P3': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        };
        return colors[priority] || 'bg-gray-100 text-gray-600';
    };

    const getApprovalBadge = (approval) => {
        const colors = {
            'Approved': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            'Pending': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Rejected': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[approval] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Toast ref={toast} />

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {formData.taskName || 'Task Name'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <span>List: <strong>{formData.list}</strong></span>
                            {formData.startDate && (
                                <span>By: <strong>{formData.startDate.toLocaleDateString()}</strong></span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.priority && (
                            <span className={`px-3 py-1 rounded-md text-xs font-medium ${getPriorityBadge(formData.priority)}`}>
                                {formData.priority}
                            </span>
                        )}
                        {formData.approved && (
                            <span className={`px-3 py-1 rounded-md text-xs font-medium ${getApprovalBadge(formData.approved)}`}>
                                {formData.approved}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                        label="Add Tag"
                        icon="pi pi-tag"
                        outlined
                        size="small"
                        onClick={() => setShowTagDialog(true)}
                    />
                    <Button
                        label="Add Checklist"
                        icon="pi pi-list"
                        outlined
                        size="small"
                        onClick={() => setShowChecklistDialog(true)}
                    />
                </div>

                {/* Display Tags */}
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {formData.tags.map((tag, index) => (
                            <Tag
                                key={index}
                                value={
                                    <div className="flex items-center gap-1">
                                        <span>{tag}</span>
                                        <i
                                            className="pi pi-times cursor-pointer text-xs"
                                            onClick={() => removeTag(tag)}
                                        />
                                    </div>
                                }
                                severity="info"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Task Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <i className="pi pi-align-left text-slate-500"></i>
                                <span>Task name</span>
                            </label>
                            <InputText
                                value={formData.taskName}
                                onChange={(e) => handleInputChange('taskName', e.target.value)}
                                placeholder="Add a Task"
                                className="w-full"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <i className="pi pi-align-left text-slate-500"></i>
                                <span>Description</span>
                            </label>
                            <InputTextarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Add a description..."
                                rows={4}
                                className="w-full"
                            />
                        </div>

                        {/* Priority and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-circle text-slate-500"></i>
                                    <span>Set Priority</span>
                                </label>
                                <Dropdown
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange('priority', e.value)}
                                    options={priorities}
                                    placeholder="Select Priority"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-info-circle text-slate-500"></i>
                                    <span>Status</span>
                                </label>
                                <Dropdown
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.value)}
                                    options={statuses}
                                    placeholder="Select Status"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Start Date and Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-calendar text-slate-500"></i>
                                    <span>startdate</span>
                                </label>
                                <Calendar
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.value)}
                                    showIcon
                                    placeholder="Select date"
                                    className="w-full"
                                    dateFormat="M dd, yy"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-calendar text-slate-500"></i>
                                    <span>deadline</span>
                                </label>
                                <Calendar
                                    value={formData.deadline}
                                    onChange={(e) => handleInputChange('deadline', e.value)}
                                    showIcon
                                    placeholder="Select date"
                                    className="w-full"
                                    dateFormat="M dd, yy"
                                />
                            </div>
                        </div>

                        {/* Approved and Assigned */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-check text-slate-500"></i>
                                    <span>approved</span>
                                </label>
                                <Dropdown
                                    value={formData.approved}
                                    onChange={(e) => handleInputChange('approved', e.value)}
                                    options={approvalOptions}
                                    placeholder="Select Approval Status"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-users text-slate-500"></i>
                                    <span>assigned</span>
                                </label>
                                <div className="flex items-center gap-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900">
                                    <AvatarGroup>
                                        {formData.assignedMembers.slice(0, 4).map((member) => (
                                            <Avatar
                                                key={member.id}
                                                label={member.name.charAt(0)}
                                                className={`${member.color} text-white`}
                                                shape="circle"
                                            />
                                        ))}
                                        {formData.assignedMembers.length > 4 && (
                                            <Avatar
                                                label={`+${formData.assignedMembers.length - 4}`}
                                                className="bg-slate-400 text-white"
                                                shape="circle"
                                            />
                                        )}
                                    </AvatarGroup>
                                    <Button
                                        icon="pi pi-plus"
                                        rounded
                                        text
                                        size="small"
                                        onClick={() => setShowMemberDialog(true)}
                                        tooltip="Add Member"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Checklist Display */}
                        {formData.checklist.length > 0 && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <i className="pi pi-list text-slate-500"></i>
                                    <span>Checklist</span>
                                </label>
                                <div className="space-y-2">
                                    {formData.checklist.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg"
                                        >
                                            <Checkbox
                                                checked={item.completed}
                                                onChange={() => toggleChecklistItem(item.id)}
                                            />
                                            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {item.text}
                                            </span>
                                            <Button
                                                icon="pi pi-times"
                                                rounded
                                                text
                                                size="small"
                                                severity="danger"
                                                onClick={() => removeChecklistItem(item.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse justify-end sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            label="Cancel"
                            severity="secondary"
                            outlined
                            onClick={() => navigate('/tasks')}
                            className="w-full sm:w-auto"
                        />
                        <ButtonSubmit
                            label={id ? 'Update Task' : 'Create Task'}
                            loading={isSaving}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>

            {/* Add Member Dialog */}
            <Dialog
                header="Assign Members"
                visible={showMemberDialog}
                style={{ width: '450px' }}
                onHide={() => setShowMemberDialog(false)}
            >
                <div className="space-y-3">
                    {availableMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                            onClick={() => handleMemberToggle(member)}
                        >
                            <Checkbox
                                checked={formData.assignedMembers.find(m => m.id === member.id) !== undefined}
                                onChange={() => handleMemberToggle(member)}
                            />
                            <Avatar
                                label={member.name.charAt(0)}
                                className={`${member.color} text-white`}
                                shape="circle"
                            />
                            <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{member.name}</span>
                        </div>
                    ))}
                </div>
            </Dialog>

            {/* Add Checklist Dialog */}
            <Dialog
                header="Add Checklist Item"
                visible={showChecklistDialog}
                style={{ width: '450px' }}
                onHide={() => setShowChecklistDialog(false)}
            >
                <div className="flex gap-2">
                    <InputText
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        placeholder="Enter checklist item"
                        className="flex-1"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                addChecklistItem();
                                setShowChecklistDialog(false);
                            }
                        }}
                    />
                    <Button
                        label="Add"
                        onClick={() => {
                            addChecklistItem();
                            setShowChecklistDialog(false);
                        }}
                    />
                </div>
            </Dialog>

            {/* Add Tag Dialog */}
            <Dialog
                header="Add Tag"
                visible={showTagDialog}
                style={{ width: '450px' }}
                onHide={() => setShowTagDialog(false)}
            >
                <div className="flex gap-2">
                    <InputText
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter tag name"
                        className="flex-1"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                addTag();
                                setShowTagDialog(false);
                            }
                        }}
                    />
                    <Button
                        label="Add"
                        onClick={() => {
                            addTag();
                            setShowTagDialog(false);
                        }}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default TaskFormPage;