'use client'

import { type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import CharacterColumn from '@/components/CharacterColumn'
import TimelineColumn from '@/components/TimelineColumn'
import ShareableTimeline from '@/components/ShareableTimeline'
import {
  SKILL_TYPE_BG_COLORS,
  SKILL_TYPE_COLORS,
  SKILL_TYPE_LABELS,
} from '@/components/combo-timeline/skillTypeConfig'
import { EnemyStatusTimeline } from '@/components/EnemyStatusTimeline'
import { OperatorStatusTimeline } from '@/components/OperatorStatusTimeline'
import { NormalAttackTimeline } from '@/components/NormalAttackTimeline'
import { SpTimelineChart } from '@/components/SpTimelineChart'
import { TimelineScale } from '@/components/TimelineScale'
import ControlPanel from '@/components/ControlPanel'
import LoadDialog from '@/components/LoadDialog'
import { Input } from '@/components/ui/input'
import { useComboActions } from '@/hooks/useComboActions'
import { useComboCharacters } from '@/hooks/useComboCharacters'
import { useComboControlPanel } from '@/hooks/useComboControlPanel'
import { useComboLoadDialog } from '@/hooks/useComboLoadDialog'
import { getNormalAttackDurationMs, getPlungeAttackDurationMs } from '@/lib/data/attacks'
import { OPERATORS } from '@/lib/data/operators'
import { loadComboFromUrl } from '@/lib/storage'
import {
  BATTLE_SKILL_SP_COST,
  INITIAL_TEAM_SP,
  MAX_TIMELINE_DURATION,
  MIN_TIMELINE_DURATION,
  MAX_TEAM_SP,
  TEAM_SP_REGEN_PER_SECOND,
  TIMELINE_DURATION,
  TIMELINE_WIDTH,
  buildSpTimeline,
} from '@/lib/timeline'
import { useComboStore } from '@/stores/comboStore'
import type { SpTimelinePoint } from '@/lib/timeline'
import type { ComboState, Operator, SkillType } from '@/types/combo'

const buildSpChartData = (points: SpTimelinePoint[], timelineDurationMs: number) => {
  const stepMs = 1000
  const totalSteps = Math.floor(timelineDurationMs / stepMs)
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
  const [deleteMode, setDeleteMode] = useState(false)
  
  const comboName = useComboStore((state) => state.comboName)
  const characters = useComboStore((state) => state.characters)
  const actions = useComboStore((state) => state.actions)
  const timelineDurationMs = useComboStore((state) => state.timelineDurationMs)
  const initialTeamSp = useComboStore((state) => state.initialTeamSp)
  const initialUltimateCharges = useComboStore((state) => state.initialUltimateCharges)
  const initialEnemyStaggerMeter = useComboStore((state) => state.initialEnemyStaggerMeter)
  
  const getComboState = useComboStore((state) => state.getComboState)
  const loadCombo = useComboStore((state) => state.loadCombo)
  const setComboName = useComboStore((state) => state.setComboName)
  const setCharacters = useComboStore((state) => state.setCharacters)
  const setActions = useComboStore((state) => state.setActions)
  const setTimelineDurationMs = useComboStore((state) => state.setTimelineDurationMs)
  const setInitialTeamSp = useComboStore((state) => state.setInitialTeamSp)
  const setInitialUltimateCharges = useComboStore((state) => state.setInitialUltimateCharges)
  const setInitialUltimateCharge = useComboStore((state) => state.setInitialUltimateCharge)
  const setInitialEnemyStaggerMeter = useComboStore((state) => state.setInitialEnemyStaggerMeter)

  const getOperatorIdFromCharacterId = useCallback((characterId: string) => {
    const operatorEntry = Object.entries(OPERATORS).find(([, operator]) => operator.name === characterId)
    return operatorEntry?.[0] ?? null
  }, [])

  const loadComboState = useCallback((combo: ComboState) => {
    setComboName(combo.name)
    setCharacters(combo.characters)
    setActions(combo.actions)
    setTimelineDurationMs(combo.timelineDurationMs ?? TIMELINE_DURATION)
    setInitialTeamSp(combo.initialTeamSp ?? INITIAL_TEAM_SP)
    const nextCharges = combo.initialUltimateCharges ?? []
    setInitialUltimateCharges(nextCharges.length > 0 ? nextCharges : Array(4).fill(0))
    setInitialEnemyStaggerMeter(combo.initialEnemyStaggerMeter ?? 100)
  }, [setActions, setCharacters, setComboName, setInitialTeamSp, setInitialUltimateCharges, setTimelineDurationMs, setInitialEnemyStaggerMeter])

  // URL復元ロジック 第1段階 - URL パラメータから直接コンボを復元（最初に実行）
  useEffect(() => {
    const comboFromUrl = loadComboFromUrl()
    if (comboFromUrl) loadComboState(comboFromUrl)
  }, [loadComboState])

  const { handleCharacterSelect, handleCharacterReorder } = useComboCharacters(
    setCharacters,
    setInitialUltimateCharges
  )
  const { handleAddAction, handleRemoveAction, handleMoveAction } = useComboActions({
    setActions,
    getOperatorIdFromCharacterId,
    initialTeamSp,
    timelineDurationMs,
  })
  const { showLoadDialog, savedCombos, handleLoadOpen, handleLoad, handleDelete, onCloseLoadDialog } =
    useComboLoadDialog({
      loadComboState,
    })
  const { handleSave, handleExportImage, handleShare, handleClear } = useComboControlPanel({
    comboName,
    characters,
    actions,
    timelineDurationMs,
    initialTeamSp,
    initialUltimateCharges,
    setComboName,
    setCharacters,
    setActions,
    setTimelineDurationMs,
    setInitialTeamSp,
    setInitialUltimateCharges,
  })
  const playerCharacter = characters[0] ?? null
  const spTimeline = useMemo(
    () => buildSpTimeline(actions, initialTeamSp, BATTLE_SKILL_SP_COST, timelineDurationMs),
    [actions, initialTeamSp, timelineDurationMs]
  )
  const spChartData = useMemo(
    () => buildSpChartData(spTimeline.points, timelineDurationMs),
    [spTimeline.points, timelineDurationMs]
  )

  const getActionPosition = (timing: number) => {
    return (timing / timelineDurationMs) * TIMELINE_WIDTH
  }

  const getOperatorKey = (operator: Operator | null) => {
    if (!operator) return null
    const matched = Object.entries(OPERATORS).find(([, value]) => value.name === operator.name)
    return matched?.[0] ?? null
  }

  // Create operator ID mapping for actions
  const operatorIdMap = useMemo(() => {
    const map: Record<string, string> = {}
    actions.forEach((action) => {
      if (!map[action.characterId]) {
        const operatorId = getOperatorIdFromCharacterId(action.characterId)
        if (operatorId) {
          map[action.characterId] = operatorId
        }
      }
    })
    return map
  }, [actions, getOperatorIdFromCharacterId])

  const getNormalAttackDurationMsForPlayer = () => {
    const operatorKey = getOperatorKey(playerCharacter)
    if (!operatorKey) return null
    return getNormalAttackDurationMs(operatorKey)
  }

  const getPlungeAttackDurationMsForPlayer = () => {
    const operatorKey = getOperatorKey(playerCharacter)
    if (!operatorKey) return null
    return getPlungeAttackDurationMs(operatorKey)
  }

  const handleTimelineClick = (e: MouseEvent<HTMLDivElement>, character: Operator | null, type: SkillType) => {
    if (!character) return
    if (deleteMode) return
    const target = e.target as HTMLElement
    if (target.closest('[data-action-id]')) return
    const lineElement = e.currentTarget.querySelector('[data-timeline-line]') as HTMLDivElement | null
    if (!lineElement) return
    const rect = lineElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clampedX = Math.max(0, Math.min(x, rect.width))
    const timing = Math.round(((clampedX / rect.width) * timelineDurationMs) / 100) * 100
    handleAddAction(character.name, type, timing)
  }

  const handlePlungeTimelineClick = (e: MouseEvent<HTMLDivElement>, character: Operator | null, type: SkillType) => {
    if (!character) return
    if (deleteMode) return
    const target = e.target as HTMLElement
    if (target.closest('[data-action-id]')) return
    const lineElement = e.currentTarget.querySelector('[data-timeline-line]') as HTMLDivElement | null
    if (!lineElement) return
    const rect = lineElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clampedX = Math.max(0, Math.min(x, rect.width))
    const timing = Math.round(((clampedX / rect.width) * timelineDurationMs) / 100) * 100
    handleAddAction(character.name, type, timing, true)
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

      <ShareableTimeline
        characters={characters}
        actions={actions}
        timelineDurationMs={timelineDurationMs}
      />

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="text-sm font-medium text-gray-200 mb-3">{t('timeline.settingsTitle')}</div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2 w-[190px]">
            <label className="text-xs text-gray-300" htmlFor="timeline-duration">
              {t('timeline.durationLabel')}
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="timeline-duration"
                type="number"
                min={MIN_TIMELINE_DURATION / 1000}
                max={MAX_TIMELINE_DURATION / 1000}
                step={1}
                value={Math.round(timelineDurationMs / 1000)}
                onChange={(e) => setTimelineDurationMs(Number(e.target.value) * 1000)}
                className="w-20 bg-white text-gray-900"
              />
              <span className="text-xs text-gray-400">s</span>
              <span className="text-[10px] text-gray-500">
                {MIN_TIMELINE_DURATION / 1000}s - {MAX_TIMELINE_DURATION / 1000}s
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-42.5">
            <label className="text-xs text-gray-300" htmlFor="initial-sp">
              {t('timeline.initialSpLabel')}
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="initial-sp"
                type="number"
                min={0}
                max={MAX_TEAM_SP}
                step={5}
                value={initialTeamSp}
                onChange={(e) => setInitialTeamSp(Number(e.target.value))}
                className="w-20 bg-white text-gray-900"
              />
              <span className="text-[10px] text-gray-500">0 - {MAX_TEAM_SP}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-42.5">
            <label className="text-xs text-gray-300" htmlFor="initial-stagger">
              敵のスタッガー
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="initial-stagger"
                type="number"
                min={0}
                step={5}
                value={initialEnemyStaggerMeter}
                onChange={(e) => setInitialEnemyStaggerMeter(Number(e.target.value))}
                className="w-20 bg-white text-gray-900"
              />
              <span className="text-[10px] text-gray-500">初期値: 100</span>
            </div>
          </div>
          {characters.map((character, index) => (
            <div key={`ultimate-charge-${character?.name ?? index}`} className="flex flex-col gap-2 w-[170px]">
              <label
                className="text-xs text-gray-300 truncate"
                htmlFor={`ultimate-charge-${index}`}
              >
                {t('timeline.ultimateChargeLabel', { slot: index + 1 })}{' '}
                {character?.name ? t(character.name) : `(${t('team.selectCharacter')})`}
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id={`ultimate-charge-${index}`}
                  type="number"
                  min={0}
                  max={100}
                  step={5}
                  value={initialUltimateCharges[index] ?? 0}
                  onChange={(e) => setInitialUltimateCharge(index, Number(e.target.value))}
                  className="w-20 bg-white text-gray-900"
                  disabled={!character}
                />
              </div>
            </div>
          ))}
        </div>
      </div>


      <div id="combo-timeline" className="space-y-4">
        <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <div className="flex gap-4 items-center mb-6">
            <div className="w-40 shrink-0">
              <div className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{t('timeline.spLabel')}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {t('timeline.spInitial', {
                  value: initialTeamSp,
                  max: MAX_TEAM_SP,
                  regen: TEAM_SP_REGEN_PER_SECOND,
                  cost: BATTLE_SKILL_SP_COST,
                })}
              </div>
            </div>
            <div className="flex-1">
              <SpTimelineChart
                spChartData={spChartData}
                initialSp={initialTeamSp}
                maxSp={MAX_TEAM_SP}
                regenPerSecond={TEAM_SP_REGEN_PER_SECOND}
                battleSkillCost={BATTLE_SKILL_SP_COST}
                timelineDurationMs={timelineDurationMs}
                showLabel={false}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-40 shrink-0" />
            <div className="flex-1">
              <TimelineScale withCharacterOffset={false} timelineDurationMs={timelineDurationMs} />
            </div>
          </div>
          <div className="flex gap-4 mb-4 items-stretch">
            <div className="flex-1">
              <OperatorStatusTimeline
                actions={actions}
                timelineDurationMs={timelineDurationMs}
                showHeader={true}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-4 items-center">
            <div className="w-40 shrink-0">
              <div className="bg-gray-700 border border-gray-600 px-3 py-2 rounded h-12 flex flex-col justify-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('team.playerControlled')}</span>
                <span className="text-sm font-medium text-gray-100">
                  {playerCharacter?.name ? t(playerCharacter.name) : t('team.selectCharacter')}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <NormalAttackTimeline
                playerCharacter={playerCharacter}
                actions={actions}
                skillTypeLabels={SKILL_TYPE_LABELS}
                skillTypeColors={SKILL_TYPE_COLORS}
                skillTypeBgColors={SKILL_TYPE_BG_COLORS}
                getActionPosition={getActionPosition}
                getNormalAttackDurationMsForPlayer={getNormalAttackDurationMsForPlayer}
                getPlungeAttackDurationMsForPlayer={getPlungeAttackDurationMsForPlayer}
                onTimelineClick={handleTimelineClick}
                onPlungeTimelineClick={handlePlungeTimelineClick}
                onRemoveAction={handleRemoveAction}
                onMoveAction={handleMoveAction}
                timelineDurationMs={timelineDurationMs}
                deleteMode={deleteMode}
                showCharacterLabel={false}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <CharacterColumn
              characters={characters}
              onCharacterSelect={handleCharacterSelect}
              onCharacterReorder={handleCharacterReorder}
              deleteMode={deleteMode}
              onToggleDeleteMode={() => setDeleteMode((prev) => !prev)}
              deleteModeLabel={deleteMode ? t('actions.deleteModeOn') : t('actions.deleteModeOff')}
            />
            <TimelineColumn
              characters={characters}
              actions={actions}
              onAddAction={handleAddAction}
              onRemoveAction={handleRemoveAction}
              onMoveAction={handleMoveAction}
              timelineDurationMs={timelineDurationMs}
              initialUltimateCharges={initialUltimateCharges}
              deleteMode={deleteMode}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <div className="w-40 shrink-0 text-sm font-semibold text-gray-300 uppercase tracking-wide self-start pt-1">敵の状態</div>
            <div className="flex-1">
              <EnemyStatusTimeline
                actions={actions}
                operatorIdMap={operatorIdMap}
                withCharacterOffset={false}
                showHeader={false}
                timelineDurationMs={timelineDurationMs}
                initialEnemyStaggerMeter={initialEnemyStaggerMeter}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-40 shrink-0" />
            <div className="flex-1">
              <TimelineScale withCharacterOffset={false} timelineDurationMs={timelineDurationMs} />
            </div>
          </div>
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
