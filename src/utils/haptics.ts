/**
 * Haptic Feedback Utility
 * Uses the Vibration API to provide tactile feedback.
 * Safe to use even if the API is not supported (checks navigator.vibrate).
 */

// Check if vibration is supported
const isVibrationSupported = () => typeof navigator !== 'undefined' && 'vibrate' in navigator

export const haptics = {
  // Light tap (for UI interactions like clicks)
  light: () => {
    if (isVibrationSupported()) navigator.vibrate(10)
  },

  // Medium tap (for standard actions)
  medium: () => {
    if (isVibrationSupported()) navigator.vibrate(20)
  },

  // Heavy tap (for important actions)
  heavy: () => {
    if (isVibrationSupported()) navigator.vibrate(40)
  },

  // Success pattern (two quick pulses)
  success: () => {
    if (isVibrationSupported()) navigator.vibrate([30, 50, 30])
  },

  // Error pattern (long buzz)
  error: () => {
    if (isVibrationSupported()) navigator.vibrate([50, 50, 50, 50, 50])
  },

  // Level up or Badge unlock (celebratory pattern)
  celebrate: () => {
    if (isVibrationSupported()) navigator.vibrate([50, 50, 50, 50, 100, 50, 100])
  },
}
