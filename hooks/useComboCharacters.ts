import type { Dispatch, SetStateAction } from 'react'

import type { Operator } from '@/types/combo'

export const createEmptyCharacters = (): (Operator | null)[] => Array(4).fill(null)

export const useComboCharacters = (
  setCharacters: Dispatch<SetStateAction<(Operator | null)[]>>,
  setInitialUltimateCharges: Dispatch<SetStateAction<number[]>>
) => {
  const handleCharacterSelect = (character: Operator | null, index: number) => {
    setCharacters((prev) => {
      const next = [...prev]
      next[index] = character
      return next
    })
  }

  const handleCharacterReorder = (fromIndex: number, toIndex: number) => {
    setCharacters((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    setInitialUltimateCharges((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved ?? 0)
      return next
    })
  }

  return {
    handleCharacterSelect,
    handleCharacterReorder,
  }
}
