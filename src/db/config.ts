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

      // Store Categories
      if (!db.objectStoreNames.contains(DB_CONFIG.STORES.CATEGORIES)) {
        const cStore = db.createObjectStore(DB_CONFIG.STORES.CATEGORIES, {
          keyPath: 'id',
        })
        cStore.createIndex('label', 'label', { unique: true })
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
  callback: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T> {
  const db = await dbPromise
  return new Promise((resolve, reject) => {
    try {
      console.log(`[dbOp] Starting transaction on ${storeName} (${mode})`)
      const tx = db.transaction(storeName, mode)
      const store = tx.objectStore(storeName)

      let resolved = false

      tx.oncomplete = () => {
        console.log(`[dbOp] Transaction complete for ${storeName}`)
        if (!resolved) {
          console.log(`[dbOp] Resolving with undefined (no explicit result)`)
          resolved = true
          resolve(undefined as T)
        }
      }

      tx.onerror = () => {
        console.error('[dbOp] Transaction error:', tx.error)
        if (!resolved) {
          resolved = true
          reject(tx.error)
        }
      }

      const req = callback(store)

      if (req && typeof req === 'object' && 'onsuccess' in req) {
        ;(req as IDBRequest<T>).onsuccess = () => {
          console.log(`[dbOp] Request success for ${storeName}`, (req as IDBRequest<T>).result)
          if (!resolved) {
            resolved = true
            resolve((req as IDBRequest<T>).result)
          }
        }

        ;(req as IDBRequest<T>).onerror = () => {
          console.error('[dbOp] Request error:', (req as IDBRequest<T>).error)
          if (!resolved) {
            resolved = true
            reject((req as IDBRequest<T>).error)
          }
        }
      }
    } catch (err) {
      console.error('[dbOp] Caught error:', err)
      reject(err)
    }
  })
}
