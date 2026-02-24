import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useComboLoadDialog } from '@/hooks/useComboLoadDialog'
import { CharacterElement, CharcterType } from '@/types/combo'

const getSavedCombos = vi.hoisted(() => vi.fn())
const deleteCombo = vi.hoisted(() => vi.fn())

vi.mock('@/lib/storage', () => ({
  getSavedCombos: (...args: unknown[]) => getSavedCombos(...args),
  deleteCombo: (...args: unknown[]) => deleteCombo(...args),
}))

describe('useComboLoadDialog', () => {
  beforeEach(() => {
    getSavedCombos.mockReset()
    deleteCombo.mockReset()
    vi.stubGlobal('alert', vi.fn())
  })

  const mockCombos = [
    {
      name: 'Combo A',
      characters: [
        {
          name: 'character.alpha',
          type: CharcterType.GUARD,
          element: CharacterElement.PHYSICS,
          rarity: 6,
        },
        null,
        null,
        null,
      ],
      actions: [],
    },
  ]

  it('opens dialog and loads saved combos', () => {
    getSavedCombos.mockReturnValue(mockCombos)

    const loadComboState = vi.fn()
    const { result } = renderHook(() => useComboLoadDialog({ loadComboState }))

    act(() => {
      result.current.handleLoadOpen()
    })

    expect(result.current.showLoadDialog).toBe(true)
    expect(result.current.savedCombos).toEqual(mockCombos)
  })

  it('loads a combo and alerts', () => {
    const loadComboState = vi.fn()
    const { result } = renderHook(() => useComboLoadDialog({ loadComboState }))

    act(() => {
      result.current.handleLoad(mockCombos[0])
    })

    expect(loadComboState).toHaveBeenCalledWith(mockCombos[0])
    expect(window.alert).toHaveBeenCalledWith('messages.loaded')
  })

  it('deletes a combo and refreshes list', () => {
    getSavedCombos.mockReturnValueOnce(mockCombos)
    getSavedCombos.mockReturnValueOnce([])

    const loadComboState = vi.fn()
    const { result } = renderHook(() => useComboLoadDialog({ loadComboState }))

    act(() => {
      result.current.handleLoadOpen()
    })

    act(() => {
      result.current.handleDelete('Combo A')
    })

    expect(deleteCombo).toHaveBeenCalledWith('Combo A')
    expect(result.current.savedCombos).toEqual([])
  })
})
