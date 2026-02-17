'use client'

import { type MouseEvent } from 'react'

import TimelineRow from '@/components/combo-timeline/TimelineRow'
import { getOperatorIdByName } from '@/lib/data/operators'
import { COMBO_SKILLS, ULTIMATES } from '@/lib/data/skills'
import { TIMELINE_DURATION, TIMELINE_WIDTH } from '@/lib/timeline'

import { SkillType } from '@/types/combo'
import type { ComboAction, Operator } from '@/types/combo'

interface TimelineColumnProps {
  characters: (Operator | null)[]
  actions: ComboAction[]
  onAddAction: (characterId: string, type: SkillType, timing: number) => void
  onRemoveAction: (actionId: string) => void
  onMoveAction: (actionId: string, nextTiming: number) => void
}

export default function TimelineColumn({
  characters,
  actions,
  onAddAction,
  onRemoveAction,
  onMoveAction,
}: TimelineColumnProps) {
  const getActionPosition = (timing: number) => {
    return (timing / TIMELINE_DURATION) * TIMELINE_WIDTH
  }

  const getOperatorKey = (operator: Operator | null) => {
    if (!operator) return null
    return getOperatorIdByName(operator.name)
  }

  const getComboSkillCooldownMs = (operator: Operator | null) => {
    const operatorKey = getOperatorKey(operator)
    if (!operatorKey) return null
    const comboSkill =
      COMBO_SKILLS[`${operatorKey}_combo_skill`] ?? COMBO_SKILLS[`${operatorKey}.combo_skill`]
    return comboSkill?.cooldown ?? null
  }

  const getUltimateCooldownMs = (operator: Operator | null) => {
    const operatorKey = getOperatorKey(operator)
    if (!operatorKey) return null
    const ultimate = ULTIMATES[`${operatorKey}_ultimate`] ?? ULTIMATES[`${operatorKey}.ultimate`]
    return ultimate?.cooldown ?? null
  }

  const calculateUltimateCharge = (characterId: string, upToTime: number) => {
    const charActions = actions
      .filter(a => a.characterId === characterId && a.timing <= upToTime)
      .sort((a, b) => a.timing - b.timing)

    let charge = 0
    charActions.forEach(action => {
      if (action.type === SkillType.BATTLE_SKILL) {
        charge += 15
      } else if (action.type === SkillType.COMBO_SKILL) {
        charge += 20
      } else if (action.type === SkillType.ULTIMATE) {
        charge = 0
      }
    })
    return Math.min(charge, 100)
  }

  const getSkillTypesForCharacter = () => {
    return [SkillType.BATTLE_SKILL, SkillType.COMBO_SKILL, SkillType.ULTIMATE]
  }

  const handleTimelineClick = (e: MouseEvent<HTMLDivElement>, character: Operator | null, type: SkillType) => {
    if (!character) return
    const target = e.target as HTMLElement
    if (target.closest('[data-action-id]')) return
    const lineElement = e.currentTarget.querySelector('[data-timeline-line]') as HTMLDivElement | null
    if (!lineElement) return
    const rect = lineElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clampedX = Math.max(0, Math.min(x, rect.width))
    const timing = Math.round(((clampedX / rect.width) * TIMELINE_DURATION) / 100) * 100
    onAddAction(character.name, type, timing)
  }

  return (
    <div className="flex-1 space-y-8">
      {characters.map((character, index) => (
        <TimelineRow
          key={`timeline-${character?.name ?? index}`}
          character={character}
          actions={actions}
          onRemoveAction={onRemoveAction}
          onMoveAction={onMoveAction}
          handleTimelineClick={handleTimelineClick}
          getActionPosition={getActionPosition}
          getComboSkillCooldownMs={getComboSkillCooldownMs}
          getUltimateCooldownMs={getUltimateCooldownMs}
          calculateUltimateCharge={calculateUltimateCharge}
          getSkillTypesForCharacter={getSkillTypesForCharacter}
        />
      ))}
    </div>
  )
}
