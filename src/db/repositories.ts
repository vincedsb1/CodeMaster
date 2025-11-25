/**
 * Data Access Layer - Repository pattern for IndexedDB operations
 */

import type { Question, QuizSession, Badge } from '@/types/models'
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
      store.put(question)
      return { result: undefined } as any
    })
  },

  async saveMany(questions: Question[]): Promise<void> {
    const db = await dbPromise
    const tx = db.transaction(DB_CONFIG.STORES.QUESTIONS, 'readwrite')
    const store = tx.objectStore(DB_CONFIG.STORES.QUESTIONS)

    return new Promise((resolve, reject) => {
      questions.forEach((q) => store.put(q))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  },

  async clear(): Promise<void> {
    return dbOp(DB_CONFIG.STORES.QUESTIONS, 'readwrite', (store) => {
      store.clear()
      return { result: undefined } as any
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
    return dbOp(DB_CONFIG.STORES.SESSIONS, 'readwrite', (store) => {
      // Deep clone to avoid reference issues
      store.put(JSON.parse(JSON.stringify(session)))
      return { result: undefined } as any
    })
  },

  async delete(sessionId: string): Promise<void> {
    return dbOp(DB_CONFIG.STORES.SESSIONS, 'readwrite', (store) => {
      store.delete(sessionId)
      return { result: undefined } as any
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
    return dbOp(DB_CONFIG.STORES.META, 'readwrite', (store) => {
      store.put({ id: key, ...data })
      return { result: undefined } as any
    })
  },

  async getBadges(): Promise<Badge[]> {
    const meta = await this.get('badges')
    return meta?.list || []
  },

  async saveBadges(badges: Badge[]): Promise<void> {
    return this.save('badges', { list: badges })
  },
}
