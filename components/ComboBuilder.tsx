'use client'

import { type MouseEvent, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import ComboTimeline, {
  SKILL_TYPE_BG_COLORS,
  SKILL_TYPE_COLORS,
  SKILL_TYPE_LABELS,
} from '@/components/ComboTimeline'
import { EnemyStatusTimeline } from '@/components/EnemyStatusTimeline'
import { NormalAttackTimeline } from '@/components/NormalAttackTimeline'
import { SpTimelineChart } from '@/components/SpTimelineChart'
import { TimelineScale } from '@/components/TimelineScale'
import ControlPanel from '@/components/ControlPanel'
import LoadDialog from '@/components/LoadDialog'
import { useComboActions } from '@/hooks/useComboActions'
import { useComboCharacters } from '@/hooks/useComboCharacters'
import { useComboControlPanel } from '@/hooks/useComboControlPanel'
import { useComboLoadDialog } from '@/hooks/useComboLoadDialog'
import { getNormalAttackDurationMs } from '@/lib/data/attacks'
import { OPERATORS } from '@/lib/data/operators'
import { loadComboFromUrl } from '@/lib/storage'
import {
  BATTLE_SKILL_SP_COST,
  INITIAL_TEAM_SP,
  MAX_TEAM_SP,
  TEAM_SP_REGEN_PER_SECOND,
  TIMELINE_DURATION,
  TIMELINE_WIDTH,
  buildSpTimeline,
} from '@/lib/timeline'
import { useComboStore } from '@/stores/comboStore'
import type { SpTimelinePoint } from '@/lib/timeline'
import type { ComboState, Operator, SkillType } from '@/types/combo'

const buildSpChartData = (points: SpTimelinePoint[]) => {
  const stepMs = 1000
  const totalSteps = Math.floor(TIMELINE_DURATION / stepMs)
  const chartData: { timing: number; sp: number }[] = []
  let currentIndex = 0
  let currentSp = points[0]?.sp ?? INITIAL_TEAM_SP

  for (let i = 0; i <= totalSteps; i += 1) {
    const timing = i * stepMs
    while (currentIndex + 1 < points.length && points[currentIndex + 1].timing <= timing) {
      currentIndex += 1
      currentSp = points[currentIndex].sp
    }

    chartData.push({ timing, sp: currentSp })
  }

  return chartData
}

export const ComboBuilder = () => {
  const t = useTranslations()
  const comboName = useComboStore((state) => state.comboName)
  const characters = useComboStore((state) => state.characters)
  const actions = useComboStore((state) => state.actions)
  const setComboName = useComboStore((state) => state.setComboName)
  const setCharacters = useComboStore((state) => state.setCharacters)
  const setActions = useComboStore((state) => state.setActions)

  const getOperatorIdFromCharacterId = useCallback((characterId: string) => {
    const operatorEntry = Object.entries(OPERATORS).find(([, operator]) => operator.name === characterId)
    return operatorEntry?.[0] ?? null
  }, [])

  const loadComboState = useCallback((combo: ComboState) => {
    setComboName(combo.name)
    setCharacters(combo.characters)
    setActions(combo.actions)
  }, [setActions, setCharacters, setComboName])

  useEffect(() => {
    if (!comboName) {
      setComboName(t('dialog.comboNamePlaceholder'))
    }
  }, [comboName, setComboName, t])

  useEffect(() => {
    const comboFromUrl = loadComboFromUrl()
    if (comboFromUrl) loadComboState(comboFromUrl)
  }, [loadComboState])

  const { handleCharacterSelect, handleCharacterReorder } = useComboCharacters(setCharacters)
  const { handleAddAction, handleRemoveAction } = useComboActions({
    setActions,
    getOperatorIdFromCharacterId,
  })
  const { showLoadDialog, savedCombos, handleLoadOpen, handleLoad, handleDelete, onCloseLoadDialog } =
    useComboLoadDialog({
      loadComboState,
    })
  const { handleSave, handleExportImage, handleShare, handleClear } = useComboControlPanel({
    comboName,
    characters,
    actions,
    setComboName,
    setCharacters,
    setActions,
  })
  const playerCharacter = characters[0] ?? null
  const spTimeline = useMemo(() => buildSpTimeline(actions), [actions])
  const spChartData = useMemo(() => buildSpChartData(spTimeline.points), [spTimeline.points])

  const getActionPosition = (timing: number) => {
    return (timing / TIMELINE_DURATION) * TIMELINE_WIDTH
  }

  const getOperatorKey = (operator: Operator | null) => {
    if (!operator) return null
    const matched = Object.entries(OPERATORS).find(([, value]) => value.name === operator.name)
    return matched?.[0] ?? null
  }

  const getNormalAttackDurationMsForPlayer = () => {
    const operatorKey = getOperatorKey(playerCharacter)
    if (!operatorKey) return null
    return getNormalAttackDurationMs(operatorKey)
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
    handleAddAction(character.name, type, timing)
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">{t('app.title')}</h1>

      <ControlPanel
        comboName={comboName}
        onComboNameChange={setComboName}
        onSave={handleSave}
        onLoad={handleLoadOpen}
        onExportImage={handleExportImage}
        onShare={handleShare}
        onClear={handleClear}
      />

      <div id="combo-timeline" className="space-y-4">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <SpTimelineChart
            spChartData={spChartData}
            initialSp={INITIAL_TEAM_SP}
            maxSp={MAX_TEAM_SP}
            regenPerSecond={TEAM_SP_REGEN_PER_SECOND}
            battleSkillCost={BATTLE_SKILL_SP_COST}
          />
          <TimelineScale withCharacterOffset />
          <NormalAttackTimeline
            playerCharacter={playerCharacter}
            actions={actions}
            skillTypeLabels={SKILL_TYPE_LABELS}
            skillTypeColors={SKILL_TYPE_COLORS}
            skillTypeBgColors={SKILL_TYPE_BG_COLORS}
            getActionPosition={getActionPosition}
            getNormalAttackDurationMsForPlayer={getNormalAttackDurationMsForPlayer}
            onTimelineClick={handleTimelineClick}
            onRemoveAction={handleRemoveAction}
          />
          <ComboTimeline
            characters={characters}
            actions={actions}
            onCharacterSelect={handleCharacterSelect}
            onCharacterReorder={handleCharacterReorder}
            onAddAction={handleAddAction}
            onRemoveAction={handleRemoveAction}
          />
          <EnemyStatusTimeline actions={actions} />
          <TimelineScale withCharacterOffset />
        </div>
      </div>

      <LoadDialog
        isOpen={showLoadDialog}
        savedCombos={savedCombos}
        onClose={onCloseLoadDialog}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />
    </main>
  )
}
