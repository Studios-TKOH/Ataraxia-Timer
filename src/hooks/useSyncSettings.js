import { useEffect, useRef } from 'react';
import { settingsService } from '../api/settings.service';

export const useSyncSettings = (user, token, isMaintenance, setters) => {
    const isFirstLoad = useRef(true);
    const syncTimeout = useRef(null);

    useEffect(() => {
        if (!user || user.isGuest || !token || isMaintenance) return;

        const sync = async () => {
            try {
                if (isFirstLoad.current) {
                    const cloudSettings = await settingsService.getSettings();
                    if (cloudSettings) {
                        if (cloudSettings.timerSettings) setters.setTimerSettings(cloudSettings.timerSettings);
                        if (cloudSettings.accentColor) setters.setAccentColor(cloudSettings.accentColor);
                        if (cloudSettings.autoStart !== undefined) setters.setAutoStart(cloudSettings.autoStart);
                        if (cloudSettings.longBreakInterval) setters.setLongBreakInterval(cloudSettings.longBreakInterval);
                    }
                    isFirstLoad.current = false;
                }
            } catch (error) {
                console.error("Cloud sync failed:", error);
            }
        };

        sync();
    }, [user?.id, token]);
};