import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useState } from 'react'

import { useComboControlPanel } from '@/hooks/useComboControlPanel'
import { CharacterElement, CharcterType, SkillType } from '@/types/combo'
import { INITIAL_TEAM_SP, TIMELINE_DURATION } from '@/lib/timeline'

const saveCombo = vi.hoisted(() => vi.fn())
const generateShareUrl = vi.hoisted(() => vi.fn())
const exportAsImage = vi.hoisted(() => vi.fn())

vi.mock('@/lib/storage', () => ({
  saveCombo: (...args: unknown[]) => saveCombo(...args),
  generateShareUrl: (...args: unknown[]) => generateShareUrl(...args),
}))

vi.mock('@/lib/export', () => ({
  exportAsImage: (...args: unknown[]) => exportAsImage(...args),
}))

describe('useComboControlPanel', () => {
  beforeEach(() => {
    saveCombo.mockClear()
    generateShareUrl.mockClear()
    exportAsImage.mockClear()
    vi.stubGlobal('alert', vi.fn())
    vi.stubGlobal('confirm', vi.fn(() => true))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn() },
      configurable: true,
    })
  })

  const setupHook = () => {
    return renderHook(() => {
      const [comboName, setComboName] = useState('Combo Name')
      const [characters, setCharacters] = useState([
        {
          name: 'character.alpha',
          type: CharcterType.GUARD,
          element: CharacterElement.PHYSICS,
          rarity: 6,
        },
        null,
        null,
        null,
      ])
      const [actions, setActions] = useState([
        {
          id: 'action-1',
          characterId: 'character.alpha',
          type: SkillType.NORMAL,
          timing: 500,
        },
      ])
      const [timelineDurationMs, setTimelineDurationMs] = useState(25000)
      const [initialTeamSp, setInitialTeamSp] = useState(150)
      const [initialUltimateCharges, setInitialUltimateCharges] = useState([10, 20, 30, 40])

      return {
        comboName,
        characters,
        actions,
        timelineDurationMs,
        initialTeamSp,
        initialUltimateCharges,
        ...useComboControlPanel({
          comboName,
          characters,
          actions,
          timelineDurationMs,
          initialTeamSp,
          initialUltimateCharges,
          setComboName,
          setCharacters,
          setActions,
          setTimelineDurationMs,
          setInitialTeamSp,
          setInitialUltimateCharges,
        }),
      }
    })
  }

  it('saves combos and alerts', () => {
    const { result } = setupHook()

    act(() => {
      result.current.handleSave()
    })

    expect(saveCombo).toHaveBeenCalledWith({
      name: 'Combo Name',
      characters: result.current.characters,
      actions: result.current.actions,
      timelineDurationMs: 25000,
      initialTeamSp: 150,
      initialUltimateCharges: [10, 20, 30, 40],
    })
    expect(window.alert).toHaveBeenCalledWith('messages.saved')
  })

  it('exports image and handles errors', async () => {
    exportAsImage.mockResolvedValueOnce(undefined)
    exportAsImage.mockRejectedValueOnce(new Error('failed'))

    const { result } = setupHook()

    await act(async () => {
      await result.current.handleExportImage()
    })
    expect(exportAsImage).toHaveBeenCalledWith('combo-timeline', 'Combo Name.png')
    expect(window.alert).toHaveBeenCalledWith('messages.exported')

    await act(async () => {
      await result.current.handleExportImage()
    })
    expect(window.alert).toHaveBeenCalledWith('messages.exportFailed')
  })

  it('shares combos and copies URL', () => {
    generateShareUrl.mockReturnValue('https://example.com?combo=123')
    const { result } = setupHook()

    act(() => {
      result.current.handleShare()
    })

    expect(generateShareUrl).toHaveBeenCalled()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com?combo=123')
    expect(window.alert).toHaveBeenCalledWith('messages.urlCopied')
  })

  it('clears combo state after confirmation', () => {
    const { result } = setupHook()

    act(() => {
      result.current.handleClear()
    })

    expect(result.current.comboName).toBe('dialog.comboNamePlaceholder')
    expect(result.current.characters).toEqual([null, null, null, null])
    expect(result.current.actions).toEqual([])
    expect(result.current.timelineDurationMs).toBe(TIMELINE_DURATION)
    expect(result.current.initialTeamSp).toBe(INITIAL_TEAM_SP)
    expect(result.current.initialUltimateCharges).toEqual([0, 0, 0, 0])
  })
})
