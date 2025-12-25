import React from 'react';
import { Button } from 'primereact';
import { useNavigate } from 'react-router-dom';

const NoPermissionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-center px-4">
            <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                <i className="pi pi-lock text-6xl text-orange-500 dark:text-orange-400"></i>
            </div>

            <h1 className="text-6xl font-bold text-slate-800 dark:text-white mb-2">403</h1>
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-4">Access Denied</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
            </p>

            <Button
                label="Back to Dashboard"
                icon="pi pi-home"
                className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate('/dashboard')}
            />
        </div>
    );
};

export default NoPermissionPage;