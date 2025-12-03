import { describe, it, expect } from 'vitest'
import { useSummaryBadges } from './useSummaryBadges'
import { ref } from 'vue'
import type { Badge } from '@/types/models'

describe('useSummaryBadges', () => {
  it('should sort badges with unlocked first', () => {
    const badges = ref<Badge[]>([
      { id: '1', nom: 'B1', description: '', statut: 'verrouille' },
      { id: '2', nom: 'B2', description: '', statut: 'debloque', dateDebloque: '2023-01-01' },
    ])

    const { sortedBadges } = useSummaryBadges(badges)
    
    expect(sortedBadges.value[0]?.id).toBe('2')
    expect(sortedBadges.value[1]?.id).toBe('1')
  })

  it('should sort unlocked badges by date descending', () => {
    const badges = ref<Badge[]>([
      { id: '1', nom: 'B1', description: '', statut: 'debloque', dateDebloque: '2023-01-01' },
      { id: '2', nom: 'B2', description: '', statut: 'debloque', dateDebloque: '2023-01-02' },
    ])

    const { sortedBadges } = useSummaryBadges(badges)
    
    expect(sortedBadges.value[0]?.id).toBe('2')
    expect(sortedBadges.value[1]?.id).toBe('1')
  })
})
