import { tasksService } from './tasks.service';
import { timersService } from './timers.service';
import { settingsService } from './settings.service';

let isSyncingActive = false;

export const syncManager = {
    async syncAll() {
        if (isSyncingActive || !navigator.onLine) return;

        isSyncingActive = true;
        console.log("SyncManager: Iniciando sincronización global");

        try {
            await this.syncTasks();
            await this.syncTimers();
            await this.syncSettings();
        } finally {
            isSyncingActive = false;
        }
    },

    async syncTasks() {
        const queue = this.getQueue('outbox_tasks');
        if (queue.length === 0) return;

        for (const task of [...queue]) {
            if (!navigator.onLine) break;
            try {
                await tasksService.create({ title: task.title, tag: task.tag }, true);
                this.removeFromQueue('outbox_tasks', task.tempId);
                console.log(`Tarea sincronizada: ${task.title}`);
            } catch (err: any) {
                if (!err.response) break;
                this.removeFromQueue('outbox_tasks', task.tempId);
            }
        }
    },

    async syncTimers() {
        const queue = this.getQueue('outbox_timers');
        if (queue.length === 0) return;

        for (const session of [...queue]) {
            if (!navigator.onLine) break;
            try {
                await timersService.saveSession(session, true);
                this.removeFromQueue('outbox_timers', session.tempId);
                console.log("Sesión de timer sincronizada.");
            } catch (err: any) {
                if (!err.response) break;
                this.removeFromQueue('outbox_timers', session.tempId);
            }
        }
    },

    async syncSettings() {
        const queue = this.getQueue('outbox_settings');
        if (queue.length === 0) return;
        const lastSetting = queue[queue.length - 1];
        try {
            await settingsService.updateSettings(lastSetting, true);
            localStorage.removeItem('outbox_settings');
            console.log("Ajustes sincronizados.");
        } catch (err) {
            console.warn("Error de red en Settings.");
        }
    },

    getQueue(key: string) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return [];
        }
    },

    addToQueue(key: string, data: any) {
        const queue = this.getQueue(key);
        localStorage.setItem(key, JSON.stringify([...queue, data]));
    },

    removeFromQueue(key: string, tempId: string) {
        const queue = this.getQueue(key);
        const newQueue = queue.filter((t: any) => t.tempId !== tempId);
        localStorage.setItem(key, JSON.stringify(newQueue));
    }
};

let syncDebounce: any;
window.addEventListener('online', () => {
    clearTimeout(syncDebounce);
    syncDebounce = setTimeout(() => syncManager.syncAll(), 5000);
});