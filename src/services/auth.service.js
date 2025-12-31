import { API_CONFIG } from '../config/api.config';
import { storage } from '../utils/storage.util';
import { ApiService } from './api.service';

class AuthService extends ApiService {
    async login(credentials) {
        const result = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        const accessToken = result.data?.data?.access_token || result.data?.access_token;

        if (result.success && accessToken) {
            storage.setToken(accessToken);
        } else {
            console.error('❌ Login succeeded but token was not found in response:', result);
        }

        return result;
    }

    async getRolePermissions(roleId) {
        return await this.request(`/api/v1/roles/rpc/get_permissions?id=${roleId}`, {
            method: 'GET'
        });
    }

    async getCurrentUser() {
        return await this.request(API_CONFIG.ENDPOINTS.ME, {
            method: 'GET'
        });
    }

    // RPC Logout
    async logout() {
        try {
            await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
                method: 'POST'
            });
        } catch (error) {
            console.warn('Server logout failed (likely already expired), clearing local anyway.');
        } finally {
            storage.clearAuth();
            console.log('✅ Local token cleared');
        }
    }

    isAuthenticated() {
        return !!storage.getToken();
    }
}

export const authService = new AuthService();