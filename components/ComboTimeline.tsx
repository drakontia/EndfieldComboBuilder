'use client'

import { type DragEvent, type MouseEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import CharacterSelectDialog from '@/components/CharacterSelectDialog'
import { OPERATORS, getOperatorIdByName } from '@/lib/data/operators'
import { COMBO_SKILLS, ULTIMATES, getStatusEffectForAction } from '@/lib/data/skills'
import {
  CHARGE_SEGMENT_WIDTH,
  SECOND_MARKER_WIDTH_PX,
  TIMELINE_DURATION,
  TIMELINE_ROW_HEIGHT_PX,
  TIMELINE_WIDTH,
  ULTIMATE_CHARGE_COLOR_RGB,
  ULTIMATE_CHARGE_OPACITY_MULTIPLIER,
} from '@/lib/timeline'

import { SkillType } from '@/types/combo'
import type { Operator } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

interface ComboTimelineProps {
  characters: (Operator | null)[]
  actions: ComboAction[]
  onCharacterSelect: (character: Operator | null, index: number) => void
  onCharacterReorder: (fromIndex: number, toIndex: number) => void
  onAddAction: (characterId: string, type: SkillType, timing: number) => void
  onRemoveAction: (actionId: string) => void
}

export const SKILL_TYPE_LABELS = {
  [SkillType.NORMAL]: '通常攻撃',
  [SkillType.BATTLE_SKILL]: '戦技',
  [SkillType.COMBO_SKILL]: '連携技',
  [SkillType.ULTIMATE]: '必殺技',
}

export const SKILL_TYPE_COLORS = {
  [SkillType.NORMAL]: 'bg-slate-500',
  [SkillType.BATTLE_SKILL]: 'bg-green-500',
  [SkillType.COMBO_SKILL]: 'bg-purple-500',
  [SkillType.ULTIMATE]: 'bg-red-500',
}

export const SKILL_TYPE_BG_COLORS = {
  [SkillType.NORMAL]: '#64748b',
  [SkillType.BATTLE_SKILL]: '#22c55e',
  [SkillType.COMBO_SKILL]: '#a855f7',
  [SkillType.ULTIMATE]: '#ef4444',
}

export default function ComboTimeline({
  characters,
  actions,
  onCharacterSelect,
  onCharacterReorder,
  onAddAction,
  onRemoveAction,
}: ComboTimelineProps) {
  const t = useTranslations()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [selectingSlotIndex, setSelectingSlotIndex] = useState<number | null>(null)

  const availableCharacters = useMemo(
    () =>
      Object.entries(OPERATORS).map(([id, operator]) => ({
        id,
        operator,
      })),
    []
  )

  const selectableCharacters = useMemo(
    () =>
      availableCharacters.filter(
        (character) => !characters.some((selectedCharacter) => selectedCharacter?.name === character.operator.name)
      ),
    [availableCharacters, characters]
  )

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

  // Calculate ultimate charge for each character over time
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
        charge = 0 // Reset after using ultimate
      }
    })
    return Math.min(charge, 100)
  }

  const getSkillTypesForCharacter = () => {
    return [SkillType.BATTLE_SKILL, SkillType.COMBO_SKILL, SkillType.ULTIMATE]
  }

  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      onCharacterReorder(draggedIndex, index)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleOpenSelector = (slotIndex: number) => {
    setSelectingSlotIndex(slotIndex)
    setIsSelectorOpen(true)
  }

  const handleSelectCharacter = (character: Operator) => {
    if (selectingSlotIndex === null) return
    onCharacterSelect(character, selectingSlotIndex)
    setIsSelectorOpen(false)
    setSelectingSlotIndex(null)
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
    <>
      <div className="space-y-8">
        {characters.map((character, index) => (
          <div
            key={character?.name ?? `slot-${index}`}
            className={`flex gap-4 items-stretch ${dragOverIndex === index ? 'border-2 border-blue-500 rounded' : ''}`}
            style={{ height: TIMELINE_ROW_HEIGHT_PX }}
          >
            <div
              className="w-40 shrink-0"
              draggable={!!character}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className={`bg-gray-700 p-2 rounded h-40 ${character ? 'cursor-move' : ''}`}>
                {character ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded bg-gray-600 overflow-hidden flex items-center justify-center">
                        {character.imageUrl ? (
                          <Image
                            src={character.imageUrl}
                            alt={character?.name ? t(character.name) : ''}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-200">{t('team.noImage')}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-100 text-center">
                        {character?.name ? t(character.name) : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenSelector(index)}
                    className="w-full h-full bg-gray-600 hover:bg-gray-500 text-white rounded px-2 py-2"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded bg-gray-500/60 flex items-center justify-center">
                        <span className="text-xs text-gray-200">{t('team.noImage')}</span>
                      </div>
                      <span className="text-sm text-gray-100 text-center">{t('team.selectCharacter')}</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 h-full flex flex-col gap-2 bg-black/20">
              {getSkillTypesForCharacter().map((type) => (
                <div key={type}>
                  <div className="flex items-center" onClick={(e) => handleTimelineClick(e, character, type)}>
                    <div className="w-24 text-sm text-gray-400">
                      {SKILL_TYPE_LABELS[type]}
                    </div>
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
                            (cooldownMs / TIMELINE_DURATION) * TIMELINE_WIDTH,
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
                  {/* Ultimate charge background for ultimate lines */}
                  {character && type === SkillType.ULTIMATE && (
                    <div className="absolute inset-0 flex z-0">
                      {[...Array(TIMELINE_WIDTH / CHARGE_SEGMENT_WIDTH)].map((_, i) => {
                        const time = (i * CHARGE_SEGMENT_WIDTH / TIMELINE_WIDTH) * TIMELINE_DURATION
                        const charge = calculateUltimateCharge(character.name, time)
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
                            (cooldownMs / TIMELINE_DURATION) * TIMELINE_WIDTH,
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
                  
                  {/* Timeline markers */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                      backgroundSize: `${SECOND_MARKER_WIDTH_PX}px 100%`,
                    }}
                  />

                  <div
                    className="absolute inset-0 z-5"
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  
                  {/* Actions */}
                  {actions
                    .filter(a => character && a.characterId === character.name && a.type === type)
                    .map((action) => {
                      const statusEffect = getStatusEffectForAction(
                        getOperatorIdByName(action.characterId),
                        action.type
                      )
                      return (
                      <div
                        key={action.id}
                        className={`absolute top-1 z-20 h-10 ${SKILL_TYPE_COLORS[type]} rounded px-2 text-xs flex items-center justify-between cursor-pointer hover:opacity-80`}
                        data-action-id={action.id}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: `${getActionPosition(action.timing)}px`,
                          width: '60px',
                          height: '40px',
                          backgroundColor: SKILL_TYPE_BG_COLORS[type],
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
                    )})}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CharacterSelectDialog
        isOpen={isSelectorOpen}
        options={selectableCharacters}
        onClose={() => {
          setIsSelectorOpen(false)
          setSelectingSlotIndex(null)
        }}
        onSelect={handleSelectCharacter}
      />
    </>
  )
}
