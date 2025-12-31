// src/services/users.service.js
import { API_CONFIG } from '../config/api.config';
import { ApiService } from './api.service';

class DepartmentsService extends ApiService {
    async getDepartmentById(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, {
            method: 'GET'
        });
    }

    async getAllDepartments({ page = 1, limit = 10, search = '' } = {}) {

        const params = new URLSearchParams({
            select: 'id,name,code',
            page: page.toString(),
            per_page: limit.toString(),
            sortby: 'id',
            order: 'desc'
        });

        if (search) {
            params.append('name,code', `like.${search}`);
        }

        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}?${params.toString()}`, {
            method: 'GET'
        });
    }

    // Create new department
    async createDepartment(data) {
        return await this.request(API_CONFIG.ENDPOINTS.DEPARTMENTS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Update existing department
    async updateDepartment(id, data) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Soft Delete (Move to Trash)
    async deleteDepartment(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, {
            method: 'DELETE'
        });
    }

    // ✅ Add Force Delete
    async forceDeleteDepartment(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}/force`, {
            method: 'DELETE'
        });
    }

    async restoreDepartment(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}/restore`, {
            method: 'POST'
        });
    }
}

export const departmentsService = new DepartmentsService();