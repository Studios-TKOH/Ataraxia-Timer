import { useSelector, useDispatch } from 'react-redux';
import { startTimer, pauseTimer, resetTimer, switchMode } from '../store/slices/timerSlice';

export const useTimer = () => {
    const dispatch = useDispatch();
    const { mode, timeLeft, isActive, cycles } = useSelector(state => state.timer);

    const toggleTimer = () => {
        if (isActive) dispatch(pauseTimer());
        else dispatch(startTimer());
    };

    const handleReset = () => dispatch(resetTimer());
    const handleSwitchMode = (newMode) => dispatch(switchMode(newMode));

    const formatTime = (time) => {
        if (typeof time !== 'number' || isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return {
        mode,
        setMode: handleSwitchMode,
        timeLeft,
        formatTime,
        isActive,
        toggleTimer,
        resetTimer: handleReset,
        cycles
    };
};