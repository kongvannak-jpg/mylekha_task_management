// src/utils/storage.util.js
const TOKEN_KEY = 'auth_token';

export const storage = {
    // Token management - ONLY store token
    getToken: () => localStorage.getItem(TOKEN_KEY),

    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),

    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    // Clear all auth data
    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
    }
};