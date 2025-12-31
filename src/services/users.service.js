// src/services/users.service.js
import { API_CONFIG } from '../config/api.config';
import { ApiService } from './api.service';

class UsersService extends ApiService {
    async getAllUsers({ page = 1, limit = 10, search = '' } = {}) {

        const params = new URLSearchParams({
            select: 'id,name,email,role,status',
            page: page.toString(),
            per_page: limit.toString(),
            sortby: 'id',
            order: 'desc'
        });

        if (search) {
            params.append('name', `like.${search}`);
        }


        return await this.request(`${API_CONFIG.ENDPOINTS.USERS}?${params.toString()}`, {
            method: 'GET'
        });
    }

    async createUser(userData) {
        return await this.request(API_CONFIG.ENDPOINTS.USERS, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
}

export const usersService = new UsersService();