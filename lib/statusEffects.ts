import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction, getStatusEffectForciblyForAction } from '@/lib/data/skills'
import { getStatusEffectDurationMs } from '@/lib/timeline'
import {
  ArtsInfliction,
  ArtsReaction,
  Buff,
  Debuff,
  PhysicalStatus,
  SkillType,
  SpecialEffect,
  type ComboAction,
} from '@/types/combo'

type StatusEffect = PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff

export type ConsumedStatusEffectEvent = {
  effect: ArtsReaction | SpecialEffect | ArtsInfliction
  timing: number
}

type ResolvedActionEffect = {
  action: ComboAction
  effects: StatusEffect[]
}

const normalizeStatusEffects = (
  statusEffect: ReturnType<typeof getStatusEffectForAction>
): StatusEffect[] => {
  if (!statusEffect) return []
  return Array.isArray(statusEffect) ? statusEffect : [statusEffect]
}

const countActiveStacks = (
  resolved: ResolvedActionEffect[],
  time: number,
  targetEffect: StatusEffect
) => {
  let count = 0

  resolved.forEach(({ action, effects }) => {
    if (!effects.includes(targetEffect)) return

    const effectStartTime = action.timing
    const effectEndTime = action.timing + getStatusEffectDurationMs(targetEffect)

    if (time >= effectStartTime && time < effectEndTime) {
      count += 1
    }
  })

  return Math.min(4, count)
}

const isConsumableStatusEffect = (
  effect: StatusEffect
): effect is ArtsReaction | SpecialEffect | ArtsInfliction => {
  return (
    Object.values(ArtsReaction).includes(effect as ArtsReaction) ||
    Object.values(SpecialEffect).includes(effect as SpecialEffect) ||
    Object.values(ArtsInfliction).includes(effect as ArtsInfliction)
  )
}

const getEarliestConsumptionTime = (
  events: ConsumedStatusEffectEvent[],
  effect: ArtsReaction | SpecialEffect | ArtsInfliction,
  startTime: number
) => {
  let earliest: number | null = null

  events.forEach((event) => {
    if (event.effect !== effect) return
    if (event.timing < startTime) return
    if (earliest === null || event.timing < earliest) {
      earliest = event.timing
    }
  })

  return earliest
}

const isStatusEffectActiveAtTime = (
  resolved: ResolvedActionEffect[],
  time: number,
  targetEffect: StatusEffect,
  consumedEvents: ConsumedStatusEffectEvent[]
) => {
  for (const { action, effects } of resolved) {
    if (!effects.includes(targetEffect)) continue

    const effectStartTime = action.timing
    const effectEndTime = action.timing + getStatusEffectDurationMs(targetEffect)

    if (time >= effectStartTime && time < effectEndTime) {
      if (isConsumableStatusEffect(targetEffect)) {
        const consumedAt = getEarliestConsumptionTime(consumedEvents, targetEffect, effectStartTime)
        if (consumedAt !== null && time >= consumedAt) continue
      }

      return true
    }
  }

  return false
}

export const buildResolvedStatusEffectState = (
  actions: ComboAction[]
): { resolvedEffects: Map<string, StatusEffect[]>; consumedEvents: ConsumedStatusEffectEvent[] } => {
  const resolvedEffects = new Map<string, StatusEffect[]>()
  const resolvedList: ResolvedActionEffect[] = []
  const consumedEvents: ConsumedStatusEffectEvent[] = []
  const sortedActions = [...actions].sort((a, b) => {
    if (a.timing !== b.timing) return a.timing - b.timing
    return a.id.localeCompare(b.id)
  })

  sortedActions.forEach((action) => {
    const operatorId = getOperatorIdByName(action.characterId)
    const baseEffects = normalizeStatusEffects(
      getStatusEffectForAction(operatorId, action.type)
    )
    const forciblyEffects = normalizeStatusEffects(
      getStatusEffectForciblyForAction(operatorId, action.type)
    )

    if (operatorId === 'fluorite' && action.type === SkillType.COMBO_SKILL) {
      const cryoStacks = countActiveStacks(resolvedList, action.timing, ArtsInfliction.CRYO)
      const natureStacks = countActiveStacks(resolvedList, action.timing, ArtsInfliction.NATURE)

      let effects: StatusEffect[] = []
      if (cryoStacks >= 2) {
        effects = [ArtsInfliction.CRYO]
      } else if (natureStacks >= 2) {
        effects = [ArtsInfliction.NATURE]
      }

      resolvedEffects.set(action.id, effects)
      resolvedList.push({ action, effects })
      return
    }

    let effects = [...baseEffects, ...forciblyEffects]

    if (operatorId === 'ardelia' && action.type === SkillType.BATTLE_SKILL) {
      const isCorrosionActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsReaction.CORROSION,
        consumedEvents
      )

      effects = isCorrosionActive ? baseEffects : []

      if (isCorrosionActive) {
        consumedEvents.push({ effect: ArtsReaction.CORROSION, timing: action.timing })
      }
    }

    if (operatorId === 'yvonne' && action.type === SkillType.BATTLE_SKILL) {
      const isCryoActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsInfliction.CRYO,
        consumedEvents
      )
      const isNatureActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsInfliction.NATURE,
        consumedEvents
      )

      if (isCryoActive) {
        effects = [ArtsReaction.FREEZE]
        consumedEvents.push({ effect: ArtsInfliction.CRYO, timing: action.timing })
      } else if (isNatureActive) {
        effects = [ArtsReaction.FREEZE]
        consumedEvents.push({ effect: ArtsInfliction.NATURE, timing: action.timing })
      } else {
        effects = []
      }
    }

    if (operatorId === 'alesh' && action.type === SkillType.BATTLE_SKILL) {
      const isCryoActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsInfliction.CRYO,
        consumedEvents
      )

      if (isCryoActive) {
        effects = [ArtsReaction.FREEZE]
        consumedEvents.push({ effect: ArtsInfliction.CRYO, timing: action.timing })
      } else {
        effects = []
      }
    }

    if (operatorId === 'wolfgard' && action.type === SkillType.BATTLE_SKILL) {
      const isCombustionActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsReaction.COMBUSTION,
        consumedEvents
      )
      const isShockActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsReaction.SHOCK,
        consumedEvents
      )

      if (isCombustionActive) {
        effects = []
        consumedEvents.push({ effect: ArtsReaction.COMBUSTION, timing: action.timing })
      } else if (isShockActive) {
        effects = []
        consumedEvents.push({ effect: ArtsReaction.SHOCK, timing: action.timing })
      } else {
        effects = [ArtsInfliction.HEAT]
      }
    }

    if (operatorId === 'arclight' && action.type === SkillType.BATTLE_SKILL) {
      const isShockActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        ArtsReaction.SHOCK,
        consumedEvents
      )

      if (isShockActive) {
        consumedEvents.push({ effect: ArtsReaction.SHOCK, timing: action.timing })
      }
      effects = []
    }

    if (operatorId === 'last_rite' && action.type === SkillType.NORMAL) {
      const isColdInfusionActive = isStatusEffectActiveAtTime(
        resolvedList,
        action.timing,
        Buff.COLD_INFUSION,
        consumedEvents
      )

      if (isColdInfusionActive) {
        effects = [...baseEffects, ArtsInfliction.CRYO]
      }
    }

    resolvedEffects.set(action.id, effects)
    resolvedList.push({ action, effects })
  })

  return { resolvedEffects, consumedEvents }
}

export const buildResolvedStatusEffectsByAction = (
  actions: ComboAction[]
): Map<string, StatusEffect[]> => {
  return buildResolvedStatusEffectState(actions).resolvedEffects
}
