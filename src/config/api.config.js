export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
        LOGIN: '/api/auth/login',
        ME: '/api/auth/me',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh'
    },
    TIMEOUT: 10000
};