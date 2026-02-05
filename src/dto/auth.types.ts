export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    deviceId?: string;
}
export interface GuestLoginDto {
    deviceId: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
        isGuest?: boolean;
    };
}