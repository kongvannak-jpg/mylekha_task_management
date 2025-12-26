import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md">
                <div className="text-7xl mb-6">🚫</div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">
                    Access Denied
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                    You don't have permission to access this page.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        label="Go Back"
                        icon="pi pi-arrow-left"
                        onClick={() => navigate(-1)}
                        className="!bg-slate-600 hover:!bg-slate-700 border-slate-600"
                    />
                    <Button
                        label="Go to Dashboard"
                        icon="pi pi-home"
                        onClick={() => navigate('/dashboard')}
                        className="!bg-emerald-700 hover:!bg-emerald-600 border-emerald-700"
                    />
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;