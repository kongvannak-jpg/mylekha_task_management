import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { useTranslation } from 'react-i18next';
import ButtonSubmit from '../../components/layouts/buttons/ButtonSumit';

const UserFormPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: null,
        status: true, // true = active, false = inactive
        avatar: null
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    const roles = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' }
    ];



    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const onUpload = (e) => {
        const file = e.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.role) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            return;
        }

        // If editing, password is optional
        if (!id && !formData.password) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Password is required for new users',
                life: 3000
            });
            return;
        }

        // Password confirmation check
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Passwords do not match',
                life: 3000
            });
            return;
        }

        console.log('Form submitted:', formData);

        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: id ? 'User updated successfully' : 'User created successfully',
            life: 3000
        });
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            navigate('/users');
        }, 2000);
    };

    const removeAvatar = () => {
        setAvatarPreview(null);
        setFormData(prev => ({ ...prev, avatar: null }));
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    return (
        <div className="">
            <Toast ref={toast} />
            {/* Form Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8">
                <h4 className='mb-5'>{t('create_user')}</h4>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Avatar Upload Section */}
                        <div className="mb-8 lg:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                                {t('profile_picture')}
                            </label>
                            <div className="flex flex-col items-center">
                                {avatarPreview ? (
                                    <div className="relative">
                                        <Avatar
                                            image={avatarPreview}
                                            size="xlarge"
                                            shape="circle"
                                            className="w-24 h-24"
                                        />
                                        <Button
                                            icon="pi pi-times"
                                            rounded
                                            severity="danger"
                                            className="absolute -top-2 -right-2 !w-8 !h-8"
                                            onClick={removeAvatar}
                                        />
                                    </div>
                                ) : (
                                    <Avatar
                                        label={formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                                        size="xlarge"
                                        shape="circle"
                                        className="w-24 h-24 bg-emerald-100 dark:bg-blue-100 text-emerald-700 dark:text-blue-700 text-2xl"
                                    />
                                )}

                                <div >
                                    <FileUpload
                                        ref={fileUploadRef}
                                        mode="basic"
                                        name="avatar"
                                        accept="image/*"
                                        maxFileSize={2000000}
                                        onSelect={onUpload}
                                        auto
                                        chooseLabel={t('upload_picture')}
                                        // No more complex PT or unstyled needed!
                                        className="mb-2 mt-4"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        JPG, PNG or GIF (max. 2MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid lg:col-span-2 grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('full_name')} <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full"
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('email_address')} <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full"
                                />
                            </div>

                            {/* Password */}
                            <div className='w-full'>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('password')} {!id && <span className="text-red-500">*</span>}
                                    {id && <span className="text-slate-400 text-xs ml-1">(leave blank to keep current)</span>}
                                </label>
                                <Password
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="••••••••"
                                    toggleMask
                                    className="w-full"
                                    inputClassName="w-full"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('confirm_password')} {!id && <span className="text-red-500">*</span>}
                                </label>
                                <Password
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    toggleMask
                                    feedback={false}
                                    className="w-full"
                                    inputClassName="w-full"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('role')} <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.value)}
                                    options={roles}
                                    placeholder={t('select_role')}
                                    className="w-full"
                                />
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2">
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('status')}
                                </label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <InputSwitch
                                        id="status"
                                        checked={formData.status}
                                        onChange={(e) => handleInputChange('status', e.value)}
                                    />
                                    <label htmlFor="status" className="cursor-pointer font-medium">
                                        {formData.status ? (
                                            <span className="text-emerald-600 dark:text-emerald-400">{t('active')}</span>
                                        ) : (
                                            <span className="text-slate-500 dark:text-slate-400">{t('inactive')}</span>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse justify-end sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            label="Cancel"
                            severity="secondary"
                            outlined
                            onClick={() => navigate('/users')}
                            className="w-full sm:w-auto"
                        />
                        <ButtonSubmit
                            label={id ? 'Update User' : 'Create User'}
                            loading={isSaving}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormPage;