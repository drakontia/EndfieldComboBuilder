import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useState } from 'react'

import { useComboActions } from '@/hooks/useComboActions'
import { SkillType } from '@/types/combo'

const buildSpTimelineMock = vi.hoisted(() => vi.fn(() => ({ points: [], minSp: 0 })))
const getNormalAttackDurationMsMock = vi.hoisted(() => vi.fn(() => 1000))

vi.mock('@/lib/timeline', () => ({
  BATTLE_SKILL_SP_COST: 100,
  buildSpTimeline: (...args: unknown[]) => buildSpTimelineMock(...args),
}))

vi.mock('@/lib/data/attacks', () => ({
  getNormalAttackDurationMs: (...args: unknown[]) => getNormalAttackDurationMsMock(...args),
}))

vi.mock('@/lib/data/skills', () => ({
  COMBO_SKILLS: {
    op_combo_skill: { cooldown: 1000 },
  },
  ULTIMATES: {
    op_ultimate: { cooldown: 1000 },
  },
}))

describe('useComboActions', () => {
  beforeEach(() => {
    buildSpTimelineMock.mockClear()
    getNormalAttackDurationMsMock.mockClear()
    vi.stubGlobal('alert', vi.fn())
  })

  const setupHook = () => {
    return renderHook(() => {
      const [actions, setActions] = useState([
        {
          id: 'action-1',
          characterId: 'character.alpha',
          type: SkillType.NORMAL,
          timing: 0,
        },
      ])
      return {
        actions,
        ...useComboActions({
          setActions,
          getOperatorIdFromCharacterId: () => 'op',
          initialTeamSp: 200,
          timelineDurationMs: 30000,
        }),
      }
    })
  }

  it('prevents overlapping normal attacks', () => {
    const { result } = setupHook()

    act(() => {
      result.current.handleAddAction('character.alpha', SkillType.NORMAL, 500)
    })

    expect(window.alert).toHaveBeenCalledWith('messages.normalAttackOverlap')
    expect(result.current.actions).toHaveLength(1)

    act(() => {
      result.current.handleAddAction('character.alpha', SkillType.NORMAL, 1500)
    })

    expect(result.current.actions).toHaveLength(2)
  })

  it('blocks battle skill when SP is insufficient', () => {
    buildSpTimelineMock.mockReturnValueOnce({ points: [], minSp: -1 })
    const { result } = setupHook()

    act(() => {
      result.current.handleAddAction('character.alpha', SkillType.BATTLE_SKILL, 1000)
    })

    expect(window.alert).toHaveBeenCalledWith('messages.spInsufficient')
    expect(result.current.actions).toHaveLength(1)
  })

  it('prevents moving actions into overlapping lanes', () => {
    const { result } = renderHook(() => {
      const [actions, setActions] = useState([
        {
          id: 'action-1',
          characterId: 'character.alpha',
          type: SkillType.BATTLE_SKILL,
          timing: 0,
        },
        {
          id: 'action-2',
          characterId: 'character.alpha',
          type: SkillType.BATTLE_SKILL,
          timing: 2000,
        },
      ])
      return {
        actions,
        ...useComboActions({
          setActions,
          getOperatorIdFromCharacterId: () => 'op',
          initialTeamSp: 200,
          timelineDurationMs: 30000,
        }),
      }
    })

    act(() => {
      result.current.handleMoveAction('action-2', 500)
    })

    expect(window.alert).toHaveBeenCalledWith('messages.battleSkillOverlap')
    expect(result.current.actions.find((action) => action.id === 'action-2')?.timing).toBe(2000)
  })
})
