import { OpenAPI } from '@/infrastructure/api/generated/core/OpenAPI';

const API_URL = import.meta.env.VITE_API_URL;

OpenAPI.BASE = API_URL
    ? API_URL.replace('/api/v1', '')
    : 'https://ataraxia-api.studios-tkoh.online';

OpenAPI.TOKEN = localStorage.getItem('token') || undefined;

const originalSetItem = localStorage.setItem;
localStorage.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (key === 'token') {
        OpenAPI.TOKEN = value || undefined;
    }
};

const originalRemoveItem = localStorage.removeItem;
localStorage.removeItem = function (key: string) {
    originalRemoveItem.call(this, key);
    if (key === 'token') {
        OpenAPI.TOKEN = undefined;
    }
};
