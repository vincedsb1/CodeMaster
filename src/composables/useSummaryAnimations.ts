import { ref } from 'vue'
import { calculateLevel, xpForNextLevel } from '@/logic/gamification'
import { triggerConfetti } from '@/utils/confetti'

export function useSummaryAnimations() {
  const displayScore = ref(0)
  const displayXp = ref(0)
  const displayBonusXp = ref(0)
  const currentDisplayedLevel = ref(1)
  const currentBarProgress = ref(0)
  const isLevelUp = ref(false)
  const levelsGained = ref(0)

  function animateScore(targetScore: number, duration: number = 2000) {
    const startScore = 0
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      displayScore.value = Math.round(startScore + (targetScore - startScore) * progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        displayScore.value = targetScore
      }
    }

    animate()
  }

  function getXpRangeForLevel(level: number) {
    const start = xpForNextLevel(level - 1)
    const end = xpForNextLevel(level)
    return { start, end, range: end - start }
  }

  function animateXpSequence(
    startLevelValue: number,
    previousTotalXp: number,
    totalXp: number,
    xpGainValue: number,
    baseXpGain: number,
    bonusXpGain: number,
    isDailyChallenge: boolean
  ) {
    let currentAnimLevel = startLevelValue
    currentDisplayedLevel.value = currentAnimLevel
    
    // Initial progress setup
    const { start: initialStart, range: initialRange } = getXpRangeForLevel(currentAnimLevel)
    const initialProgress = previousTotalXp - initialStart
    currentBarProgress.value = (initialProgress / (initialRange > 0 ? initialRange : 1)) * 100

    const duration = 2000
    const startTime = Date.now()

    const frame = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // Cubic ease out

      const currentInterpolatedXp = Math.floor(previousTotalXp + (xpGainValue * ease))

      // Update display numbers for gain
      displayXp.value = Math.round((baseXpGain || 0) * ease)
      if (isDailyChallenge) {
        const bonusEase = Math.max(0, (ease - 0.5) * 2)
        displayBonusXp.value = Math.round((bonusXpGain || 0) * bonusEase)
      } else {
        displayXp.value = Math.round(xpGainValue * ease)
      }

      // Update Level and Bar
      const calculatedLevel = calculateLevel(currentInterpolatedXp)

      if (calculatedLevel > currentAnimLevel) {
        currentAnimLevel = calculatedLevel
        isLevelUp.value = true
        levelsGained.value = currentAnimLevel - startLevelValue
      }

      currentDisplayedLevel.value = currentAnimLevel

      const { start, range } = getXpRangeForLevel(currentAnimLevel)
      const progressInLevel = currentInterpolatedXp - start
      const percentage = (progressInLevel / (range > 0 ? range : 1)) * 100

      currentBarProgress.value = Math.min(100, Math.max(0, percentage))

      if (progress < 1) {
        requestAnimationFrame(frame)
      }
    }
    requestAnimationFrame(frame)
  }

  function createConfetti() {
    triggerConfetti()
  }

  return {
    displayScore,
    displayXp,
    displayBonusXp,
    currentDisplayedLevel,
    currentBarProgress,
    isLevelUp,
    levelsGained,
    animateScore,
    animateXpSequence,
    createConfetti
  }
}
