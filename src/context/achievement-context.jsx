import React, { createContext, useContext, useState, useEffect } from 'react';
import { achievementsService } from '../api/achievements.service';
import { useAuth } from './auth-context';

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, user } = useAuth();

    const fetchAchievements = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await achievementsService.getAchievements();
            setAchievements(data);
        } catch (error) {
            console.error("Error al cargar logros:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, [token]);

    return (
        <AchievementContext.Provider value={{ achievements, loading, refreshAchievements: fetchAchievements }}>
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievements = () => useContext(AchievementContext);