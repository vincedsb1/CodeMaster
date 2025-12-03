import { computed } from 'vue'
import type { Badge } from '@/types/models'

export function useSummaryBadges(badgesSource: { value: Badge[] }) {
  
  const sortedBadges = computed(() => {
    const all = [...badgesSource.value]
    // Unlocked first, then by date
    return all.sort((a, b) => {
      if (a.statut === 'debloque' && b.statut !== 'debloque') return -1
      if (a.statut !== 'debloque' && b.statut === 'debloque') return 1
      if (a.dateDebloque && b.dateDebloque) {
        return new Date(b.dateDebloque).getTime() - new Date(a.dateDebloque).getTime()
      }
      return 0
    })
  })

  return {
    sortedBadges
  }
}
