import { ApiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

class PermissionsService extends ApiService {
    // GET /api/v1/permissions (List all permissions)
    async getAllPermissions() {
        return await this.request(API_CONFIG.ENDPOINTS.PERMISSIONS, {
            method: 'GET'
        });
    }

    // POST /api/v1/permissions (Create a single permission)
    async createPermission(data) {
        return await this.request(API_CONFIG.ENDPOINTS.PERMISSIONS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // POST /api/v1/permissions/rpc/create (Bulk create permissions if supported by your API structure, standard create used above)
    // Based on your provided API list, you have rpc/create.
    async createPermissionsBulk(data) {
        return await this.request(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/rpc/create`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // DELETE /api/v1/permissions/{id}
    async deletePermission(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${id}`, {
            method: 'DELETE'
        });
    }
}

export const permissionsService = new PermissionsService();