import { useState, useEffect, useRef, useCallback } from 'react';

const ALARM_SOUND = '/sounds/alarm.mp3';

export const useTimer = (initialMode, settings, autoStart, longBreakInterval, volume) => {
    const [mode, setMode] = useState(initialMode);
    const [timeLeft, setTimeLeft] = useState(settings[initialMode] * 60);
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);

    const audioRef = useRef(new Audio(ALARM_SOUND));

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(settings[mode] * 60);
        }
    }, [settings, mode]);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        setTimeLeft(settings[newMode] * 60);
        setIsActive(false);
    }, [settings]);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        playAlarm();

        if (mode === 'work') {
            const newCycles = cycles + 1;
            setCycles(newCycles);

            if (newCycles % longBreakInterval === 0) {
                switchMode('long');
            } else {
                switchMode('short');
            }
        } else {
            switchMode('work');
        }

        if (autoStart) {
            setTimeout(() => setIsActive(true), 1000);
        }
    };

    const playAlarm = () => {
        const audio = audioRef.current;
        audio.src = ALARM_SOUND;
        audio.volume = volume;
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Audio autoplay prevented:', error);
            });
        }
    };

    const stopAlarm = () => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
    };

    const toggleTimer = () => {
        if (isActive) {
            setIsActive(false);
        } else {
            if (volume > 0) audioRef.current.load();
            setIsActive(true);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(settings[mode] * 60);
        stopAlarm();
    };

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        return () => stopAlarm();
    }, []);

    return {
        mode,
        setMode: switchMode,
        timeLeft,
        formatTime,
        isActive,
        toggleTimer,
        resetTimer,
        cycles
    };
};