import confetti from 'canvas-confetti'

/**
 * Triggers a celebratory confetti explosion.
 * Uses canvas-confetti for high performance rendering.
 */
export function triggerConfetti() {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // Since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}

/**
 * Triggers a simple burst from the center
 */
export function triggerBurst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2563EB', '#F59E0B', '#10B981', '#EF4444'] // Project colors
  })
}
