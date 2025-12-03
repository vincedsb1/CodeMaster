/**
 * Data Access Layer - Repository pattern for IndexedDB operations
 */

import type { Question, QuizSession, Badge, Category } from '@/types/models'
import { DB_CONFIG } from '@/types/constants'
import { dbOp, dbPromise } from './config'

/**
 * QUESTIONS OPERATIONS
 */
export const questionRepository = {
  async getAll(): Promise<Question[]> {
    return dbOp(DB_CONFIG.STORES.QUESTIONS, 'readonly', (store) => store.getAll())
  },

  async getById(id: string): Promise<Question | undefined> {
    return dbOp(DB_CONFIG.STORES.QUESTIONS, 'readonly', (store) => store.get(id))
  },

  async save(question: Question): Promise<void> {
    return dbOp(DB_CONFIG.STORES.QUESTIONS, 'readwrite', (store) => {
      return store.put(question) as any
    })
  },

  async saveMany(questions: Question[]): Promise<void> {
    const db = await dbPromise
    const tx = db.transaction(DB_CONFIG.STORES.QUESTIONS, 'readwrite')
    const store = tx.objectStore(DB_CONFIG.STORES.QUESTIONS)

    return new Promise((resolve, reject) => {
      try {
        questions.forEach((q) => store.put(q))
        tx.oncomplete = () => {
          console.log('[Repository] saveMany transaction complete')
          resolve()
        }
        tx.onerror = () => {
          console.error('[Repository] saveMany transaction error:', tx.error)
          reject(tx.error)
        }
      } catch (err) {
        console.error('[Repository] saveMany error:', err)
        reject(err)
      }
    })
  },

  async clear(): Promise<void> {
    const db = await dbPromise
    const tx = db.transaction(DB_CONFIG.STORES.QUESTIONS, 'readwrite')
    const store = tx.objectStore(DB_CONFIG.STORES.QUESTIONS)

    return new Promise((resolve, reject) => {
      try {
        store.clear()
        tx.oncomplete = () => {
          console.log('[Repository] clear transaction complete')
          resolve()
        }
        tx.onerror = () => {
          console.error('[Repository] clear transaction error:', tx.error)
          reject(tx.error)
        }
      } catch (err) {
        console.error('[Repository] clear error:', err)
        reject(err)
      }
    })
  },

  async incrementApparition(id: string): Promise<void> {
    const question = await this.getById(id)
    if (question) {
      question.countApparition++
      await this.save(question)
    }
  },

  async incrementCorrect(id: string): Promise<void> {
    const question = await this.getById(id)
    if (question) {
      question.countBonneReponse++
      await this.save(question)
    }
  },
}

/**
 * SESSIONS OPERATIONS
 */
export const sessionRepository = {
  async getAll(): Promise<QuizSession[]> {
    return dbOp(DB_CONFIG.STORES.SESSIONS, 'readonly', (store) => store.getAll())
  },

  async getById(sessionId: string): Promise<QuizSession | undefined> {
    return dbOp(DB_CONFIG.STORES.SESSIONS, 'readonly', (store) => store.get(sessionId))
  },

  async save(session: QuizSession): Promise<void> {
    try {
      console.log('[Repository] Saving session:', session.sessionId)
      const cleaned = JSON.parse(JSON.stringify(session))
      console.log('[Repository] Session cleaned, putting to store...')
      return dbOp(DB_CONFIG.STORES.SESSIONS, 'readwrite', (store) => {
        console.log('[Repository] Inside dbOp callback, putting session...')
        const req = store.put(cleaned)
        console.log('[Repository] Put called successfully')
        return req as any
      })
    } catch (err) {
      console.error('[Repository] Error in save:', err)
      throw err
    }
  },

  async delete(sessionId: string): Promise<void> {
    return dbOp(DB_CONFIG.STORES.SESSIONS, 'readwrite', (store) => {
      return store.delete(sessionId) as any
    })
  },

  async getPendingSession(): Promise<QuizSession | undefined> {
    const sessions = await this.getAll()
    return sessions.find((s) => s.dateFin === null)
  },

  async getCompleted(): Promise<QuizSession[]> {
    const sessions = await this.getAll()
    return sessions.filter((s) => s.dateFin !== null)
  },

  async clear(): Promise<void> {
    return dbOp(DB_CONFIG.STORES.SESSIONS, 'readwrite', (store) => {
      store.clear()
      return { result: undefined } as any
    })
  },
}

/**
 * METADATA OPERATIONS (Badges, etc)
 */
export const metaRepository = {
  async get(key: string): Promise<any> {
    return dbOp(DB_CONFIG.STORES.META, 'readonly', (store) => store.get(key))
  },

  async save(key: string, data: any): Promise<void> {
    try {
      console.log('[Repository] metaRepository.save called for key:', key)
      const obj = { id: key, ...data }
      console.log('[Repository] Object to save:', obj)
      return dbOp(DB_CONFIG.STORES.META, 'readwrite', (store) => {
        console.log('[Repository] Putting object to meta store...')
        return store.put(obj) as any
      })
    } catch (err) {
      console.error('[Repository] Error in metaRepository.save:', err)
      throw err
    }
  },

  async getBadges(): Promise<Badge[]> {
    const meta = await this.get('badges')
    return meta?.list || []
  },

  async saveBadges(badges: Badge[]): Promise<void> {
    try {
      console.log('[Repository] saveBadges called with', badges.length, 'badges')
      console.log('[Repository] Badges to save:', badges)
      return this.save('badges', { list: badges })
    } catch (err) {
      console.error('[Repository] Error in saveBadges:', err)
      throw err
    }
  },
}

/**
 * CATEGORIES OPERATIONS
 */
export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    return dbOp(DB_CONFIG.STORES.CATEGORIES, 'readonly', (store) => store.getAll())
  },

  async getById(id: string): Promise<Category | undefined> {
    return dbOp(DB_CONFIG.STORES.CATEGORIES, 'readonly', (store) => store.get(id))
  },

  async getByLabel(label: string): Promise<Category | undefined> {
    return dbOp(DB_CONFIG.STORES.CATEGORIES, 'readonly', (store) => {
      return store.index('label').get(label)
    })
  },

  async save(category: Category): Promise<void> {
    console.log('[Repo] save called with category:', category)
    // Double serialization to ensure no Proxies at all
    const serialized = JSON.parse(JSON.stringify(category))
    console.log('[Repo] After JSON serialization:', serialized)

    return new Promise((resolve, reject) => {
      try {
        dbOp(DB_CONFIG.STORES.CATEGORIES, 'readwrite', (store) => {
          console.log('[Repo] About to call store.put with:', serialized)
          const req = store.put(serialized)
          console.log('[Repo] store.put request created')
          return req
        }).then(() => {
          console.log('[Repo] Save completed')
          resolve()
        }).catch((err) => {
          console.error('[Repo] dbOp failed:', err)
          reject(err)
        })
      } catch (err) {
        console.error('[Repo] Caught synchronous error:', err)
        reject(err)
      }
    })
  },

  async update(category: Category): Promise<void> {
    console.log('[Repo] update called with category:', category)
    // Double serialization to ensure no Proxies at all
    const serialized = JSON.parse(JSON.stringify(category))
    console.log('[Repo] After JSON serialization:', serialized)

    return new Promise((resolve, reject) => {
      try {
        dbOp(DB_CONFIG.STORES.CATEGORIES, 'readwrite', (store) => {
          console.log('[Repo] About to call store.put with:', serialized)
          const req = store.put(serialized)
          console.log('[Repo] store.put request created')
          return req
        }).then(() => {
          console.log('[Repo] Update completed')
          resolve()
        }).catch((err) => {
          console.error('[Repo] dbOp failed:', err)
          reject(err)
        })
      } catch (err) {
        console.error('[Repo] Caught synchronous error:', err)
        reject(err)
      }
    })
  },

  async delete(id: string): Promise<void> {
    console.log('[Repo] delete called with id:', id)
    return new Promise((resolve, reject) => {
      try {
        dbOp(DB_CONFIG.STORES.CATEGORIES, 'readwrite', (store) => {
          console.log('[Repo] About to call store.delete with:', id)
          const req = store.delete(id)
          console.log('[Repo] store.delete request created')
          return req
        }).then(() => {
          console.log('[Repo] Delete completed')
          resolve()
        }).catch((err) => {
          console.error('[Repo] dbOp failed:', err)
          reject(err)
        })
      } catch (err) {
        console.error('[Repo] Caught synchronous error:', err)
        reject(err)
      }
    })
  },

  async deleteByLabel(label: string): Promise<void> {
    const category = await this.getByLabel(label)
    if (category) {
      await this.delete(category.id)
    }
  },

  async saveMany(categories: Category[]): Promise<void> {
    const db = await dbPromise
    const tx = db.transaction(DB_CONFIG.STORES.CATEGORIES, 'readwrite')
    const store = tx.objectStore(DB_CONFIG.STORES.CATEGORIES)

    return new Promise((resolve, reject) => {
      categories.forEach((c) => store.put(JSON.parse(JSON.stringify(c))))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  },

  async clear(): Promise<void> {
    return dbOp(DB_CONFIG.STORES.CATEGORIES, 'readwrite', (store) => {
      store.clear()
      return { result: undefined } as any
    })
  },
}
