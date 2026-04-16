import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useState } from 'react'

import { useComboActions } from '@/hooks/useComboActions'
import { SkillType } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

const buildSpTimelineMock = vi.hoisted(() => vi.fn(() => ({ points: [], minSp: 0 })))
const getNormalAttackDurationMsMock = vi.hoisted(() => vi.fn(() => 1000))
const getPlungeAttackDurationMsMock = vi.hoisted(() => vi.fn(() => 300))
const getComboSkillTriggerWindowsMock = vi.hoisted(() => vi.fn(() => []))

vi.mock('@/lib/timeline', () => ({
  BATTLE_SKILL_SP_COST: 100,
  buildSpTimeline: (...args: unknown[]) => buildSpTimelineMock(...args),
}))

vi.mock('@/lib/data/attacks', () => ({
  getNormalAttackDurationMs: (...args: unknown[]) => getNormalAttackDurationMsMock(...args),
  getPlungeAttackDurationMs: (...args: unknown[]) => getPlungeAttackDurationMsMock(...args),
}))

vi.mock('@/lib/data/skills', () => ({
  COMBO_SKILLS: {
    op_combo_skill: { cooldown: 1000 },
  },
  ULTIMATES: {
    op_ultimate: { cooldown: 1000 },
  },
}))

vi.mock('@/lib/comboRequirements', () => ({
  getComboSkillTriggerWindows: (...args: unknown[]) => getComboSkillTriggerWindowsMock(...args),
}))

describe('useComboActions', () => {
  beforeEach(() => {
    buildSpTimelineMock.mockClear()
    getNormalAttackDurationMsMock.mockClear()
    getPlungeAttackDurationMsMock.mockClear()
    getComboSkillTriggerWindowsMock.mockClear()
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

  it('removes an action by id', () => {
    const { result } = setupHook()

    act(() => {
      result.current.handleRemoveAction('action-1')
    })

    expect(result.current.actions).toHaveLength(0)
  })

  it('does nothing when handleMoveAction is called with the same timing', () => {
    const { result } = setupHook()

    act(() => {
      result.current.handleMoveAction('action-1', 0)
    })

    // No alert, timing unchanged
    expect(window.alert).not.toHaveBeenCalled()
    expect(result.current.actions.find((a) => a.id === 'action-1')?.timing).toBe(0)
  })

  it('prevents adding a battle skill when it overlaps an existing battle skill', () => {
    const { result } = renderHook(() => {
      const [actions, setActions] = useState([
        { id: 'bs-1', characterId: 'character.alpha', type: SkillType.BATTLE_SKILL, timing: 0 },
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

    // bs-1 occupies [0, 1000); adding at t=500 overlaps
    act(() => {
      result.current.handleAddAction('character.alpha', SkillType.BATTLE_SKILL, 500)
    })

    expect(window.alert).toHaveBeenCalledWith('messages.battleSkillOverlap')
    expect(result.current.actions).toHaveLength(1)
  })

  describe('combo skill actions', () => {
    it('blocks adding a combo skill when timing is outside trigger windows', () => {
      getComboSkillTriggerWindowsMock.mockReturnValueOnce([])

      const { result } = setupHook()

      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.COMBO_SKILL, 5000)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.comboSkillNotInWindow')
      expect(result.current.actions).toHaveLength(1)
    })

    it('adds a combo skill when timing is inside a trigger window', () => {
      getComboSkillTriggerWindowsMock.mockReturnValueOnce([{ start: 0, end: 10000 }])

      const { result } = setupHook()

      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.COMBO_SKILL, 5000)
      })

      expect(window.alert).not.toHaveBeenCalled()
      expect(result.current.actions).toHaveLength(2)
    })

    it('blocks adding a combo skill that overlaps an existing one', () => {
      getComboSkillTriggerWindowsMock.mockReturnValue([{ start: 0, end: 10000 }])

      const { result } = renderHook(() => {
        const [actions, setActions] = useState([
          { id: 'cs-1', characterId: 'character.alpha', type: SkillType.COMBO_SKILL, timing: 0 },
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

      // cs-1 occupies [0, 1000); adding at t=500 overlaps
      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.COMBO_SKILL, 500)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.comboSkillOverlap')
      expect(result.current.actions).toHaveLength(1)
    })
  })

  describe('ultimate actions', () => {
    it('adds an ultimate when there is no overlap', () => {
      const { result } = setupHook()

      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.ULTIMATE, 5000)
      })

      expect(window.alert).not.toHaveBeenCalled()
      expect(result.current.actions).toHaveLength(2)
    })

    it('blocks adding an ultimate that overlaps an existing one', () => {
      const { result } = renderHook(() => {
        const [actions, setActions] = useState([
          { id: 'ult-1', characterId: 'character.alpha', type: SkillType.ULTIMATE, timing: 0 },
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

      // ult-1 occupies [0, 1000); adding at t=500 overlaps
      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.ULTIMATE, 500)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.ultimateOverlap')
      expect(result.current.actions).toHaveLength(1)
    })
  })

  describe('plunge attack actions', () => {
    const setupPlungeHook = (initialActions: ComboAction[] = [
      { id: 'action-1', characterId: 'character.alpha', type: SkillType.NORMAL, timing: 0 },
    ]) =>
      renderHook(() => {
        const [actions, setActions] = useState(initialActions)
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

    it('adds a plunge attack at a non-overlapping timing', () => {
      const { result } = setupPlungeHook()

      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.NORMAL, 2000, true)
      })

      expect(window.alert).not.toHaveBeenCalled()
      expect(result.current.actions).toHaveLength(2)
      expect(result.current.actions[1].isPlunge).toBe(true)
    })

    it('blocks a plunge attack that overlaps an existing normal attack', () => {
      // Normal attack at t=0, duration=1000ms → occupies [0, 1000)
      const { result } = setupPlungeHook()

      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.NORMAL, 500, true)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.plungeAttackOverlap')
      expect(result.current.actions).toHaveLength(1)
    })

    it('blocks a normal attack that overlaps an existing plunge attack', () => {
      const { result } = setupPlungeHook([
        { id: 'action-1', characterId: 'character.alpha', type: SkillType.NORMAL, timing: 0, isPlunge: true },
      ])

      // plunge at t=0, duration=300ms → occupies [0, 300)
      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.NORMAL, 200)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.normalAttackOverlap')
      expect(result.current.actions).toHaveLength(1)
    })

    it('blocks a plunge attack that overlaps another plunge attack', () => {
      const { result } = setupPlungeHook([
        { id: 'action-1', characterId: 'character.alpha', type: SkillType.NORMAL, timing: 0, isPlunge: true },
      ])

      // plunge at t=0, duration=300ms; adding at t=200 overlaps
      act(() => {
        result.current.handleAddAction('character.alpha', SkillType.NORMAL, 200, true)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.plungeAttackOverlap')
      expect(result.current.actions).toHaveLength(1)
    })

    it('alerts plungeAttackOverlap when moving a plunge attack into a normal attack', () => {
      const { result } = renderHook(() => {
        const [actions, setActions] = useState([
          { id: 'normal-1', characterId: 'character.alpha', type: SkillType.NORMAL, timing: 0 },
          { id: 'plunge-1', characterId: 'character.alpha', type: SkillType.NORMAL, timing: 2000, isPlunge: true },
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
        result.current.handleMoveAction('plunge-1', 500)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.plungeAttackOverlap')
      expect(result.current.actions.find((a) => a.id === 'plunge-1')?.timing).toBe(2000)
    })
  })

  describe('handleMoveAction overlap alerts by skill type', () => {
    const setupTwoActionHook = (type: SkillType) =>
      renderHook(() => {
        const [actions, setActions] = useState([
          { id: 'action-1', characterId: 'character.alpha', type, timing: 0 },
          { id: 'action-2', characterId: 'character.alpha', type, timing: 2000 },
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

    it('alerts normalAttackOverlap when moving a normal attack into another', () => {
      const { result } = setupTwoActionHook(SkillType.NORMAL)

      act(() => {
        result.current.handleMoveAction('action-2', 500)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.normalAttackOverlap')
      expect(result.current.actions.find((a) => a.id === 'action-2')?.timing).toBe(2000)
    })

    it('alerts comboSkillOverlap when moving a combo skill into another', () => {
      const { result } = setupTwoActionHook(SkillType.COMBO_SKILL)

      act(() => {
        result.current.handleMoveAction('action-2', 500)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.comboSkillOverlap')
      expect(result.current.actions.find((a) => a.id === 'action-2')?.timing).toBe(2000)
    })

    it('alerts ultimateOverlap when moving an ultimate into another', () => {
      const { result } = setupTwoActionHook(SkillType.ULTIMATE)

      act(() => {
        result.current.handleMoveAction('action-2', 500)
      })

      expect(window.alert).toHaveBeenCalledWith('messages.ultimateOverlap')
      expect(result.current.actions.find((a) => a.id === 'action-2')?.timing).toBe(2000)
    })
  })

  it('blocks moving a battle skill when SP becomes insufficient', () => {
    buildSpTimelineMock.mockReturnValueOnce({ points: [], minSp: -1 })

    const { result } = renderHook(() => {
      const [actions, setActions] = useState([
        { id: 'bs-1', characterId: 'character.alpha', type: SkillType.BATTLE_SKILL, timing: 0 },
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
      result.current.handleMoveAction('bs-1', 5000)
    })

    expect(window.alert).toHaveBeenCalledWith('messages.spInsufficient')
    expect(result.current.actions.find((a) => a.id === 'bs-1')?.timing).toBe(0)
  })
})
