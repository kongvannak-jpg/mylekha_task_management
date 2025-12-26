import { useAuth } from './useAuth';

export const usePermission = () => {
    const { roles, permissions } = useAuth();

    const hasRole = (roleName) => {
        return roles.some(role => role.name === roleName);
    };

    const hasPermission = (permissionName) => {
        return permissions.some(permission => permission.name === permissionName);
    };

    const hasAnyRole = (roleNames) => {
        return roleNames.some(roleName => hasRole(roleName));
    };

    const hasAllRoles = (roleNames) => {
        return roleNames.every(roleName => hasRole(roleName));
    };

    const hasAnyPermission = (permissionNames) => {
        return permissionNames.some(permissionName => hasPermission(permissionName));
    };

    const hasAllPermissions = (permissionNames) => {
        return permissionNames.every(permissionName => hasPermission(permissionName));
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