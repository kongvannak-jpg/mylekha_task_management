export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    ENDPOINTS: {
        LOGIN: '/api/v1/rpc/login',
        ME: '/api/v1/rpc/whoAmI?params',
        LOGOUT: '/api/v1/rpc/logout',
        // REFRESH: '/api/auth/refresh'
        USERS: '/api/v1/users',
        ROLES: '/api/v1/roles',
        DEPARTMENTS: '/api/v1/departments',
        PERMISSIONS: '/api/v1/permissions',
    },
    TIMEOUT: 10000
};