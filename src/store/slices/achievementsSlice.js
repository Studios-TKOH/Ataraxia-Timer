import { createSlice } from '@reduxjs/toolkit';

const ACHIEVEMENTS_LIST = []; 
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('dw-achievements');
        if (serializedState === null) {
            return {
                stats: {
                    totalFocusMinutes: 0,
                    sessionsCompleted: 0,
                    tasksCompleted: 0
                },
                unlockedIds: []
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            stats: { totalFocusMinutes: 0, sessionsCompleted: 0, tasksCompleted: 0 },
            unlockedIds: []
        };
    }
};

const initialStateData = loadState();

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState: {
        list: ACHIEVEMENTS_LIST, 
        stats: initialStateData.stats, 
        unlockedIds: initialStateData.unlockedIds, 
        lastUnlocked: null 
    },
    reducers: {
        updateStats: (state, action) => {
            const { type, value } = action.payload;
        
            if (type === 'minutes') state.stats.totalFocusMinutes = (state.stats.totalFocusMinutes || 0) + value;
            if (type === 'sessions') state.stats.sessionsCompleted = (state.stats.sessionsCompleted || 0) + 1;
            if (type === 'tasks') state.stats.tasksCompleted = (state.stats.tasksCompleted || 0) + 1;

            // Guardar cambios
            localStorage.setItem('dw-achievements', JSON.stringify({
                stats: state.stats,
                unlockedIds: state.unlockedIds
            }));
        },

        unlockAchievement: (state, action) => {
            const achievementId = action.payload;
            if (!state.unlockedIds.includes(achievementId)) {
                state.unlockedIds.push(achievementId);
                state.lastUnlocked = state.list.find(a => a.id === achievementId);
                
                localStorage.setItem('dw-achievements', JSON.stringify({
                    stats: state.stats,
                    unlockedIds: state.unlockedIds
                }));
            }
        },

        clearNotification: (state) => {
            state.lastUnlocked = null;
        }
    }
});

export const { updateStats, unlockAchievement, clearNotification } = achievementsSlice.actions;
export default achievementsSlice.reducer;