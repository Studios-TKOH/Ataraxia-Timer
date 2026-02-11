import { all } from 'redux-saga/effects';
import { watchAuth } from './sagas/authSaga';
import { syncSaga } from './sagas/syncSaga';
import { timerSaga } from './sagas/timerSaga';
import { tasksSaga } from './sagas/tasksSaga';
import { settingsSaga } from './sagas/settingsSaga';
import { musicSaga } from './sagas/musicSaga';

export function* rootSaga() {
    yield all([
        watchAuth(),
        syncSaga(),
        timerSaga(),
        tasksSaga(),
        settingsSaga(),
        musicSaga()
    ]);
}