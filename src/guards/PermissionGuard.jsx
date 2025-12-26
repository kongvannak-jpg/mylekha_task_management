import React from 'react';
import { usePermission } from '../hooks/usePermission';

export const PermissionGuard = ({
    children,
    requiredRoles = [],
    requiredPermissions = [],
    requireAll = false,
    fallback = null
}) => {
    const { hasAnyRole, hasAllRoles, hasAnyPermission, hasAllPermissions } = usePermission();

    const hasRoleAccess = requiredRoles.length === 0 || (
        requireAll ? hasAllRoles(requiredRoles) : hasAnyRole(requiredRoles)
    );

    const hasPermissionAccess = requiredPermissions.length === 0 || (
        requireAll ? hasAllPermissions(requiredPermissions) : hasAnyPermission(requiredPermissions)
    );

    const hasAccess = hasRoleAccess && hasPermissionAccess;

    return hasAccess ? children : fallback;
};
