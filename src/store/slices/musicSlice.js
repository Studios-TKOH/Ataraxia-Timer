import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPlaying: false,
    volume: Number(localStorage.getItem('dw-music-volume')) || 0.5,
    currentTrack: null,
    isSpotifyConnected: false,
    deviceId: null,
};

const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
            localStorage.setItem('dw-music-volume', action.payload);
        },
        updateTrackInfo: (state, action) => {
            state.currentTrack = action.payload;
        },
        setSpotifyConnected: (state, action) => {
            state.isSpotifyConnected = action.payload;
        },
        setDeviceId: (state, action) => {
            state.deviceId = action.payload;
        }
    }
});

export const { 
    setPlaying, 
    setVolume, 
    updateTrackInfo, 
    setSpotifyConnected, 
    setDeviceId 
} = musicSlice.actions;

export default musicSlice.reducer;