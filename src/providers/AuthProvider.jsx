import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        roles: [],
        permissions: [],
        loading: true,
        isAuthenticated: false
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        if (!authService.isAuthenticated()) {
            setState(prev => ({ ...prev, loading: false }));
            return;
        }

        try {
            // 1. Get User
            const result = await authService.getCurrentUser();

            // Unwrap User Data (Handles {data: {data: ...}} or {data: ...})
            const responseBody = result.data || result;
            const user = responseBody.data || responseBody;

            // Safely get user info
            const roles = user.role_name ? [user.role_name] : [];
            let permissions = [];

            // 2. Get Permissions (If role_id exists)
            if (user.role_id) {
                try {
                    const permResult = await authService.getRolePermissions(user.role_id);

                    if (permResult.data && permResult.data.permissions) {
                        permissions = permResult.data.permissions;
                    }
                    else if (permResult.data && permResult.data.data && permResult.data.data.permissions) {
                        permissions = permResult.data.data.permissions;
                    }
                    else if (permResult.permissions) {
                        permissions = permResult.permissions;
                    }

                } catch (permError) {
                    console.error('Failed to load permissions:', permError);
                }
            }

            // 3. Update State
            setState({
                user: user,
                roles: roles,
                permissions: permissions || [],
                loading: false,
                isAuthenticated: true
            });

        } catch (error) {
            console.error('Failed to load user data:', error);

            await authService.logout();
            setState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
        }
    };

    const login = async (email, password) => {
        const result = await authService.login({ email, password });
        if (result.success) {
            await loadUserData();
        }
        return result;
    };

    const logout = useCallback(async () => {
        await authService.logout();
        setState({
            user: null,
            roles: [],
            permissions: [],
            loading: false,
            isAuthenticated: false
        });
    }, []);

    const value = { ...state, login, logout, refresh: loadUserData };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};