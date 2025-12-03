import { computed } from 'vue'
import type { Question, Difficulty } from '@/types/models'

/**
 * Composable for Quiz UI Styling logic.
 * Helps keep components clean and logic testable.
 */
export function useQuizStyles() {
  
  // Difficulty Badge Colors
  const getDifficultyColorClass = (difficulty: Difficulty | string): string => {
    const map: Record<string, string> = {
      'facile': 'bg-green-100/60 text-green-700',
      'moyen': 'bg-amber-100/60 text-amber-700',
      'difficile': 'bg-red-100/60 text-red-700',
      'random': 'bg-purple-100/60 text-purple-700'
    }
    return map[difficulty] || 'bg-gray-100 text-gray-700'
  }

  // Answer Option Styling
  const getAnswerClasses = (
    index: number,
    selectedAnswerIndex: number | null,
    correctAnswerIndex: number,
    hasAnswered: boolean
  ): string => {
    
    // Base interaction classes when not answered
    if (!hasAnswered) {
      return 'bg-white border-gray-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-gray-50/50 active:scale-[0.98] cursor-pointer'
    }

    const isCorrect = index === correctAnswerIndex
    const isSelected = index === selectedAnswerIndex

    // Selected & Correct (Green)
    if (isSelected && isCorrect) {
      return 'bg-green-50/40 border-green-200/50 shadow-[0_4px_12px_rgba(16,185,129,0.15)] ring-1 ring-green-200/50'
    }

    // Selected & Wrong (Red)
    if (isSelected && !isCorrect) {
      return 'bg-red-50/40 border-red-200/50 shadow-[0_4px_12px_rgba(239,68,68,0.15)] ring-1 ring-red-200/50'
    }

    // Not Selected but Correct (Green tint hint)
    if (!isSelected && isCorrect) {
      return 'bg-green-50/20 border-green-100/50'
    }

    // Not Selected & Not Correct (Dimmed)
    return 'bg-gray-50/30 border-gray-100/30 opacity-60'
  }

  // Option Letter Badge Styling (A, B, C, D)
  const getBadgeClasses = (
    index: number,
    selectedAnswerIndex: number | null,
    correctAnswerIndex: number,
    hasAnswered: boolean
  ): string => {
    
    if (!hasAnswered) {
      return 'bg-blue-100 text-blue-700'
    }

    const isCorrect = index === correctAnswerIndex
    const isSelected = index === selectedAnswerIndex

    if (isSelected && isCorrect) {
      return 'bg-green-600 text-white'
    }

    if (isSelected && !isCorrect) {
      return 'bg-red-600 text-white'
    }

    if (!isSelected && isCorrect) {
      return 'bg-green-100 text-green-700'
    }

    return 'bg-gray-100 text-gray-400'
  }

  return {
    getDifficultyColorClass,
    getAnswerClasses,
    getBadgeClasses
  }
}
