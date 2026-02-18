'use client'

import { useMemo } from 'react'

import {
  DEFAULT_STATUS_EFFECT_DURATION_MS,
  STATUS_EFFECT_COLORS,
  STATUS_EFFECT_LABELS,
  TIMELINE_WIDTH,
  getSecondMarkerWidthPx,
} from '@/lib/timeline'
import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
import { ArtsInfliction, ArtsReaction, PhysicalStatus, SpecialEffect } from '@/types/combo'
import type { EnemyStatusEffect } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

interface EnemyStatusTimelineProps {
  actions: ComboAction[]
  withCharacterOffset?: boolean
  showHeader?: boolean
  timelineDurationMs: number
}

export const EnemyStatusTimeline = ({
  actions,
  withCharacterOffset = true,
  showHeader = true,
  timelineDurationMs,
}: EnemyStatusTimelineProps) => {
  const secondMarkerWidthPx = getSecondMarkerWidthPx(timelineDurationMs)
  const getActionPosition = (timing: number) => {
    return (timing / timelineDurationMs) * TIMELINE_WIDTH
  }

  const isDisplayableStatusEffect = (
    effect: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect
  ): effect is PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect => {
    return (
      Object.values(ArtsInfliction).includes(effect as ArtsInfliction) ||
      Object.values(ArtsReaction).includes(effect as ArtsReaction) ||
      Object.values(PhysicalStatus).includes(effect as PhysicalStatus) ||
      Object.values(SpecialEffect).includes(effect as SpecialEffect)
    )
  }

  type StatusEffectSegment = {
    startTime: number
    endTime: number
    count: number
    starts: number[]
  }

  type StatusEffectRow = {
    effect: EnemyStatusEffect['effect']
    segments: StatusEffectSegment[]
  }

  const buildMergedSegments = (items: EnemyStatusEffect[]) => {
    const sorted = [...items].sort((a, b) => a.startTime - b.startTime)
    const segments: StatusEffectSegment[] = []

    sorted.forEach((item) => {
      const endTime = item.startTime + item.duration
      const last = segments[segments.length - 1]
      if (last && item.startTime < last.endTime) {
        last.endTime = Math.max(last.endTime, endTime)
        last.count = Math.min(4, last.count + 1)
        last.starts.push(item.startTime)
        return
      }
      segments.push({ startTime: item.startTime, endTime, count: 1, starts: [item.startTime] })
    })

    return segments
  }

  const buildPhysicalCrashSegments = (items: EnemyStatusEffect[]) => {
    const sorted = [...items].sort((a, b) => {
      if (a.startTime !== b.startTime) return a.startTime - b.startTime
      const aEffect = a.effect as PhysicalStatus
      const bEffect = b.effect as PhysicalStatus
      const aIsConsume = aEffect === PhysicalStatus.CRUSH || aEffect === PhysicalStatus.BREACH
      const bIsConsume = bEffect === PhysicalStatus.CRUSH || bEffect === PhysicalStatus.BREACH
      if (aIsConsume === bIsConsume) return 0
      return aIsConsume ? -1 : 1
    })
    const segments: StatusEffectSegment[] = []
    const liftEvents: EnemyStatusEffect[] = []
    const knockdownEvents: EnemyStatusEffect[] = []
    let current: StatusEffectSegment | null = null

    const isConsumeEffect = (effect: PhysicalStatus) =>
      effect === PhysicalStatus.CRUSH || effect === PhysicalStatus.BREACH
    const isStackEffect = (effect: PhysicalStatus) =>
      effect === PhysicalStatus.VULNERABLE || effect === PhysicalStatus.LIFT || effect === PhysicalStatus.KNOCKDOWN

    sorted.forEach((item) => {
      const effect = item.effect as PhysicalStatus
      const endTime = item.startTime + item.duration

      if (isConsumeEffect(effect)) {
        if (current && item.startTime < current.endTime) {
          current.endTime = item.startTime
          if (current.endTime > current.startTime) {
            segments.push(current)
          }
          current = null
          return
        }

        if (current) segments.push(current)
        current = {
          startTime: item.startTime,
          endTime,
          count: 1,
          starts: [item.startTime],
        }
        return
      }

      if (!isStackEffect(effect)) return

      if (current && item.startTime < current.endTime) {
        current.endTime = Math.max(current.endTime, endTime)
        current.count = Math.min(4, current.count + 1)
        current.starts.push(item.startTime)
        if (effect === PhysicalStatus.LIFT) {
          liftEvents.push(item)
        }
        if (effect === PhysicalStatus.KNOCKDOWN) {
          knockdownEvents.push(item)
        }
        return
      }

      if (current) segments.push(current)
      current = {
        startTime: item.startTime,
        endTime,
        count: 1,
        starts: [item.startTime],
      }
    })

    if (current) segments.push(current)

    return { segments, liftEvents, knockdownEvents }
  }

  const statusEffectRows = useMemo<StatusEffectRow[]>(() => {
    const effects: EnemyStatusEffect[] = []
    actions.forEach((action) => {
      const statusEffect = getStatusEffectForAction(getOperatorIdByName(action.characterId), action.type)
      if (statusEffect) {
        effects.push({
          id: `${action.id}-effect`,
          effect: statusEffect,
          startTime: action.timing,
          duration: DEFAULT_STATUS_EFFECT_DURATION_MS,
          sourceActionId: action.id,
        })
      }
    })

    const displayableEffects = effects.filter((effect) => isDisplayableStatusEffect(effect.effect))
    const physicalEffects = displayableEffects.filter((effect) =>
      Object.values(PhysicalStatus).includes(effect.effect as PhysicalStatus)
    )
    const nonPhysicalEffects = displayableEffects.filter(
      (effect) => !Object.values(PhysicalStatus).includes(effect.effect as PhysicalStatus)
    )

    const grouped = new Map<EnemyStatusEffect['effect'], EnemyStatusEffect[]>()
    nonPhysicalEffects.forEach((effect) => {
      const existing = grouped.get(effect.effect)
      if (existing) {
        existing.push(effect)
      } else {
        grouped.set(effect.effect, [effect])
      }
    })

    const inflictionOrder = Object.values(ArtsInfliction)
    const reactionOrder = Object.values(ArtsReaction)
    const specialOrder = Object.values(SpecialEffect)

    const getEffectOrder = (effect: EnemyStatusEffect['effect']) => {
      if (inflictionOrder.includes(effect as ArtsInfliction)) {
        return { group: 1, index: inflictionOrder.indexOf(effect as ArtsInfliction) }
      }
      if (reactionOrder.includes(effect as ArtsReaction)) {
        return { group: 2, index: reactionOrder.indexOf(effect as ArtsReaction) }
      }
      return { group: 3, index: specialOrder.indexOf(effect as SpecialEffect) }
    }

    const rows: StatusEffectRow[] = []
    const physicalCrash = buildPhysicalCrashSegments(physicalEffects)

    if (physicalCrash.segments.length > 0) {
      rows.push({
        effect: PhysicalStatus.VULNERABLE,
        segments: physicalCrash.segments,
      })
    }

    const liftSegments = buildMergedSegments(
      physicalCrash.liftEvents
    )
    if (liftSegments.length > 0) {
      rows.push({
        effect: PhysicalStatus.LIFT,
        segments: liftSegments,
      })
    }

    const knockdownSegments = buildMergedSegments(
      physicalCrash.knockdownEvents
    )
    if (knockdownSegments.length > 0) {
      rows.push({
        effect: PhysicalStatus.KNOCKDOWN,
        segments: knockdownSegments,
      })
    }

    const orderedNonPhysicalRows = Array.from(grouped.entries())
      .map(([effect, items]) => ({
        effect,
        segments: buildMergedSegments(items),
        order: getEffectOrder(effect),
      }))
      .sort((a, b) => (a.order.group - b.order.group) || (a.order.index - b.order.index))

    orderedNonPhysicalRows.forEach((row) => {
      rows.push({ effect: row.effect, segments: row.segments })
    })

    return rows
  }, [actions])

  return (
    <div className="bg-gray-800 rounded-lg overflow-x-auto">
      {showHeader && <div className="text-lg font-semibold mb-2 text-red-400">敵の状態</div>}
      <div className="flex flex-col gap-2">
        {statusEffectRows.map((row) => (
          <div key={row.effect} className="flex items-center">
            {withCharacterOffset && <div className="w-40 shrink-0" />}
            <div className="w-24 text-sm text-gray-400">{STATUS_EFFECT_LABELS[row.effect]}</div>
            <div className="relative flex-1 h-10 bg-gray-900 rounded border border-red-700">
              {/* Timeline markers */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                  backgroundSize: `${secondMarkerWidthPx}px 100%`,
                }}
              />

              {/* Status effects */}
              {row.segments.map((segment, index) => (
                <div
                  key={`${row.effect}-${segment.startTime}-${index}`}
                  className={`absolute top-1 z-20 h-8 ${STATUS_EFFECT_COLORS[row.effect]} rounded px-2 text-xs flex items-center justify-center opacity-80`}
                  style={{
                    left: `${getActionPosition(segment.startTime)}px`,
                    width: `${((segment.endTime - segment.startTime) / timelineDurationMs) * TIMELINE_WIDTH}px`,
                  }}
                  title={`${STATUS_EFFECT_LABELS[row.effect]} (${segment.endTime - segment.startTime}ms)`}
                >
                  <span className="relative flex items-center justify-center w-full h-full">
                    {segment.starts.length > 1 &&
                      segment.starts.map((start, startIndex) => (
                        <span
                          key={`${start}-${startIndex}`}
                          className="absolute top-0 bottom-0 w-0.5 bg-black/40"
                          style={{
                            left: `${((start - segment.startTime) / (segment.endTime - segment.startTime)) * 100}%`,
                          }}
                        />
                      ))}
                    <span className="relative z-10">
                      {STATUS_EFFECT_LABELS[row.effect]}{segment.count > 1 ? `×${segment.count}` : ''}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
