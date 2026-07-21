import api from '@api/client'
import { db, AppDB, SyncQueueItem } from '@/infrastructure/database/db'

type SyncMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type AddSyncQueueItem = {
  method: SyncMethod
  url: string
  data?: unknown
  entity?: 'tasks' | 'settings' | 'tags'
  entityId?: string
}

const MAX_RETRIES = 5
let syncing = false

const isTransientError = (error: any) => {
  if (error.code === 'ERR_NETWORK') return true
  if (error.message === 'Network Error') return true

  const status = error.response?.status
  return status >= 500 || status === 408 || status === 429
}

const mergeData = (a: unknown, b: unknown) => ({
  ...(typeof a === 'object' && a ? a : {}),
  ...(typeof b === 'object' && b ? b : {}),
})

const compactQueue = async (item: AddSyncQueueItem): Promise<boolean> => {
  if (!item.entity || !item.entityId) return false

  const existing = await db.syncQueue
    .where('[entity+entityId]')
    .equals([item.entity, item.entityId])
    .toArray()

  if (!existing.length) return false

  if (item.method === 'DELETE') {
    await db.syncQueue.bulkDelete(existing.map((entry) => entry.id))
    return false
  }

  const pendingCreate = existing.find((entry) => entry.method === 'POST')

  if (pendingCreate && item.method === 'PATCH') {
    await db.syncQueue.update(pendingCreate.id, {
      data: mergeData(pendingCreate.data, item.data),
      ts: Date.now(),
    })

    return true
  }

  if (item.method === 'PATCH') {
    const pendingUpdate = existing.find((entry) => entry.method === 'PATCH')

    if (pendingUpdate) {
      await db.syncQueue.update(pendingUpdate.id, {
        data: mergeData(pendingUpdate.data, item.data),
        ts: Date.now(),
      })

      return true
    }
  }

  return false
}

export const addToSyncQueue = async (req: AddSyncQueueItem) => {
  const absorbed = await compactQueue(req)
  if (absorbed) return

  if (req.entity && req.entityId) {
    const existing = await db.syncQueue
      .where('[entity+entityId]')
      .equals([req.entity, req.entityId])
      .toArray()

    if (existing.some((item) => item.method === req.method)) return
  }

  const item: SyncQueueItem = {
    ...req,
    id: crypto.randomUUID(),
    retries: 0,
    ts: Date.now(),
  }

  await db.syncQueue.put(item)
}

const getQueue = () => db.syncQueue.orderBy('ts').toArray()

const applySyncedEntity = async (item: SyncQueueItem, responseData: any) => {
  if (item.method === 'DELETE' && item.entityId) {
    if (item.entity === 'tasks') await db.tasks.delete(item.entityId)
    else if (item.entity === 'tags') await db.tags.delete(item.entityId)
    return
  }

  if (!responseData?.id) return

  if (item.entity === 'tasks') {
    if (item.method === 'POST' && item.entityId && item.entityId !== responseData.id) {
      await db.tasks.delete(item.entityId)
    }
    await db.tasks.put({
      ...responseData,
      syncStatus: 'synced',
      updatedAt: Date.now(),
      deletedAt: null,
    })
  } else if (item.entity === 'tags') {
    await db.tags.put({
      ...responseData,
      id: responseData.id,
      syncStatus: 'synced',
      updatedAt: Date.now(),
      deletedAt: null,
    })
  }
}

let lastSyncTime = 0
let lastPullTime = 0
const SYNC_COOLDOWN_MS = 5000 // 5 seconds cooldown
const PULL_THROTTLE_MS = 15000 // 15 seconds pull throttle when queue is empty

export const processSyncQueue = async () => {
  if (syncing || !navigator.onLine) return

  const token = localStorage.getItem('token');
  if (!token) return;
  
  const now = Date.now()
  if (now - lastSyncTime < SYNC_COOLDOWN_MS) return
  
  syncing = true
  lastSyncTime = now

  try {
    const queue = await getQueue()

    if (queue.length > 0) {
      const mutations = queue.map(item => {
        let operation = 'UPDATE'
        if (item.method === 'POST') operation = 'CREATE'
        else if (item.method === 'DELETE') operation = 'DELETE'
        else if (item.method === 'PATCH' || item.method === 'PUT') operation = 'UPDATE'

        return {
          clientMutationId: item.id,
          entityType: item.entity || 'unknown',
          entityId: item.entityId || '',
          operation,
          payload: item.data as any
        }
      })

      try {
        const { SyncControllerService } = await import('@/infrastructure/api/generated')

        await SyncControllerService.push({ mutations })

        for (const item of queue) {
          await db.syncQueue.delete(item.id)
        }
      } catch (error: any) {
        const status = error?.status || error?.response?.status
        if (status === 401 || status === 500) {
          console.warn('Sync push auth error. Token may need refresh. Will retry next cycle.')
          for (const item of queue) {
            const newRetries = (item.retries || 0) + 1
            if (newRetries >= MAX_RETRIES) {
              console.warn(`Dropping sync item ${item.id} after ${MAX_RETRIES} retries`)
              await db.syncQueue.delete(item.id)
            } else {
              await db.syncQueue.update(item.id, { retries: newRetries })
            }
          }
        } else {
          console.error('Error pushing mutations:', error)
          for (const item of queue) {
            const newRetries = (item.retries || 0) + 1
            if (newRetries >= MAX_RETRIES) {
              await db.syncQueue.delete(item.id)
            } else {
              await db.syncQueue.update(item.id, { retries: newRetries })
            }
          }
        }
      }
    }

    // Now pull updates (throttled if no local mutations occurred)
    const shouldPull = queue.length > 0 || (now - lastPullTime >= PULL_THROTTLE_MS)
    if (shouldPull) {
      lastPullTime = now
      try {
        const lastSync = localStorage.getItem('ataraxia_lastSyncCursor') || undefined
        const params = new URLSearchParams()
        if (lastSync) params.set('cursor', lastSync)
        params.set('limit', '100')
        params.set('entityTypes', 'tasks,settings,tags')

        const { data: response } = await api.get(`/sync/pull?${params.toString()}`)

      if (response.changes && response.changes.length > 0) {
        const entityToTable: Record<string, keyof AppDB> = {
          tasks: 'tasks',
          settings: 'settings',
          tags: 'tags',
        }

        for (const change of response.changes) {
          if (!change.entityId || !change.entityType) continue

          const tableName = entityToTable[change.entityType]
          if (!tableName || !db[tableName]) continue

          const table = db[tableName] as any

          try {
            if (change.operation === 'DELETE') {
              await table.delete(change.entityId)
            } else if (change.payload) {
              const base = tableName === 'settings'
                ? { syncStatus: 'synced', updatedAt: Date.now() }
                : { syncStatus: 'synced', updatedAt: Date.now(), deletedAt: null }

              await table.put({
                ...(change.payload as any),
                ...base,
                id: change.entityId,
              })
            }
          } catch (err) {
            console.error(`Error applying change for ${change.entityType}/${change.entityId}:`, err)
          }
        }
      }

      if (response.nextCursor) {
        localStorage.setItem('ataraxia_lastSyncCursor', response.nextCursor)
      }
    } catch (error: any) {
      if (error?.status === 401 || error?.response?.status === 401) {
        console.warn('Sync pull unauthorized (token may be expired). Will retry next cycle.')
      } else if (error?.status === 500 || error?.response?.status === 500) {
        console.error('Server error on pull, clearing cursor to unstuck...', error)
        localStorage.removeItem('ataraxia_lastSyncCursor')
      } else {
        console.error('Error pulling updates:', error)
      }
    }
  }

  } finally {
    syncing = false
  }
}

export const clearSyncQueue = async () => {
  await db.syncQueue.clear()
}

export const getSyncQueueSize = async (): Promise<number> => {
  return db.syncQueue.count()
}

export const initSyncListener = () => {
  window.addEventListener('online', () => {
    processSyncQueue()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      processSyncQueue()
    }
  })
}
