import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useTranslation } from 'react-i18next';
import ButtonSubmit from '../../components/layouts/buttons/ButtonSumit';
import { useConfirmAction } from '../../components/dialogs/DeleteDialog';
import { Tag } from 'primereact/tag';

const UserProfilePage = () => {
    const { t } = useTranslation();
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const { confirmAction } = useConfirmAction(toast);

    // Mock current user data
    const [userData] = useState({
        image: 'https://i1.sndcdn.com/avatars-OKOYYTFMIYIB59Aq-aX3xhw-t240x240.jpg',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        status: 'Active',
        joinedDate: 'January 15, 2024',
        lastLogin: 'December 26, 2025 at 10:30 AM'
    });

    const [profileData, setProfileData] = useState({
        name: userData.name,
        email: userData.email,
        phone: '',
        bio: '',
        avatar: null
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const onUpload = (e) => {
        const file = e.files[0];
        if (file) {
            setProfileData(prev => ({ ...prev, avatar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatarPreview(null);
        setProfileData(prev => ({ ...prev, avatar: null }));
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();

        if (!profileData.name || !profileData.email) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Name and email are required',
                life: 3000
            });
            return;
        }

        console.log('Profile updated:', profileData);

        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully',
            life: 3000
        });
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'All password fields are required',
                life: 3000
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'New passwords do not match',
                life: 3000
            });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Password must be at least 8 characters',
                life: 3000
            });
            return;
        }

        console.log('Password changed');

        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully',
            life: 3000
        });

        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    const handleDeleteClick = () => {
        confirmAction(deleteAccountAPI, {
        });
    };
    const deleteAccountAPI = async () => {
        console.log("Calling API to delete account...");
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Profile Header Card */}
            <Card className="mb-6 bg-white dark:bg-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        {avatarPreview ? (
                            <Avatar
                                image={avatarPreview}
                                size="xlarge"
                                className="w-32 h-32"
                            />
                        ) : (
                            <Avatar
                                image={userData.image}
                                size="xlarge"
                                className="w-32 h-32 bg-emerald-100 dark:bg-blue-100 text-emerald-700 dark:text-blue-700 text-4xl"
                            />
                        )}
                        <Tag
                            value={userData.status}
                            severity="success"
                            className="absolute bottom-2 right-2"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {userData.name}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {userData.email}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <Tag value={userData.role} severity="info" />
                        </div>
                        <Divider className="my-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400">{t('joined')}</p>
                                <p className="font-medium text-slate-700 dark:text-slate-300">{userData.joinedDate}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400">{t('last_login')}</p>
                                <p className="font-medium text-slate-700 dark:text-slate-300">{userData.lastLogin}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <TabView
                    pt={{
                        root: { className: 'bg-transparent' },
                        nav: { className: 'dark:bg-slate-800 dark:border-slate-700' },
                        panelContainer: { className: 'dark:bg-slate-800 border-none' },
                        navlink: ({ context }) => ({
                            className: context.selected
                                ? 'dark:bg-slate-800 dark:border-emerald-500 dark:text-emerald-500' // Active Tab
                                : 'dark:bg-slate-800 dark:border-transparent dark:text-slate-400'   // Inactive Tab
                        })
                    }}
                >
                    {/* Profile Information Tab */}
                    <TabPanel header={t('profile_information')} className='dark:bg-slate-800 ' leftIcon="pi pi-user mr-2">
                        <div className="p-6">
                            <div onSubmit={handleProfileSubmit}>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Avatar Upload Section */}
                                    <div className="lg:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                                            {t('profile_picture')}
                                        </label>
                                        <div className="flex flex-col items-center">
                                            {avatarPreview ? (
                                                <div className="relative">
                                                    <Avatar
                                                        image={avatarPreview}
                                                        size="xlarge"
                                                        className="w-32 h-32"
                                                    />
                                                    <Button
                                                        icon="pi pi-times"
                                                        rounded
                                                        severity="danger"
                                                        className="absolute -top-2 -right-2"
                                                        onClick={removeAvatar}
                                                    />
                                                </div>
                                            ) : (
                                                <Avatar
                                                    label={profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                                                    size="xlarge"
                                                    className="w-32 h-32 bg-emerald-100 dark:bg-blue-100 text-emerald-700 dark:text-blue-700 text-3xl"
                                                />
                                            )}

                                            <div className="mt-4">
                                                <FileUpload
                                                    ref={fileUploadRef}
                                                    mode="basic"
                                                    name="avatar"
                                                    accept="image/*"
                                                    maxFileSize={2000000}
                                                    onSelect={onUpload}
                                                    auto
                                                    chooseLabel={t('upload_picture')}
                                                    className="mb-2"
                                                />
                                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                                    JPG, PNG or GIF (max. 2MB)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Form Fields */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                {t('full_name')} <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                                placeholder="Enter your full name"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                {t('email_address')} <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                                placeholder="your.email@example.com"
                                                className="w-full"
                                            />
                                        </div>


                                    </div>
                                </div>

                                <Divider />

                                <div className="flex justify-end gap-3">
                                    <Button
                                        label={t('cancel')}
                                        severity="secondary"
                                        outlined
                                        onClick={() => {
                                            setProfileData({
                                                name: userData.name,
                                                email: userData.email,
                                                phone: '',
                                                bio: '',
                                                avatar: null
                                            });
                                            setAvatarPreview(null);
                                        }}
                                    />
                                    <ButtonSubmit
                                        label={t('save_changes')}
                                        loading={isSaving}
                                        onClick={handleProfileSubmit}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    {/* Change Password Tab */}
                    <TabPanel header={t('change_password')} className='dark:bg-slate-800' leftIcon="pi pi-lock mr-2">
                        <div className="p-6">
                            <div onSubmit={handlePasswordSubmit}>
                                <div className="max-w-2xl space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex gap-3">
                                            <i className="pi pi-info-circle text-blue-600 dark:text-blue-400 mt-0.5"></i>
                                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                                <p className="font-medium mb-1">{t('password_requirements')}</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>At least 8 characters long</li>
                                                    <li>Include uppercase and lowercase letters</li>
                                                    <li>Include at least one number</li>
                                                    <li>Include at least one special character</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('current_password')} <span className="text-red-500">*</span>
                                        </label>
                                        <Password
                                            id="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                            placeholder="••••••••"
                                            toggleMask
                                            feedback={false}
                                            className="w-full"
                                            inputClassName="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('new_password')} <span className="text-red-500">*</span>
                                        </label>
                                        <Password
                                            id="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            placeholder="••••••••"
                                            toggleMask
                                            className="w-full"
                                            inputClassName="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {t('confirm_new_password')} <span className="text-red-500">*</span>
                                        </label>
                                        <Password
                                            id="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            placeholder="••••••••"
                                            toggleMask
                                            feedback={false}
                                            className="w-full"
                                            inputClassName="w-full"
                                        />
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex justify-end gap-3">
                                    <Button
                                        label={t('cancel')}
                                        severity="secondary"
                                        outlined
                                        onClick={() => setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        })}
                                    />
                                    <ButtonSubmit
                                        label={t('change_password')}
                                        loading={isSaving}
                                        onClick={handlePasswordSubmit}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    {/* Account Settings Tab */}
                    <TabPanel header={t('account_settings')} className='dark:bg-slate-800 ' leftIcon="pi pi-cog mr-2">
                        <div className="p-6">
                            <div className="max-w-2xl space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                                    <h6 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                        {t('account_information')}
                                    </h6>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">{t('account_id')}:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">#12345</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">{t('member_since')}:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{userData.joinedDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">{t('account_status')}:</span>
                                            <Badge value={userData.status} severity="success" />
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <h6 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                                        {t('danger_zone')}
                                    </h6>
                                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                        {t('delete_account_warning')}
                                    </p>
                                    <Button
                                        label={t('delete_account')}
                                        severity="danger"
                                        outlined
                                        icon="pi pi-trash"
                                        onClick={handleDeleteClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default UserProfilePage;