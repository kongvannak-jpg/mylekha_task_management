import { Button } from 'primereact/button';
import React from 'react'
const ButtonCreate = ({ label, icon = 'pi pi-plus', onClick, className = '', ...props }) => {
    return (
        <Button
            label={label}
            icon={icon}
            onClick={onClick}
            className={`py-2 font-normal text-sm bg-emerald-600 hover:bg-emerald-700 dark:bg-blue-500 dark:hover:bg-blue-600 border-none shadow-sm ${className}`}
            {...props}
        />
    );
}
export default ButtonCreate
