import { useTranslations } from 'next-intl'
import type { Dispatch, SetStateAction } from 'react'

import { getNormalAttackDurationMs } from '@/lib/data/attacks'
import { COMBO_SKILLS, ULTIMATES } from '@/lib/data/skills'
import { BATTLE_SKILL_SP_COST, buildSpTimeline } from '@/lib/timeline'
import { getComboSkillTriggerWindows } from '@/lib/comboRequirements'
import { SkillType } from '@/types/combo'

import type { ComboAction } from '@/types/combo'

type GetOperatorIdFromCharacterId = (characterId: string) => string | null

interface UseComboActionsOptions {
  setActions: Dispatch<SetStateAction<ComboAction[]>>
  getOperatorIdFromCharacterId: GetOperatorIdFromCharacterId
  initialTeamSp: number
  timelineDurationMs: number
}

export const useComboActions = ({
  setActions,
  getOperatorIdFromCharacterId,
  initialTeamSp,
  timelineDurationMs,
}: UseComboActionsOptions) => {
  const t = useTranslations()
  const getActionOverlapDurationMs = (action: ComboAction) => {
    if (action.type === SkillType.NORMAL) {
      const operatorId = getOperatorIdFromCharacterId(action.characterId)
      if (!operatorId) return 0
      return getNormalAttackDurationMs(operatorId)
    }

    if (action.type === SkillType.COMBO_SKILL) {
      const operatorId = getOperatorIdFromCharacterId(action.characterId)
      if (!operatorId) return 1000
      return (
        COMBO_SKILLS[`${operatorId}_combo_skill`]?.cooldown ??
        COMBO_SKILLS[`${operatorId}.combo_skill`]?.cooldown ??
        1000
      )
    }

    if (action.type === SkillType.ULTIMATE) {
      const operatorId = getOperatorIdFromCharacterId(action.characterId)
      if (!operatorId) return 1000
      return (
        ULTIMATES[`${operatorId}_ultimate`]?.cooldown ??
        ULTIMATES[`${operatorId}.ultimate`]?.cooldown ??
        1000
      )
    }

    return 1000
  }

  const hasOverlapInLane = (candidate: ComboAction, actions: ComboAction[]) => {
    const candidateDuration = getActionOverlapDurationMs(candidate)
    if (candidateDuration <= 0) return false

    const isSameLane = (action: ComboAction) => {
      if (candidate.type !== action.type) return false
      if (candidate.type === SkillType.NORMAL) return true
      return candidate.characterId === action.characterId
    }

    const candidateStart = candidate.timing
    const candidateEnd = candidate.timing + candidateDuration

    return actions.some((action) => {
      if (action.id === candidate.id) return false
      if (!isSameLane(action)) return false
      const duration = getActionOverlapDurationMs(action)
      if (duration <= 0) return false
      const start = action.timing
      const end = action.timing + duration
      return candidateStart < end && start < candidateEnd
    })
  }
  const handleAddAction = (characterId: string, type: SkillType, timing: number) => {
    setActions((prev) => {
      const operatorId = getOperatorIdFromCharacterId(characterId)
      const newAction: ComboAction = {
        id: `${Date.now()}-${Math.random()}`,
        characterId,
        type,
        timing,
      }

      if (type === SkillType.NORMAL) {
        if (operatorId) {
          const durationMs = getNormalAttackDurationMs(operatorId)
          const newStart = timing
          const newEnd = timing + durationMs
          const hasOverlap = prev
            .filter((action) => action.type === SkillType.NORMAL)
            .some((action) => {
              const existingStart = action.timing
              const existingEnd = action.timing + durationMs
              return newStart < existingEnd && existingStart < newEnd
            })
          if (hasOverlap) {
            alert(t('messages.normalAttackOverlap'))
            return prev
          }
        }
      }

      if (type === SkillType.COMBO_SKILL && operatorId) {
        const windows = getComboSkillTriggerWindows(operatorId, prev, timelineDurationMs, 100)
        const isInWindow = windows.some((w) => timing >= w.start && timing < w.end)
        if (!isInWindow) {
          alert(t('messages.comboSkillNotInWindow'))
          return prev
        }

        const cooldownMs =
          COMBO_SKILLS[`${operatorId}_combo_skill`]?.cooldown ??
          COMBO_SKILLS[`${operatorId}.combo_skill`]?.cooldown
        if (cooldownMs) {
          const newStart = timing
          const newEnd = timing + cooldownMs
          const hasOverlap = prev
            .filter((action) => action.type === SkillType.COMBO_SKILL && action.characterId === characterId)
            .some((action) => {
              const existingStart = action.timing
              const existingEnd = action.timing + cooldownMs
              return newStart < existingEnd && existingStart < newEnd
            })
          if (hasOverlap) {
            alert(t('messages.comboSkillOverlap'))
            return prev
          }
        }
      }

      if (type === SkillType.ULTIMATE && operatorId) {
        const cooldownMs =
          ULTIMATES[`${operatorId}_ultimate`]?.cooldown ?? ULTIMATES[`${operatorId}.ultimate`]?.cooldown
        if (cooldownMs) {
          const newStart = timing
          const newEnd = timing + cooldownMs
          const hasOverlap = prev
            .filter((action) => action.type === SkillType.ULTIMATE && action.characterId === characterId)
            .some((action) => {
              const existingStart = action.timing
              const existingEnd = action.timing + cooldownMs
              return newStart < existingEnd && existingStart < newEnd
            })
          if (hasOverlap) {
            alert(t('messages.ultimateOverlap'))
            return prev
          }
        }
      }

      if (type === SkillType.BATTLE_SKILL) {
        const hasOverlap = hasOverlapInLane(newAction, prev)
        if (hasOverlap) {
          alert(t('messages.battleSkillOverlap'))
          return prev
        }
        const { minSp } = buildSpTimeline([...prev, newAction], initialTeamSp, BATTLE_SKILL_SP_COST, timelineDurationMs)
        if (minSp < 0) {
          alert(t('messages.spInsufficient', { cost: BATTLE_SKILL_SP_COST }))
          return prev
        }
      }

      return [...prev, newAction]
    })
  }

  const handleRemoveAction = (actionId: string) => setActions((prev) => prev.filter((action) => action.id !== actionId))

  const handleMoveAction = (actionId: string, nextTiming: number) => {
    setActions((prev) => {
      const target = prev.find((action) => action.id === actionId)
      if (!target) return prev
      if (target.timing === nextTiming) return prev

      const updatedAction = { ...target, timing: nextTiming }
      const nextActions = prev.map((action) => (action.id === actionId ? updatedAction : action))

      if (hasOverlapInLane(updatedAction, prev)) {
        if (updatedAction.type === SkillType.NORMAL) {
          alert(t('messages.normalAttackOverlap'))
        } else if (updatedAction.type === SkillType.COMBO_SKILL) {
          alert(t('messages.comboSkillOverlap'))
        } else if (updatedAction.type === SkillType.ULTIMATE) {
          alert(t('messages.ultimateOverlap'))
        } else if (updatedAction.type === SkillType.BATTLE_SKILL) {
          alert(t('messages.battleSkillOverlap'))
        }
        return prev
      }

      if (updatedAction.type === SkillType.BATTLE_SKILL) {
        const { minSp } = buildSpTimeline(nextActions, initialTeamSp, BATTLE_SKILL_SP_COST, timelineDurationMs)
        if (minSp < 0) {
          alert(t('messages.spInsufficient', { cost: BATTLE_SKILL_SP_COST }))
          return prev
        }
      }

      return nextActions
    })
  }

  return {
    handleAddAction,
    handleRemoveAction,
    handleMoveAction,
  }
}
