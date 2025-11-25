/**
 * IndexedDB Configuration and Initialization
 */

import { DB_CONFIG } from '@/types/constants'

export const dbPromise = initDatabase()

function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_CONFIG.NAME, DB_CONFIG.VERSION)

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result

      // Store Questions
      if (!db.objectStoreNames.contains(DB_CONFIG.STORES.QUESTIONS)) {
        const qStore = db.createObjectStore(DB_CONFIG.STORES.QUESTIONS, {
          keyPath: 'id',
        })
        qStore.createIndex('countApparition', 'countApparition', { unique: false })
      }

      // Store Sessions
      if (!db.objectStoreNames.contains(DB_CONFIG.STORES.SESSIONS)) {
        const sStore = db.createObjectStore(DB_CONFIG.STORES.SESSIONS, {
          keyPath: 'sessionId',
        })
        sStore.createIndex('dateFin', 'dateFin', { unique: false })
      }

      // Store Meta (Badges, etc)
      if (!db.objectStoreNames.contains(DB_CONFIG.STORES.META)) {
        db.createObjectStore(DB_CONFIG.STORES.META, { keyPath: 'id' })
      }
    }

    req.onsuccess = () => {
      resolve((req as IDBOpenDBRequest).result)
    }

    req.onerror = () => {
      reject((req as IDBOpenDBRequest).error)
    }
  })
}

export async function dbOp<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await dbPromise
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode)
    const store = tx.objectStore(storeName)
    const req = callback(store)

    req.onsuccess = () => {
      resolve(req.result)
    }

    req.onerror = () => {
      reject(req.error)
    }
  })
}
