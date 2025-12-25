import React from 'react';
// ✅ FIX: Import from specific package
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-center px-4">
            <div className="mb-8 w-20 h-20 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-full">
                <i className="pi pi-exclamation-triangle text-6xl text-red-500 dark:text-red-400"></i>
            </div>

            <h1 className="text-6xl font-bold text-slate-800 dark:text-white mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-4">Page Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex gap-4">
                <Button
                    label="Go Back"
                    icon="pi pi-arrow-left"
                    outlined
                    // Use standard PrimeReact severity for colors if possible, or keep custom classes
                    onClick={() => navigate(-1)}
                />
                <Button
                    label="Dashboard"
                    icon="pi pi-home"
                    severity="success" // This will use the green from lara-light-green
                    onClick={() => navigate('/dashboard')}
                />
            </div>
        </div>
    );
};

export default NotFoundPage;