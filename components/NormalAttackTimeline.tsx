'use client'

import type { MouseEvent } from 'react'
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
}: NormalAttackTimelineProps) => {
  const t = useTranslations()

  return (
    <div className="flex gap-4 items-center">
      <div className="w-40 shrink-0">
        <div className="bg-gray-700 px-3 py-2 rounded h-12 flex flex-col justify-center">
          <span className="text-xs text-gray-300">{t('team.playerControlled')}</span>
          <span className="text-sm text-gray-100">
            {playerCharacter?.name ? t(playerCharacter.name) : t('team.selectCharacter')}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <div
          className="flex items-center"
          onClick={(e) => onTimelineClick(e, playerCharacter, SkillType.NORMAL)}
        >
          <div className="w-24 text-sm text-gray-400">
            {skillTypeLabels[SkillType.NORMAL]}
          </div>
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
                const width = durationMs
                  ? Math.min(
                      (durationMs / TIMELINE_DURATION) * TIMELINE_WIDTH,
                      TIMELINE_WIDTH - getActionPosition(action.timing)
                    )
                  : 60
                return (
                  <div
                    key={action.id}
                    className={`absolute top-1 z-20 h-10 ${skillTypeColors[SkillType.NORMAL]} rounded px-2 text-xs flex items-center justify-between cursor-pointer hover:opacity-80`}
                    data-action-id={action.id}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: `${getActionPosition(action.timing)}px`,
                      width: `${Math.max(width, 16)}px`,
                      height: '40px',
                      backgroundColor: skillTypeBgColors[SkillType.NORMAL],
                      borderRadius: '6px',
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#ffffff',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveAction(action.id)
                    }}
                    title="左クリック: 削除"
                  >
                    <span>{action.timing / 1000}s</span>
                    {statusEffect && <span className="text-yellow-300">⚡</span>}
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
