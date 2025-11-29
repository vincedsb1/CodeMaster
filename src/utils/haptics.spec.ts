import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { haptics } from './haptics'

describe('Haptics Utility', () => {
  const vibrateMock = vi.fn()

  beforeEach(() => {
    // Mock navigator.vibrate
    Object.defineProperty(global.navigator, 'vibrate', {
      value: vibrateMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should call vibrate with 10ms for light tap', () => {
    haptics.light()
    expect(vibrateMock).toHaveBeenCalledWith(10)
  })

  it('should call vibrate with 20ms for medium tap', () => {
    haptics.medium()
    expect(vibrateMock).toHaveBeenCalledWith(20)
  })

  it('should call vibrate with 40ms for heavy tap', () => {
    haptics.heavy()
    expect(vibrateMock).toHaveBeenCalledWith(40)
  })

  it('should call vibrate with pattern for success', () => {
    haptics.success()
    expect(vibrateMock).toHaveBeenCalledWith([30, 50, 30])
  })

  it('should call vibrate with pattern for error', () => {
    haptics.error()
    expect(vibrateMock).toHaveBeenCalledWith([50, 50, 50, 50, 50])
  })

  it('should call vibrate with pattern for celebrate', () => {
    haptics.celebrate()
    expect(vibrateMock).toHaveBeenCalledWith([50, 50, 50, 50, 100, 50, 100])
  })


})
