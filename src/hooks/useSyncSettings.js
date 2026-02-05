import { useEffect } from 'react';
import { settingsService } from '../api/settings.service';
import { tagsService } from '../api/tags.service';

export const useSyncSettings = (user, token, isMaintenance, setters) => {
    const { setTimerSettings, setLongBreakInterval, setAutoStart, setAccentColor } = setters;

    useEffect(() => {
        if (!user || !token || isMaintenance || user.isGuest) return;

        const syncSettings = async () => {
            try {
                const cloudSettings = await settingsService.getSettings();
                if (cloudSettings) {
                    setTimerSettings(prev => ({
                        ...prev,
                        work: cloudSettings.focusDuration || prev.work,
                        short: cloudSettings.shortBreakDuration || prev.short,
                        long: cloudSettings.longBreakDuration || prev.long
                    }));

                    if (cloudSettings.longBreakInterval) {
                        setLongBreakInterval(cloudSettings.longBreakInterval);
                    }

                    const localAutoStart = localStorage.getItem('dw-autostart');
                    if (cloudSettings.autoStartPomodoros !== undefined && localAutoStart === null) {
                        setAutoStart(cloudSettings.autoStartPomodoros);
                    }
                }

                const tags = await tagsService.getAll();
                const focusTag = tags.find(tag => tag.name === 'Focus');
                if (focusTag?.color) {
                    setAccentColor(focusTag.color);
                }
            } catch (err) {
                console.error("Cloud sync failed:", err);
            }
        };

        syncSettings();
    }, [user, token, isMaintenance, setTimerSettings, setLongBreakInterval, setAutoStart, setAccentColor]);
};