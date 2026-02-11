import { takeLatest, call } from 'redux-saga/effects';
import { setPlaying } from '../slices/musicSlice';
import { spotifyService } from '../../api/spotify.service';

function* handlePlayPause(action) {
    const isPlaying = action.payload;
    try {
        if (isPlaying) {
            yield call(spotifyService.resume);
        } else {
            yield call(spotifyService.pause);
        }
    } catch (e) {
        console.error("Spotify Sync Error", e);
    }
}

export function* musicSaga() {
    yield takeLatest(setPlaying.type, handlePlayPause);
}