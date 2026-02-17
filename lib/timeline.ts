import { getNormalAttackDurationMs } from '@/lib/data/attacks'
import { ArtsInfliction, ArtsReaction, PhysicalStatus, SkillType, SpecialEffect } from '@/types/combo'

export const DEFAULT_STATUS_EFFECT_DURATION_MS = 3000
export const TIMELINE_WIDTH = 1000
export const TIMELINE_DURATION = 30000
export const CHARGE_SEGMENT_WIDTH = 10
export const ULTIMATE_CHARGE_COLOR_RGB = '239, 68, 68'
export const ULTIMATE_CHARGE_OPACITY_MULTIPLIER = 0.3
export const TIMELINE_ROW_HEIGHT_PX = 160
export const SECOND_MARKER_WIDTH_PX = TIMELINE_WIDTH / (TIMELINE_DURATION / 1000)
export const INITIAL_TEAM_SP = 200
export const MAX_TEAM_SP = 300
export const TEAM_SP_REGEN_PER_SECOND = 10
export const BATTLE_SKILL_SP_COST = 100
export const NORMAL_ATTACK_SP_GAIN = 20
const SP_TIMELINE_STEP_MS = 1000

export interface SpTimelinePoint {
  timing: number
  sp: number
  delta: number
}

type TimelineStatusEffect = ArtsInfliction | ArtsReaction | PhysicalStatus | SpecialEffect

export const STATUS_EFFECT_COLORS: Record<TimelineStatusEffect, string> = {
  [ArtsInfliction.HEAT]: 'bg-orange-500',
  [ArtsInfliction.CRYO]: 'bg-cyan-500',
  [ArtsInfliction.ELECTRIC]: 'bg-yellow-500',
  [ArtsInfliction.NATURE]: 'bg-green-500',
  [ArtsReaction.COMBUSTION]: 'bg-orange-600',
  [ArtsReaction.ELECTRIFICATION]: 'bg-yellow-500',
  [ArtsReaction.SOLIDIFICATION]: 'bg-cyan-500',
  [ArtsReaction.CORROSION]: 'bg-green-600',
  [PhysicalStatus.VULNERABLE]: 'bg-amber-500',
  [PhysicalStatus.LIFT]: 'bg-sky-500',
  [PhysicalStatus.KNOCKDOWN]: 'bg-stone-500',
  [PhysicalStatus.CRUSH]: 'bg-red-600',
  [PhysicalStatus.BREACH]: 'bg-orange-500',
  [SpecialEffect.ORIGINIUM_CRYSTALS]: 'bg-indigo-500',
}

export const STATUS_EFFECT_LABELS: Record<TimelineStatusEffect, string> = {
  [ArtsInfliction.HEAT]: '灼熱',
  [ArtsInfliction.CRYO]: '寒冷',
  [ArtsInfliction.ELECTRIC]: '電磁',
  [ArtsInfliction.NATURE]: '自然',
  [ArtsReaction.COMBUSTION]: '燃焼',
  [ArtsReaction.ELECTRIFICATION]: '感電',
  [ArtsReaction.SOLIDIFICATION]: '凍結',
  [ArtsReaction.CORROSION]: '腐食',
  [PhysicalStatus.VULNERABLE]: 'クラッシュ',
  [PhysicalStatus.LIFT]: '浮遊',
  [PhysicalStatus.KNOCKDOWN]: '転倒',
  [PhysicalStatus.CRUSH]: '猛撃',
  [PhysicalStatus.BREACH]: '破砕',
  [SpecialEffect.ORIGINIUM_CRYSTALS]: '源石の結晶',
}

interface TimelineActionLike {
  timing: number
  type: SkillType
  operatorId?: string
  characterId?: string
}

export const buildSpTimeline = (
  actions: TimelineActionLike[],
  initialSp: number = INITIAL_TEAM_SP,
  battleSkillCost: number = BATTLE_SKILL_SP_COST
) => {
  const sortedActions = [...actions].sort((a, b) => a.timing - b.timing)
  const points: SpTimelinePoint[] = []
  const regenPerMs = TEAM_SP_REGEN_PER_SECOND / 1000
  let currentTime = 0
  let currentSp = Math.min(initialSp, MAX_TEAM_SP)
  let minSp = currentSp

  const timelineEvents = sortedActions.flatMap((action) => {
    const operatorId = action.operatorId ?? action.characterId ?? ''
    const events: { timing: number; spDelta: number }[] = []

    if (action.type === SkillType.BATTLE_SKILL) {
      events.push({ timing: action.timing, spDelta: -battleSkillCost })
    }

    if (action.type === SkillType.NORMAL) {
      const durationMs = getNormalAttackDurationMs(operatorId)
      const endTiming = action.timing + durationMs
      events.push({ timing: endTiming, spDelta: NORMAL_ATTACK_SP_GAIN })
    }

    return events
  })

  const pushPoint = (timing: number, sp: number) => {
    points.push({ timing, sp: Math.round(sp), delta: 0 })
  }

  const applyRegen = (deltaMs: number) => {
    if (deltaMs <= 0 || regenPerMs <= 0) return
    currentSp = Math.min(MAX_TEAM_SP, currentSp + deltaMs * regenPerMs)
  }

  const applySpDelta = (spDelta: number) => {
    if (spDelta === 0) return
    currentSp = Math.min(MAX_TEAM_SP, currentSp + spDelta)
    minSp = Math.min(minSp, currentSp)
  }

  pushPoint(0, currentSp)

  const sortedEvents = timelineEvents.sort((a, b) => a.timing - b.timing)

  for (let nextStep = SP_TIMELINE_STEP_MS; nextStep <= TIMELINE_DURATION; nextStep += SP_TIMELINE_STEP_MS) {
    while (sortedEvents.length > 0 && sortedEvents[0].timing <= nextStep) {
      const event = sortedEvents.shift()
      if (!event) break
      const deltaToEvent = event.timing - currentTime
      applyRegen(deltaToEvent)
      currentTime = event.timing
      applySpDelta(event.spDelta)
    }

    const deltaToStep = nextStep - currentTime
    applyRegen(deltaToStep)
    currentTime = nextStep
    pushPoint(currentTime, currentSp)
  }

  return { points, minSp }
}
