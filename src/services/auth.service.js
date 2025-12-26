import { API_CONFIG } from '../config/api.config';
import { storage } from '../utils/storage.util';

class AuthService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Helper method for API calls
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = storage.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Network error'
            };
        }
    }

    // Login
    async login(credentials) {
        const result = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (result.success && result.data.token) {
            storage.setToken(result.data.token);
            storage.setUser({
                user: result.data.user,
                roles: result.data.roles || [],
                permissions: result.data.permissions || []
            });
        }

        return result;
    }

    // Get current user
    async getCurrentUser() {
        const result = await this.request(API_CONFIG.ENDPOINTS.ME);

        if (result.success) {
            storage.setUser({
                user: result.data.user,
                roles: result.data.roles || [],
                permissions: result.data.permissions || []
            });
        }

        return result;
    }

    // Logout
    async logout() {
        await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
            method: 'POST'
        });
        storage.clearAuth();
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!storage.getToken();
    }

    // Get stored user data
    getStoredUser() {
        return storage.getUser();
    }
}

export const authService = new AuthService();