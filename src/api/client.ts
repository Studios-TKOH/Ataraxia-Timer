import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
let isServerDown = false;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    if (isServerDown) {
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort("Server is currently offline");
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        isServerDown = false;
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const code = error.response?.data?.code;

            if (!error.response || status === 503 || status === 502 || status === 504) {
                if (!isServerDown) {
                    isServerDown = true;
                    window.dispatchEvent(new CustomEvent('server:down'));
                    setTimeout(() => {
                        isServerDown = false;
                    }, 30000);
                }
            }

            if (status === 401 && code === 'AUTH_EXPIRED') {
                window.dispatchEvent(new Event('auth:logout'));
            }
        }

        return Promise.reject(error);
    }
);