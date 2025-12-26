import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';

export const ProtectedRoute = ({
    children,
    requiredRoles = [],
    requiredPermissions = [],
    requireAll = false
}) => {
    const { isAuthenticated, loading } = useAuth();
    const { hasAnyRole, hasAllRoles, hasAnyPermission, hasAllPermissions } = usePermission();
    const location = useLocation();

    // Show loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-700 mx-auto"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role requirements
    if (requiredRoles.length > 0) {
        const hasRequiredRoles = requireAll
            ? hasAllRoles(requiredRoles)
            : hasAnyRole(requiredRoles);

        if (!hasRequiredRoles) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Check permission requirements
    if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAll
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};
