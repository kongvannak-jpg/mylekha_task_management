const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
    // Token management
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    // User data management
    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    removeUser: () => localStorage.removeItem(USER_KEY),

    // Clear all auth data
    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};