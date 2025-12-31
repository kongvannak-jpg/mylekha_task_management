import { API_CONFIG } from '../config/api.config';
import { ApiService } from './api.service';

class RolesService extends ApiService {

    async getAllRoles({ page = 1, limit = 10, search = '' } = {}) {
        const params = new URLSearchParams({
            select: 'id,name',
            page: page.toString(),
            per_page: limit.toString(),
            sortby: 'id',
            order: 'desc'
        });
        if (search) {
            params.append('name', `like.${search}`);
        }
        return await this.request(`${API_CONFIG.ENDPOINTS.ROLES}?${params.toString()}`, {
            method: 'GET'
        });
    }

    async getRoleById(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, { method: 'GET' });
    }

    async createRole(data) {
        return await this.request(API_CONFIG.ENDPOINTS.ROLES, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateRole(id, data) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // ✅ RPC: Get Permissions
    async getRolePermissions(roleId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ROLES}/rpc/get_permissions?id=${roleId}`, {
            method: 'GET'
        });
    }

    // ✅ RPC: Sync Permissions (Replaces all existing)
    // Matches your required body format: { "id": 2, "permissions": [...] }
    async syncPermissions(roleId, permissionsList) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ROLES}/rpc/sync_permissions`, {
            method: 'POST',
            body: JSON.stringify({
                id: roleId,           // ✅ Changed 'role' to 'id'
                permissions: permissionsList
            })
        });
    }

    // ✅ RPC: Assign Permissions (Adds to existing)
    // Matches your required body format: { "id": 2, "permissions": [...] }
    async assignPermissions(roleId, permissionsList) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ROLES}/rpc/assign_permissions`, {
            method: 'POST',
            body: JSON.stringify({
                id: roleId,           // ✅ Changed 'role' to 'id'
                permissions: permissionsList
            })
        });
    }

    async getAllPermissions() {
        return await this.request(`${API_CONFIG.ENDPOINTS.PERMISSIONS}?per_page=1000`, {
            method: 'GET'
        });
    }

}

export const rolesService = new RolesService();