import { getNormalAttackDurationMs, getNormalAttackStaggerDamage } from '@/lib/data/attacks'
import { ArtsInfliction, ArtsReaction, Buff, Debuff, PhysicalStatus, SkillType, SpecialEffect } from '@/types/combo'

export const DEFAULT_STATUS_EFFECT_DURATION_MS = 3000
export const LONG_STATUS_EFFECT_DURATION_MS = 30000
export const TIMELINE_WIDTH = 1000
export const TIMELINE_DURATION = 30000
export const MIN_TIMELINE_DURATION = 10000
export const MAX_TIMELINE_DURATION = 60000
export const CHARGE_SEGMENT_WIDTH = 10
export const ULTIMATE_CHARGE_COLOR_RGB = '239, 68, 68'
export const ULTIMATE_CHARGE_OPACITY_MULTIPLIER = 0.3
export const TIMELINE_ROW_HEIGHT_PX = 160
export const getSecondMarkerWidthPx = (durationMs: number) => {
  return TIMELINE_WIDTH / (durationMs / 1000)
}
export const COMBO_SKILL_EXECUTION_WINDOW_MS = 5000
export const INITIAL_TEAM_SP = 200
export const MAX_TEAM_SP = 300
export const TEAM_SP_REGEN_PER_SECOND = 10
export const BATTLE_SKILL_SP_COST = 100
export const NORMAL_ATTACK_SP_GAIN = 20
export const INITIAL_ENEMY_STAGGER_METER = 100
export const MAX_STAGGER_METER = 100
const SP_TIMELINE_STEP_MS = 1000
const STAGGER_METER_TIMELINE_STEP_MS = 1000
const STAGGER_METER_RECOVERY_DELAY_MS = 5000

export interface SpTimelinePoint {
  timing: number
  sp: number
  delta: number
}

export interface StaggerMeterPoint {
  timing: number
  staggerMeter: number
  delta: number
}

type StaggerEvent =
  | { timing: number; type: 'damage'; staggerDelta: number }
  | { timing: number; type: 'recover' }

type TimelineStatusEffect = ArtsInfliction | ArtsReaction | PhysicalStatus | SpecialEffect | Buff | Debuff

export const STATUS_EFFECT_COLORS: Record<TimelineStatusEffect, string> = {
  [ArtsInfliction.HEAT]: 'bg-orange-500',
  [ArtsInfliction.CRYO]: 'bg-cyan-500',
  [ArtsInfliction.ELECTRIC]: 'bg-yellow-500',
  [ArtsInfliction.NATURE]: 'bg-green-500',
  [ArtsReaction.COMBUSTION]: 'bg-orange-600',
  [ArtsReaction.SHOCK]: 'bg-yellow-500',
  [ArtsReaction.FREEZE]: 'bg-cyan-500',
  [ArtsReaction.CORROSION]: 'bg-green-600',
  [PhysicalStatus.VULNERABLE]: 'bg-amber-500',
  [PhysicalStatus.LIFT]: 'bg-sky-500',
  [PhysicalStatus.KNOCKDOWN]: 'bg-stone-500',
  [PhysicalStatus.CRUSH]: 'bg-red-600',
  [PhysicalStatus.SHATTER]: 'bg-orange-500',
  [SpecialEffect.ORIGINIUM_CRYSTALS]: 'bg-indigo-500',
  [Buff.SUPPORT_CRYSTAL]: 'bg-purple-500',
  [Buff.COLD_INFUSION]: 'bg-blue-300',
  [Buff.SHIELD]: 'bg-blue-500',
  [Buff.PROTECT]: 'bg-red-500',
  [Buff.AMP]: 'bg-blue-600',
  [Buff.LINK]: 'bg-red-300',
  [Buff.DISPEL]: 'bg-blue-300',
  [Debuff.WEAKEN]: 'bg-red-400',
  [Debuff.SUSCEPTIBLE]: 'bg-cyan-400',
  [Debuff.SLOW]: 'bg-yellow-400',
  [Debuff.PHYSICAL_SUSCEPTIBILITY]: 'bg-gray-500',
  [Debuff.ARTS_SUSCEPTIBILITY]: 'bg-gray-600'
}

const ARTS_INFLICTION_SET = new Set(Object.values(ArtsInfliction))
const CRASH_STACK_EFFECTS = new Set<PhysicalStatus>([
  PhysicalStatus.VULNERABLE,
  PhysicalStatus.LIFT,
  PhysicalStatus.KNOCKDOWN,
])
const LONG_DURATION_BUFFS = new Set<Buff>([
  Buff.SUPPORT_CRYSTAL,
  Buff.COLD_INFUSION,
])

export const getStatusEffectDurationMs = (effect: TimelineStatusEffect) => {
  if (ARTS_INFLICTION_SET.has(effect as ArtsInfliction) || CRASH_STACK_EFFECTS.has(effect as PhysicalStatus)) {
    return LONG_STATUS_EFFECT_DURATION_MS
  }

  if (LONG_DURATION_BUFFS.has(effect as Buff)) {
    return LONG_STATUS_EFFECT_DURATION_MS
  }

  return DEFAULT_STATUS_EFFECT_DURATION_MS
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
  battleSkillCost: number = BATTLE_SKILL_SP_COST,
  timelineDurationMs: number = TIMELINE_DURATION
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

  for (let nextStep = SP_TIMELINE_STEP_MS; nextStep <= timelineDurationMs; nextStep += SP_TIMELINE_STEP_MS) {
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

export const buildStaggerMeterTimeline = (
  actions: TimelineActionLike[],
  initialStaggerMeter: number = INITIAL_ENEMY_STAGGER_METER,
  timelineDurationMs: number = TIMELINE_DURATION
) => {
  const sortedActions = [...actions].sort((a, b) => a.timing - b.timing)
  const points: StaggerMeterPoint[] = []
  let currentTime = 0
  let currentStaggerMeter = initialStaggerMeter
  let maxStaggerMeter = currentStaggerMeter
  let pendingRecoveryTime: number | null = null

  const timelineEvents: StaggerEvent[] = sortedActions.flatMap((action) => {
    // operatorId should be set correctly from ComboBuilder
    const operatorId = action.operatorId ?? action.characterId ?? ''
    const events: StaggerEvent[] = []

    if (action.type === SkillType.NORMAL && operatorId) {
      const durationMs = getNormalAttackDurationMs(operatorId)
      const staggerDamage = getNormalAttackStaggerDamage(operatorId)
      const endTiming = action.timing + durationMs
      events.push({ timing: endTiming, type: 'damage', staggerDelta: -staggerDamage })
    }

    return events
  })

  const pushPoint = (timing: number, staggerMeter: number) => {
    points.push({ timing, staggerMeter: Math.max(0, Math.round(staggerMeter)), delta: 0 })
  }

  const eventPriority = (event: StaggerEvent) => (event.type === 'recover' ? 0 : 1)

  const compareEvents = (a: StaggerEvent, b: StaggerEvent) => {
    if (a.timing !== b.timing) return a.timing - b.timing
    return eventPriority(a) - eventPriority(b)
  }

  const insertEvent = (event: StaggerEvent, events: StaggerEvent[]) => {
    const index = events.findIndex((item) => compareEvents(event, item) < 0)
    if (index === -1) {
      events.push(event)
      return
    }
    events.splice(index, 0, event)
  }

  const scheduleRecovery = (events: StaggerEvent[]) => {
    if (pendingRecoveryTime !== null) return
    const recoveryTime = currentTime + STAGGER_METER_RECOVERY_DELAY_MS
    pendingRecoveryTime = recoveryTime
    if (recoveryTime <= timelineDurationMs) {
      insertEvent({ timing: recoveryTime, type: 'recover' }, events)
    }
  }

  const applyStaggerDelta = (staggerDelta: number, events: StaggerEvent[]) => {
    if (staggerDelta === 0) return
    currentStaggerMeter = Math.max(0, currentStaggerMeter + staggerDelta)
    maxStaggerMeter = Math.max(maxStaggerMeter, currentStaggerMeter)
    if (currentStaggerMeter === 0) {
      scheduleRecovery(events)
    }
  }

  const applyRecovery = () => {
    currentStaggerMeter = MAX_STAGGER_METER
    maxStaggerMeter = Math.max(maxStaggerMeter, currentStaggerMeter)
    pendingRecoveryTime = null
  }

  pushPoint(0, currentStaggerMeter)

  const sortedEvents = timelineEvents.sort(compareEvents)

  if (currentStaggerMeter === 0) {
    scheduleRecovery(sortedEvents)
  }

  for (let nextStep = STAGGER_METER_TIMELINE_STEP_MS; nextStep <= timelineDurationMs; nextStep += STAGGER_METER_TIMELINE_STEP_MS) {
    while (sortedEvents.length > 0 && sortedEvents[0].timing <= nextStep) {
      const event = sortedEvents.shift()
      if (!event) break
      currentTime = event.timing
      if (event.type === 'recover') {
        applyRecovery()
        continue
      }
      applyStaggerDelta(event.staggerDelta, sortedEvents)
    }

    currentTime = nextStep
    pushPoint(currentTime, currentStaggerMeter)
  }

  // Process any remaining events after the last step
  while (sortedEvents.length > 0) {
    const event = sortedEvents.shift()
    if (!event) break
    currentTime = event.timing
    if (event.type === 'recover') {
      applyRecovery()
    } else {
      applyStaggerDelta(event.staggerDelta, sortedEvents)
    }
    if (currentTime <= timelineDurationMs) {
      pushPoint(currentTime, currentStaggerMeter)
    }
  }

  return { points, maxStaggerMeter }
}
