import { apiClient } from './client';
import { LoginDto, RegisterDto, AuthResponse, GuestLoginDto } from '../dto/auth.types';

const ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GUEST: '/auth/guest-login',
};

export const authService = {
    login: async (data: LoginDto) => {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, data);
        return response.data;
    },
    register: async (data: RegisterDto) => {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.REGISTER, data);
        return response.data;
    },
    guestLogin: async (data: GuestLoginDto) => {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.GUEST, data);
        return response.data;
    }
};