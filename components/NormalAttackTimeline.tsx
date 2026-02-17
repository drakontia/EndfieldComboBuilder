'use client'

import type { MouseEvent } from 'react'
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core'
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { useTranslations } from 'next-intl'

import {
  SECOND_MARKER_WIDTH_PX,
  TIMELINE_DURATION,
  TIMELINE_WIDTH,
} from '@/lib/timeline'

import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
import { SkillType } from '@/types/combo'
import type { Operator } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

interface NormalAttackTimelineProps {
  playerCharacter: Operator | null
  actions: ComboAction[]
  skillTypeLabels: Record<SkillType, string>
  skillTypeColors: Record<SkillType, string>
  skillTypeBgColors: Record<SkillType, string>
  getActionPosition: (timing: number) => number
  getNormalAttackDurationMsForPlayer: () => number | null
  onTimelineClick: (e: MouseEvent<HTMLDivElement>, character: Operator | null, type: SkillType) => void
  onRemoveAction: (actionId: string) => void
  onMoveAction: (actionId: string, nextTiming: number) => void
  showCharacterLabel?: boolean
}

interface DraggableNormalActionProps {
  action: ComboAction
  left: number
  widthPx: number
  statusEffect: ReturnType<typeof getStatusEffectForAction>
  skillTypeColors: Record<SkillType, string>
  skillTypeBgColors: Record<SkillType, string>
  onRemoveAction: (actionId: string) => void
}

const DraggableNormalAction = ({
  action,
  left,
  widthPx,
  statusEffect,
  skillTypeColors,
  skillTypeBgColors,
  onRemoveAction,
}: DraggableNormalActionProps) => {
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
      type: SkillType.NORMAL,
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
      className={`absolute top-1 z-20 h-10 ${skillTypeColors[SkillType.NORMAL]} rounded px-2 text-xs flex items-center justify-between cursor-grab hover:opacity-80`}
      data-action-id={action.id}
      style={{
        position: 'absolute',
        top: '4px',
        left: `${left}px`,
        width: `${Math.max(widthPx, 16)}px`,
        height: '40px',
        backgroundColor: skillTypeBgColors[SkillType.NORMAL],
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

export const NormalAttackTimeline = ({
  playerCharacter,
  actions,
  skillTypeLabels,
  skillTypeColors,
  skillTypeBgColors,
  getActionPosition,
  getNormalAttackDurationMsForPlayer,
  onTimelineClick,
  onRemoveAction,
  onMoveAction,
  showCharacterLabel = true,
}: NormalAttackTimelineProps) => {
  const t = useTranslations()

  const clampTiming = (timing: number) => {
    if (timing <= 0) return 0
    if (timing >= TIMELINE_DURATION) return TIMELINE_DURATION
    return timing
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const data = active.data.current as
      | { actionId: string; timing: number; type: SkillType; characterId: string }
      | undefined
    if (!data) return
    if (data.type !== SkillType.NORMAL) return

    const deltaMs = (delta.x / TIMELINE_WIDTH) * TIMELINE_DURATION
    const nextTimingRaw = data.timing + deltaMs
    const nextTiming = clampTiming(Math.round(nextTimingRaw / 100) * 100)
    onMoveAction(data.actionId, nextTiming)
  }

  const timelineContent = (
    <div
      className="flex items-center"
      onClick={(e) => onTimelineClick(e, playerCharacter, SkillType.NORMAL)}
    >
      <div className="w-24 text-sm text-gray-400">
        {skillTypeLabels[SkillType.NORMAL]}
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      >
        <div
          className={`relative h-12 bg-gray-700 rounded ${playerCharacter ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
          style={{ width: `${TIMELINE_WIDTH}px`, minHeight: '48px', position: 'relative' }}
          data-timeline-line
        >
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
              backgroundSize: `${SECOND_MARKER_WIDTH_PX}px 100%`,
            }}
          />

          <div className="absolute inset-0 z-5" style={{ position: 'absolute', inset: 0 }} />

          {actions
            .filter((action) => action.type === SkillType.NORMAL)
            .map((action) => {
              const statusEffect = getStatusEffectForAction(
                getOperatorIdByName(action.characterId),
                action.type
              )
              const durationMs = getNormalAttackDurationMsForPlayer()
              const left = getActionPosition(action.timing)
              const width = durationMs
                ? Math.min(
                    (durationMs / TIMELINE_DURATION) * TIMELINE_WIDTH,
                    TIMELINE_WIDTH - left
                  )
                : 60

              return (
                <DraggableNormalAction
                  key={action.id}
                  action={action}
                  left={left}
                  widthPx={width}
                  statusEffect={statusEffect}
                  skillTypeColors={skillTypeColors}
                  skillTypeBgColors={skillTypeBgColors}
                  onRemoveAction={onRemoveAction}
                />
              )
            })}
        </div>
      </DndContext>
    </div>
  )

  if (!showCharacterLabel) {
    return <div className="flex-1">{timelineContent}</div>
  }

  return (
    <div className="flex gap-4 mb-4 items-center">
      <div className="w-40 shrink-0">
        <div className="bg-gray-700 px-3 py-2 rounded h-12 flex flex-col justify-center">
          <span className="text-xs text-gray-300">{t('team.playerControlled')}</span>
          <span className="text-sm text-gray-100">
            {playerCharacter?.name ? t(playerCharacter.name) : t('team.selectCharacter')}
          </span>
        </div>
      </div>
      <div className="flex-1">
        {timelineContent}
      </div>
    </div>
  )
}
