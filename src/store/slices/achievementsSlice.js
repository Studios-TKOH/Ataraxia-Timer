import { createSlice } from '@reduxjs/toolkit';

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState: {
        list: [],
        unlockedIds: [],
        leaderboard: [],
        stats: {
            totalExperience: 0,
            currentStreak: 0,
            totalPomodoros: 0
        },
        loading: false,
        error: null,
        lastUnlocked: null
    },
    reducers: {
        fetchAchievementsRequest: (state) => { state.loading = true; },
        fetchLeaderboardRequest: (state) => { state.loading = true; },

        fetchDataSuccess: (state, action) => {
            state.loading = false;
            state.list = action.payload.available;
            state.unlockedIds = action.payload.unlocked.map(ua => ua.achievement.id);
            state.stats = action.payload.stats;
        },

        fetchLeaderboardSuccess: (state, action) => {
            state.loading = false;
            state.leaderboard = action.payload;
        },

        fetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        unlockAchievement: (state, action) => {
            const achievement = action.payload;
            if (!state.unlockedIds.includes(achievement.id)) {
                state.unlockedIds.push(achievement.id);
                state.lastUnlocked = achievement;
            }
        },

        clearNotification: (state) => { state.lastUnlocked = null; }
    }
});

export const {
    fetchAchievementsRequest,
    fetchLeaderboardRequest,
    fetchDataSuccess,
    fetchLeaderboardSuccess,
    fetchError,
    unlockAchievement,
    clearNotification
} = achievementsSlice.actions;

export default achievementsSlice.reducer;