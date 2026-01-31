import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import { authService } from '../api/auth.service';
import { apiClient } from '../api/client';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('dw-user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(true);

    if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    }

    useEffect(() => {
        const handleAuthError = () => logout();
        window.addEventListener('auth:logout', handleAuthError);
        return () => window.removeEventListener('auth:logout', handleAuthError);
    }, []);

    const saveSession = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('dw-user', JSON.stringify(newUser));
        apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
    };

    const loginAsGuest = async () => {
        const storedToken = localStorage.getItem('token');
        if (user || storedToken) return true;

        setLoading(true);
        try {
            const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
            localStorage.setItem('device_id', deviceId);
            const data = await authService.guestLogin({ deviceId });
            const newToken = data.token || data.access_token;
            saveSession(newToken, { ...data.user, isGuest: true });
            return true;
        } catch (error) {
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authService.login({ email, password });
            const newToken = data.token || data.access_token;
            saveSession(newToken, data.user);
            return { success: true };
        } catch (error) {
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('dw-user');
        delete apiClient.defaults.headers.Authorization;
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, initialized, loginAsGuest, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};