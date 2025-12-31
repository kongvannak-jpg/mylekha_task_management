import { useAuth } from './useAuth';

export const usePermission = () => {
    // Default to empty arrays to prevent crashes if data hasn't loaded
    const { roles = [], permissions = [] } = useAuth();

    // 1. Check specific Role
    const hasRole = (roleName) => {
        return roles.includes(roleName);
    };

    // 2. Check specific Permission
    const hasPermission = (permissionName) => {
        return permissions.includes(permissionName);
    };

    // 3. Check if user has ANY of the required roles
    const hasAnyRole = (roleNames) => {
        if (!Array.isArray(roleNames)) return false;
        return roleNames.some(roleName => roles.includes(roleName));
    };

    // 4. Check if user has ALL required roles
    const hasAllRoles = (roleNames) => {
        if (!Array.isArray(roleNames)) return false;
        return roleNames.every(roleName => roles.includes(roleName));
    };

    // 5. Check if user has ANY of the required permissions
    const hasAnyPermission = (permissionNames) => {
        if (!Array.isArray(permissionNames)) return false;
        return permissionNames.some(permissionName => permissions.includes(permissionName));
    };

    // 6. Check if user has ALL required permissions
    const hasAllPermissions = (permissionNames) => {
        if (!Array.isArray(permissionNames)) return false;
        return permissionNames.every(permissionName => permissions.includes(permissionName));
    };

    return {
        roles,
        permissions,
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAllRoles,
        hasAnyPermission,
        hasAllPermissions
    };
};