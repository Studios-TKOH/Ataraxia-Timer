import { apiClient } from './client';

export const achievementsService = {
    getAchievements: async () => {
        const response = await apiClient.get('/achievements');
        return response.data;
    },

    getAchievementById: async (id) => {
        const response = await apiClient.get(`/achievements/${id}`);
        return response.data;
    }
};