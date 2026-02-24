import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useState } from 'react'

import { useComboCharacters } from '@/hooks/useComboCharacters'
import { CharacterElement, CharcterType } from '@/types/combo'
import type { Operator } from '@/types/combo'

const operatorA = {
  name: 'character.alpha',
  type: CharcterType.GUARD,
  element: CharacterElement.PHYSICS,
  rarity: 6,
}

const operatorB = {
  name: 'character.beta',
  type: CharcterType.CASTER,
  element: CharacterElement.CRYO,
  rarity: 5,
}

describe('useComboCharacters', () => {
  it('selects characters and reorders with charges', () => {
    const { result } = renderHook(() => {
      const [characters, setCharacters] = useState<(Operator | null)[]>([null, null, null, null])
      const [charges, setCharges] = useState<number[]>([0, 10, 20, 30])
      return {
        characters,
        charges,
        ...useComboCharacters(setCharacters, setCharges),
      }
    })

    act(() => {
      result.current.handleCharacterSelect(operatorA, 1)
    })

    expect(result.current.characters[1]).toEqual(operatorA)

    act(() => {
      result.current.handleCharacterSelect(operatorB, 0)
    })

    act(() => {
      result.current.handleCharacterReorder(0, 2)
    })

    expect(result.current.characters[2]).toEqual(operatorB)
    expect(result.current.charges).toEqual([10, 20, 0, 30])
  })
})
