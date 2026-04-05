import { COMBO_SKILLS } from '@/lib/data/skills'
import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
import { getNormalAttackDurationMs } from '@/lib/data/attacks'
import { buildResolvedStatusEffectState } from '@/lib/statusEffects'
import { getStatusEffectDurationMs, COMBO_SKILL_EXECUTION_WINDOW_MS } from '@/lib/timeline'
import {
  ArtsInfliction,
  ArtsReaction,
  PhysicalStatus,
  SpecialEffect,
  Buff,
  Debuff,
  SkillType,
  type ComboAction,
} from '@/types/combo'

const SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT = 2

export interface StatusEffectInstance {
  effect: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff
  startTime: number
  endTime: number
}

const CRASH_STACK_CONSUMPTION_WINDOW_MS = 1000
const CRASH_STACK_MAX = 4
const CRASH_STACK_EFFECTS = new Set<PhysicalStatus>([
  PhysicalStatus.VULNERABLE,
  PhysicalStatus.LIFT,
  PhysicalStatus.KNOCKDOWN,
])
const CRASH_STACK_CONSUME_EFFECTS = new Set<PhysicalStatus>([
  PhysicalStatus.CRUSH,
  PhysicalStatus.SHATTER,
])

const getActionStatusEffects = (
  action: ComboAction,
  resolvedEffects: Map<string, StatusEffectInstance['effect'][]>
): Array<PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff> => {
  return resolvedEffects.get(action.id) ?? []
}

const getStatusEffectStackCountAtTime = (
  actions: ComboAction[],
  time: number,
  targetEffect: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff,
  resolvedEffects: Map<string, StatusEffectInstance['effect'][]>,
  consumedEvents: Array<{ effect: ArtsReaction | SpecialEffect; timing: number }>
) => {
  let count = 0

  actions.forEach((action) => {
    const statusEffects = getActionStatusEffects(action, resolvedEffects)
    if (!statusEffects.includes(targetEffect)) return

    const effectStartTime = action.timing
    const effectEndTime = action.timing + getStatusEffectDurationMs(targetEffect)

    if (time >= effectStartTime && time < effectEndTime) {
      if (
        (Object.values(ArtsReaction).includes(targetEffect as ArtsReaction) ||
          Object.values(SpecialEffect).includes(targetEffect as SpecialEffect)) &&
        consumedEvents.some(
          (event) =>
            event.effect === targetEffect &&
            event.timing >= effectStartTime &&
            event.timing <= time
        )
      ) {
        return
      }
      count += 1
    }
  })

  return Math.min(4, count)
}

const getCrashStackConsumptionWindows = (
  actions: ComboAction[],
  consumesBy: PhysicalStatus[]
): Array<{ start: number; end: number }> => {
  const sorted = [...actions].sort((a, b) => a.timing - b.timing)
  const windows: Array<{ start: number; end: number }> = []
  let crashStacks = 0
  const resolvedEffects = buildResolvedStatusEffectState(actions).resolvedEffects

  sorted.forEach((action) => {
    const effects = getActionStatusEffects(action, resolvedEffects).filter((effect): effect is PhysicalStatus =>
      Object.values(PhysicalStatus).includes(effect as PhysicalStatus)
    )

    if (effects.length === 0) return

    const consumeEffects = effects.filter(
      (effect) => CRASH_STACK_CONSUME_EFFECTS.has(effect) && consumesBy.includes(effect)
    )
    const stackEffects = effects.filter((effect) => CRASH_STACK_EFFECTS.has(effect))

    if (consumeEffects.length > 0 && crashStacks > 0) {
      windows.push({
        start: action.timing,
        end: action.timing + CRASH_STACK_CONSUMPTION_WINDOW_MS,
      })
      crashStacks = 0
    }

    if (stackEffects.length > 0) {
      crashStacks = Math.min(CRASH_STACK_MAX, crashStacks + stackEffects.length)
    }
  })

  return windows
}

/**
 * 指定された時刻でアクティブなステータス効果を取得
 */
export const getActiveStatusEffectsAtTime = (
  actions: ComboAction[],
  time: number
): Set<PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff> => {
  const activeEffects = new Set<PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff>()
  const { resolvedEffects, consumedEvents } = buildResolvedStatusEffectState(actions)

  actions.forEach((action) => {
    const statusEffects = getActionStatusEffects(action, resolvedEffects)

    if (statusEffects.length === 0) return

    const effectStartTime = action.timing

    statusEffects.forEach((effect) => {
      const effectEndTime = action.timing + getStatusEffectDurationMs(effect)

      // 指定された時刻にステータス効果がアクティブか確認
      if (
        time >= effectStartTime &&
        time < effectEndTime &&
        !(
          (Object.values(ArtsReaction).includes(effect as ArtsReaction) ||
            Object.values(SpecialEffect).includes(effect as SpecialEffect)) &&
          consumedEvents.some(
            (event) =>
              event.effect === effect &&
              event.timing >= effectStartTime &&
              event.timing <= time
          )
        )
      ) {
        activeEffects.add(effect)
      }
    })
  })

  return activeEffects
}

/**
 * 指定時刻においてサポートクリスタルが消耗済み（回復回数0）かチェック
 * 条件: SUPPORT_CRYSTAL が付与された後、NORMAL 攻撃が SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT 回以上あった
 */
export const checkSupportCrystalExhausted = (
  actions: ComboAction[],
  time: number
): boolean => {
  const sortedActions = [...actions]
    .filter((a) => a.timing <= time)
    .sort((a, b) => a.timing - b.timing)

  let isActive = false
  let recoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT

  for (const action of sortedActions) {
    const operatorId = getOperatorIdByName(action.characterId)
    const statusEffect = getStatusEffectForAction(operatorId, action.type)

    if (statusEffect?.includes(Buff.SUPPORT_CRYSTAL)) {
      isActive = true
      recoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
      continue
    }

    if (isActive && action.type === SkillType.NORMAL) {
      const attackEndTime = action.timing + getNormalAttackDurationMs(operatorId ?? '')
      if (attackEndTime <= time) {
        recoveryCount = Math.max(0, recoveryCount - 1)
        if (recoveryCount === 0) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * 連携技の発動条件を満たしているかチェック
 */
export const canActivateComboSkill = (
  operatorId: string,
  actions: ComboAction[],
  time: number
): { canActivate: boolean; missingEffects: string[] } => {
  const comboSkill = Object.values(COMBO_SKILLS).find(
    (skill) => skill.operatorId === operatorId
  )

  if (!comboSkill) {
    return { canActivate: false, missingEffects: ['連携技が見つかりません'] }
  }

  const requirement = comboSkill.requirement

  // statusEffectsのチェック
  if (requirement.statusEffects && requirement.statusEffects.length > 0) {
    const activeEffects = getActiveStatusEffectsAtTime(actions, time)
    const missingEffects: string[] = []

    // 必要なステータス効果のいずれか1つが存在すればOK
    const hasRequiredEffect = requirement.statusEffects.some((requiredEffect) =>
      activeEffects.has(requiredEffect)
    )

    if (!hasRequiredEffect) {
      requirement.statusEffects.forEach((effect) => {
        missingEffects.push(String(effect))
      })
      return { canActivate: false, missingEffects }
    }
  }

  if (requirement.statusEffectStackRequirements && requirement.statusEffectStackRequirements.length > 0) {
    const { resolvedEffects, consumedEvents } = buildResolvedStatusEffectState(actions)
    const hasRequiredStacks = requirement.statusEffectStackRequirements.some(({ effect, minStacks }) => {
      return (
        getStatusEffectStackCountAtTime(actions, time, effect, resolvedEffects, consumedEvents) >= minStacks
      )
    })

    if (!hasRequiredStacks) {
      const missingEffects = requirement.statusEffectStackRequirements.map(
        ({ effect, minStacks }) => `${String(effect)}_stack_${minStacks}`
      )
      return { canActivate: false, missingEffects }
    }
  }

  if (requirement.requiresCrashStackConsumptionBy && requirement.requiresCrashStackConsumptionBy.length > 0) {
    const windows = getCrashStackConsumptionWindows(actions, requirement.requiresCrashStackConsumptionBy)
    const isWithinWindow = windows.some((window) => time >= window.start && time < window.end)

    if (!isWithinWindow) {
      return { canActivate: false, missingEffects: ['crash_stack_consumption'] }
    }
  }

  if (requirement.requiresSupportCrystalRecoveryZero) {
    if (!checkSupportCrystalExhausted(actions, time)) {
      return { canActivate: false, missingEffects: ['support_crystal_exhausted'] }
    }
  }

  if (requirement.excludedStatusEffects && requirement.excludedStatusEffects.length > 0) {
    const activeEffects = getActiveStatusEffectsAtTime(actions, time)
    const hasExcluded = requirement.excludedStatusEffects.some((e) => activeEffects.has(e))
    if (hasExcluded) {
      return { canActivate: false, missingEffects: ['excluded_status_effect_present'] }
    }
  }

  if (requirement.requiresHeavyAttack) {
    const hasRecentHeavyAttack = actions.some((a) => {
      if (a.type !== SkillType.NORMAL) return false
      if (getOperatorIdByName(a.characterId) !== operatorId) return false
      const heavyAttackEndTime = a.timing + getNormalAttackDurationMs(operatorId)
      return heavyAttackEndTime <= time && time < heavyAttackEndTime + COMBO_SKILL_EXECUTION_WINDOW_MS
    })
    if (!hasRecentHeavyAttack) {
      return { canActivate: false, missingEffects: ['requires_heavy_attack'] }
    }
  }

  if (requirement.requiresTeamComboSkillDamage) {
    const hasRecentTeamComboSkill = actions.some((a) => {
      if (a.type !== SkillType.COMBO_SKILL) return false
      if (getOperatorIdByName(a.characterId) === operatorId) return false
      return a.timing <= time && time < a.timing + COMBO_SKILL_EXECUTION_WINDOW_MS
    })
    if (!hasRecentTeamComboSkill) {
      return { canActivate: false, missingEffects: ['requires_team_combo_skill_damage'] }
    }
  }

  if (requirement.requiresStatusEffectConsumed && requirement.requiresStatusEffectConsumed.length > 0) {
    const { resolvedEffects, consumedEvents } = buildResolvedStatusEffectState(actions)
    const hasRecentConsumption = actions.some((action) => {
      const effects = resolvedEffects.get(action.id) ?? []
      return requirement.requiresStatusEffectConsumed!.some((requiredEffect) => {
        if (!effects.includes(requiredEffect)) return false
        // consumedEventsによる消費（明示的トリガー）
        const consumedViaEvent = consumedEvents.some(
          (e) =>
            e.effect === (requiredEffect as ArtsReaction | SpecialEffect) &&
            e.timing >= action.timing &&
            e.timing <= time &&
            e.timing + COMBO_SKILL_EXECUTION_WINDOW_MS > time
        )
        if (consumedViaEvent) return true
        // 継続時間終了による消費
        const expiryTime = action.timing + getStatusEffectDurationMs(requiredEffect)
        return expiryTime <= time && time < expiryTime + COMBO_SKILL_EXECUTION_WINDOW_MS
      })
    })
    if (!hasRecentConsumption) {
      return { canActivate: false, missingEffects: ['requires_status_effect_consumed'] }
    }
  }

  return { canActivate: true, missingEffects: [] }
}

/**
 * 特定の時刻範囲で連携技が発動可能な時刻を取得
 */
export const getComboSkillAvailableTimeRanges = (
  operatorId: string,
  actions: ComboAction[],
  timelineDurationMs: number,
  step: number = 100
): Array<{ start: number; end: number }> => {
  const ranges: Array<{ start: number; end: number }> = []
  let rangeStart: number | null = null

  for (let time = 0; time <= timelineDurationMs; time += step) {
    const { canActivate } = canActivateComboSkill(operatorId, actions, time)

    if (canActivate && rangeStart === null) {
      rangeStart = time
    } else if (!canActivate && rangeStart !== null) {
      ranges.push({ start: rangeStart, end: time })
      rangeStart = null
    }
  }

  // 最後の範囲を閉じる
  if (rangeStart !== null) {
    ranges.push({ start: rangeStart, end: timelineDurationMs })
  }

  return ranges
}

/**
 * 連携技の実行猶予ウィンドウ（条件成立時刻から5秒間）を取得
 */
export const getComboSkillTriggerWindows = (
  operatorId: string,
  actions: ComboAction[],
  timelineDurationMs: number,
  step: number = 100,
  executionWindowMs: number = COMBO_SKILL_EXECUTION_WINDOW_MS
): Array<{ start: number; end: number }> => {
  const availableRanges = getComboSkillAvailableTimeRanges(operatorId, actions, timelineDurationMs, step)

  return availableRanges.map((range) => ({
    start: range.start,
    end: Math.min(range.start + executionWindowMs, range.end),
  }))
}

/**
 * 全ての連携技の発動可能状態を取得
 */
export const getAllComboSkillAvailability = (
  characters: Array<{ name: string } | null>,
  actions: ComboAction[],
  time: number
): Record<string, { canActivate: boolean; missingEffects: string[] }> => {
  const availability: Record<string, { canActivate: boolean; missingEffects: string[] }> = {}

  characters.forEach((character) => {
    if (!character) return
    const operatorId = getOperatorIdByName(character.name)
    if (!operatorId) return

    availability[character.name] = canActivateComboSkill(operatorId, actions, time)
  })

  return availability
}
