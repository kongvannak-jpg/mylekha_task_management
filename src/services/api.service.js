import { API_CONFIG } from '../config/api.config';
import { storage } from '../utils/storage.util';

export class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

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
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('🔴 Session expired (401). Clearing local storage.');
                    storage.clearAuth();
                    // Optional: window.location.reload(); 
                    throw new Error('Session expired. Please login again.');
                }

                const errorMessage = typeof data === 'object'
                    ? (data.message || data.error || 'Request failed')
                    : data || 'Request failed';

                throw new Error(errorMessage);
            }

            return { success: true, data };
        } catch (error) {
            console.error('🔴 Request error:', error);
            return {
                success: false,
                error: error.message || 'Network error'
            };
        }
    }
}