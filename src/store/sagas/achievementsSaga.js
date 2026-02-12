import { takeEvery, select, put, all } from 'redux-saga/effects';
import { updateStats, unlockAchievement } from '../slices/achievementsSlice';

const getAchievementsState = (state) => state.achievements;
function* checkUnlockConditions() {
    const { list, stats, unlockedIds } = yield select(getAchievementsState);
    for (const achievement of list) {
        if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
            yield put(unlockAchievement(achievement.id));
            // audio.play();
        }
    }
}

function* handleSessionComplete() {
    yield put(updateStats({ type: 'sessions', value: 1 }));
    yield put(updateStats({ type: 'minutes', value: 25 }));
    yield checkUnlockConditions();
}

function* handleTaskAction() {
    yield put(updateStats({ type: 'tasks', value: 1 }));
    yield checkUnlockConditions();
}

export function* achievementsSaga() {
    yield all([
        takeEvery('timer/finishSession', handleSessionComplete),
        takeEvery('tasks/toggleTask', handleTaskAction)
    ]);
}