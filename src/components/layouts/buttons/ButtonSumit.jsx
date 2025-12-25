import React from 'react';
import { Button } from 'primereact/button';

const ButtonSubmit = ({ label, loading, icon = "pi pi-save", className = "", ...props }) => {
    return (
        <Button
            type="submit"
            label={loading ? 'Saving...' : label} // Optional: change text while loading
            icon={!loading ? icon : undefined}   // Hide icon when loading to show spinner
            loading={loading}
            className={`w-full sm:w-auto bg-emerald-700 border-0 hover:bg-emerald-600 transition-all dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`}
            {...props}
        />
    );
};

export default ButtonSubmit;