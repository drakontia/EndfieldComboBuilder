'use client'

import { type MouseEvent } from 'react'
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core'
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

import {
  CHARGE_SEGMENT_WIDTH,
  TIMELINE_ROW_HEIGHT_PX,
  TIMELINE_WIDTH,
  ULTIMATE_CHARGE_COLOR_RGB,
  ULTIMATE_CHARGE_OPACITY_MULTIPLIER,
  getSecondMarkerWidthPx,
} from '@/lib/timeline'
import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
import { SkillType } from '@/types/combo'
import type { Operator } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

import {
  SKILL_TYPE_LABELS,
  SKILL_TYPE_COLORS,
  SKILL_TYPE_BG_COLORS,
} from '@/components/combo-timeline/skillTypeConfig'

interface TimelineRowProps {
  character: Operator | null
  actions: ComboAction[]
  onRemoveAction: (actionId: string) => void
  onMoveAction: (actionId: string, nextTiming: number) => void
  handleTimelineClick: (e: MouseEvent<HTMLDivElement>, character: Operator | null, type: SkillType) => void
  getActionPosition: (timing: number) => number
  getComboSkillCooldownMs: (operator: Operator | null) => number | null
  getUltimateCooldownMs: (operator: Operator | null) => number | null
  calculateUltimateCharge: (characterId: string, upToTime: number, initialCharge: number) => number
  getSkillTypesForCharacter: () => SkillType[]
  timelineDurationMs: number
  initialUltimateCharge: number
}

interface DraggableActionProps {
  action: ComboAction
  type: SkillType
  left: number
  widthPx: number
  statusEffect: ReturnType<typeof getStatusEffectForAction>
  onRemoveAction: (actionId: string) => void
}

const DraggableAction = ({
  action,
  type,
  left,
  widthPx,
  statusEffect,
  onRemoveAction,
}: DraggableActionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: action.id,
    data: {
      actionId: action.id,
      timing: action.timing,
      type,
      characterId: action.characterId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      className={`absolute top-1 z-20 h-10 ${SKILL_TYPE_COLORS[type]} rounded px-2 text-xs flex items-center justify-between cursor-grab hover:opacity-80`}
      data-action-id={action.id}
      style={{
        position: 'absolute',
        top: '4px',
        left: `${left}px`,
        width: `${Math.max(widthPx, 16)}px`,
        height: '40px',
        backgroundColor: SKILL_TYPE_BG_COLORS[type],
        borderRadius: '6px',
        padding: '0 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        touchAction: 'none',
        ...style,
      }}
      onClick={(e) => {
        if (isDragging) return
        e.stopPropagation()
        onRemoveAction(action.id)
      }}
      title="左クリック: 削除"
      {...attributes}
      {...listeners}
    >
      <span>{action.timing / 1000}s</span>
      {statusEffect && <span className="text-yellow-300">⚡</span>}
    </div>
  )
}

export default function TimelineRow({
  character,
  actions,
  onRemoveAction,
  handleTimelineClick,
  getActionPosition,
  getComboSkillCooldownMs,
  getUltimateCooldownMs,
  calculateUltimateCharge,
  getSkillTypesForCharacter,
  onMoveAction,
  timelineDurationMs,
  initialUltimateCharge,
}: TimelineRowProps) {
  const secondMarkerWidthPx = getSecondMarkerWidthPx(timelineDurationMs)
  const getDisplayWidthMs = (type: SkillType) => {
    if (type === SkillType.BATTLE_SKILL) return 1000
    if (type === SkillType.COMBO_SKILL) return 1000
    if (type === SkillType.ULTIMATE) return 1000
    return 1000
  }

  const clampTiming = (timing: number) => {
    if (timing <= 0) return 0
    if (timing >= timelineDurationMs) return timelineDurationMs
    return timing
  }

  const handleDragEnd = (event: DragEndEvent, type: SkillType) => {
    const { active, delta } = event
    const data = active.data.current as
      | { actionId: string; timing: number; type: SkillType; characterId: string }
      | undefined
    if (!data) return
    if (!character) return
    if (data.type !== type) return
    if (data.characterId !== character.name) return

    const deltaMs = (delta.x / TIMELINE_WIDTH) * timelineDurationMs
    const nextTimingRaw = data.timing + deltaMs
    const nextTiming = clampTiming(Math.round(nextTimingRaw / 100) * 100)
    onMoveAction(data.actionId, nextTiming)
  }

  return (
    <div
      className="h-full flex flex-col gap-2 bg-black/20"
      style={{ height: TIMELINE_ROW_HEIGHT_PX }}
    >
      {getSkillTypesForCharacter().map((type) => (
        <div key={type}>
          <div className="flex items-center" onClick={(e) => handleTimelineClick(e, character, type)}>
            <div className="w-24 text-sm text-gray-400">
              {SKILL_TYPE_LABELS[type]}
            </div>
            <DndContext
              onDragEnd={(event) => handleDragEnd(event, type)}
              modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            >
              <div
                className={`relative h-12 bg-gray-700 rounded ${character ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
                style={{ width: `${TIMELINE_WIDTH}px`, minHeight: '48px', position: 'relative' }}
                data-timeline-line
              >
              {type === SkillType.COMBO_SKILL && (
                <>
                  {actions
                    .filter((action) => character && action.characterId === character.name && action.type === SkillType.COMBO_SKILL)
                    .map((action) => {
                      const cooldownMs = getComboSkillCooldownMs(character)
                      if (!cooldownMs) return null
                      const left = getActionPosition(action.timing)
                      const width = Math.min(
                        (cooldownMs / timelineDurationMs) * TIMELINE_WIDTH,
                        TIMELINE_WIDTH - left
                      )
                      if (width <= 0) return null

                      return (
                        <div
                          key={`${action.id}-cooldown`}
                          className="absolute inset-y-0 z-5 pointer-events-none"
                          style={{
                            left: `${left}px`,
                            width: `${width}px`,
                            backgroundColor: SKILL_TYPE_BG_COLORS[SkillType.COMBO_SKILL],
                            opacity: 0.18,
                          }}
                        />
                      )
                    })}
                </>
              )}
              {character && type === SkillType.ULTIMATE && (
                <div className="absolute inset-0 flex z-0">
                  {[...Array(TIMELINE_WIDTH / CHARGE_SEGMENT_WIDTH)].map((_, i) => {
                    const time = (i * CHARGE_SEGMENT_WIDTH / TIMELINE_WIDTH) * timelineDurationMs
                    const charge = calculateUltimateCharge(character.name, time, initialUltimateCharge)
                    return (
                      <div
                        key={i}
                        className="relative"
                        style={{
                          width: `${CHARGE_SEGMENT_WIDTH}px`,
                          background: `linear-gradient(to top, rgba(${ULTIMATE_CHARGE_COLOR_RGB}, ${charge / 100 * ULTIMATE_CHARGE_OPACITY_MULTIPLIER}), transparent)`
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {type === SkillType.ULTIMATE && (
                <>
                  {actions
                    .filter((action) => character && action.characterId === character.name && action.type === SkillType.ULTIMATE)
                    .map((action) => {
                      const cooldownMs = getUltimateCooldownMs(character)
                      if (!cooldownMs) return null
                      const left = getActionPosition(action.timing)
                      const width = Math.min(
                        (cooldownMs / timelineDurationMs) * TIMELINE_WIDTH,
                        TIMELINE_WIDTH - left
                      )
                      if (width <= 0) return null

                      return (
                        <div
                          key={`${action.id}-ultimate-cooldown`}
                          className="absolute inset-y-0 z-5 pointer-events-none"
                          style={{
                            left: `${left}px`,
                            width: `${width}px`,
                            backgroundColor: SKILL_TYPE_BG_COLORS[SkillType.ULTIMATE],
                            opacity: 0.16,
                          }}
                        />
                      )
                    })}
                </>
              )}

              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                  backgroundSize: `${secondMarkerWidthPx}px 100%`,
                }}
              />

              <div
                className="absolute inset-0 z-5"
                style={{ position: 'absolute', inset: 0 }}
              />

              {actions
                .filter(a => character && a.characterId === character.name && a.type === type)
                .map((action) => {
                  const statusEffect = getStatusEffectForAction(
                    getOperatorIdByName(action.characterId),
                    action.type
                  )
                  const widthMs = getDisplayWidthMs(type)
                  const left = getActionPosition(action.timing)
                  const widthPx = Math.min(
                    (widthMs / timelineDurationMs) * TIMELINE_WIDTH,
                    TIMELINE_WIDTH - left
                  )

                  return (
                    <DraggableAction
                      key={action.id}
                      action={action}
                      type={type}
                      left={left}
                      widthPx={widthPx}
                      statusEffect={statusEffect}
                      onRemoveAction={onRemoveAction}
                    />
                  )
                })}
              </div>
            </DndContext>
          </div>
        </div>
      ))}
    </div>
  )
}
