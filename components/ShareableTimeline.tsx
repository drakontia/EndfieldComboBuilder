'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

import { getOperatorIdByName, OPERATORS } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
import { TIMELINE_WIDTH, getSecondMarkerWidthPx } from '@/lib/timeline'

import { SkillType } from '@/types/combo'
import type { ComboAction, Operator } from '@/types/combo'

import {
  SKILL_TYPE_LABELS,
  SKILL_TYPE_BG_COLORS,
  SKILL_TYPE_TEXT_COLORS,
  SKILL_TYPE_ACCENT_COLORS,
} from '@/components/combo-timeline/skillTypeConfig'

interface ShareableTimelineProps {
  characters: (Operator | null)[]
  actions: ComboAction[]
  timelineDurationMs: number
}

const TIMELINE_ROW_HEIGHT_PX = 48

export default function ShareableTimeline({
  characters,
  actions,
  timelineDurationMs,
}: ShareableTimelineProps) {
  const t = useTranslations()
  const secondMarkerWidthPx = getSecondMarkerWidthPx(timelineDurationMs)

  const getActionPosition = (timing: number) => {
    return (timing / timelineDurationMs) * TIMELINE_WIDTH
  }

  const getOperatorKey = (operator: Operator | null) => {
    if (!operator) return null
    return getOperatorIdByName(operator.name)
  }

  const getSkillI18nSection = (type: SkillType) => {
    if (type === SkillType.BATTLE_SKILL) return 'battle_skill'
    if (type === SkillType.COMBO_SKILL) return 'combo_skill'
    if (type === SkillType.ULTIMATE) return 'ultimate'
    return 'base_attack'
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="text-sm font-medium text-gray-200 mb-3">{t('timeline.shareableTitle')}</div>
      <div className="flex-1 space-y-4">
        {characters.map((character, index) => {
          const operatorKey = getOperatorKey(character)
          const operatorEntry = character ? Object.entries(OPERATORS).find(([, op]) => op.name === character.name) : null

          return (
            <div key={`shareable-timeline-${character?.name ?? index}`} className="flex gap-3">
              {/* Character icon */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                {character && operatorEntry ? (
                  <Image
                    src={operatorEntry[1].imageUrl || '/placeholder.png'}
                    alt={character.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center text-gray-400 text-xs">
                    {t('team.selectCharacter')}
                  </div>
                )}
              </div>

              {/* Timeline content - single unified timeline */}
              <div
                className="relative bg-gray-700 rounded flex-1"
                style={{ height: TIMELINE_ROW_HEIGHT_PX, width: `${TIMELINE_WIDTH}px` }}
                data-timeline-line
              >
                {/* Grid background */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 rounded"
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                    backgroundSize: `${secondMarkerWidthPx}px 100%`,
                  }}
                />

                {/* Action markers for all skill types */}
                {actions
                  .filter((a) => character && a.characterId === character.name)
                  .sort((a, b) => a.timing - b.timing)
                  .map((action) => {
                    const left = getActionPosition(action.timing)
                    const skillLabel = SKILL_TYPE_LABELS[action.type] || ''

                    return (
                      <TooltipProvider key={action.id} delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute top-1 z-20 h-7 ${SKILL_TYPE_BG_COLORS[action.type]} rounded px-2 text-xs flex items-center justify-center pointer-events-none overflow-hidden border-l-2 font-medium`}
                              style={{
                                left: `${left}px`,
                                width: '50px',
                                borderLeftColor: SKILL_TYPE_ACCENT_COLORS[action.type],
                              }}
                              title={skillLabel}
                            >
                              <span className="truncate text-xs">{skillLabel}</span>
                            </div>
                          </TooltipTrigger>
                          {operatorKey && (
                            <TooltipContent side="top" className="max-w-xs">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              <p className="font-semibold text-sm">{t(`character.${operatorKey}.${getSkillI18nSection(action.type)}.name` as any)}</p>
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              <p className="text-xs mt-1">{t(`character.${operatorKey}.${getSkillI18nSection(action.type)}.description` as any)}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
