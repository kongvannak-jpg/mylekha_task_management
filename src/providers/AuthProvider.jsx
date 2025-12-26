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

    // Load user data on mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            if (authService.isAuthenticated()) {
                // Try to get stored data first for instant load
                const storedData = authService.getStoredUser();
                if (storedData) {
                    setState({
                        user: storedData.user,
                        roles: storedData.roles,
                        permissions: storedData.permissions,
                        loading: false,
                        isAuthenticated: true
                    });
                }

                // Then fetch fresh data from API
                const result = await authService.getCurrentUser();
                if (result.success) {
                    setState({
                        user: result.data.user,
                        roles: result.data.roles || [],
                        permissions: result.data.permissions || [],
                        loading: false,
                        isAuthenticated: true
                    });
                } else {
                    // Token invalid
                    authService.logout();
                    setState({
                        user: null,
                        roles: [],
                        permissions: [],
                        loading: false,
                        isAuthenticated: false
                    });
                }
            } else {
                setState(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const login = async (email, password) => {
        const result = await authService.login({ email, password });

        if (result.success) {
            setState({
                user: result.data.user,
                roles: result.data.roles || [],
                permissions: result.data.permissions || [],
                loading: false,
                isAuthenticated: true
            });
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

    const value = {
        ...state,
        login,
        logout,
        refresh: loadUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
