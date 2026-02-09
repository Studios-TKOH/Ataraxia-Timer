import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL;

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({ baseURL: API_URL });
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
    failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token && token.startsWith('offline_token_')) {
        return Promise.reject({
            isOfflineToken: true,
            message: "Blocked request: Temporary token"
        });
    }

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        if (response.config.method === 'get' && response.status === 200) {
            const cacheKey = `offline_cache_${response.config.url}`;
            const newData = JSON.stringify(response.data);
            if (localStorage.getItem(cacheKey) !== newData) {
                localStorage.setItem(cacheKey, newData);
            }
        }
        return response;
    },
    async (error) => {
        if (error.isOfflineToken) return Promise.reject(error);

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!error.response || error.response.status >= 500) {
            if (originalRequest.method === 'get') {
                const cachedData = localStorage.getItem(`offline_cache_${originalRequest.url}`);
                if (cachedData) {
                    return Promise.resolve({ ...error, status: 200, data: JSON.parse(cachedData) });
                }
            }
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/login')) return Promise.reject(error);

            if (isRefreshing) {
                return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const { data } = await refreshClient.post('/auth/refresh', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });
                localStorage.setItem('access_token', data.access_token);
                processQueue(null, data.access_token);
                isRefreshing = false;
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                isRefreshing = false;
                window.dispatchEvent(new CustomEvent('auth:logout'));
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);