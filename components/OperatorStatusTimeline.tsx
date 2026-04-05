'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

import {
  TIMELINE_WIDTH,
  getSecondMarkerWidthPx,
  STATUS_EFFECT_COLORS,
  LONG_STATUS_EFFECT_DURATION_MS,
} from '@/lib/timeline'
import { getStatusEffectLabelKey } from '@/lib/statusEffectLabels'
import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
import { getNormalAttackDurationMs } from '@/lib/data/attacks'
import { Buff, SkillType } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

const SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT = 2

interface OperatorStatusTimelineProps {
  actions: ComboAction[]
  timelineDurationMs: number
  showHeader?: boolean
}

type SupportCrystalState = {
  startTime: number
  endTime: number
  recoveryCount: number
}

type ColdInfusionState = {
  startTime: number
  endTime: number
}

export const OperatorStatusTimeline = ({
  actions,
  timelineDurationMs,
  showHeader = true,
}: OperatorStatusTimelineProps) => {
  const t = useTranslations()
  const secondMarkerWidthPx = getSecondMarkerWidthPx(timelineDurationMs)
  
  const getActionPosition = (timing: number) => {
    return (timing / timelineDurationMs) * TIMELINE_WIDTH
  }

  const supportCrystalStates = useMemo<SupportCrystalState[]>(() => {
    const states: SupportCrystalState[] = []
    const sortedActions = [...actions].sort((a, b) => a.timing - b.timing)
    
    let isActive = false
    let segmentStart = 0
    let currentRecoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
    
    const closeCurrentSegment = (endTime: number) => {
      if (isActive) {
        states.push({ startTime: segmentStart, endTime, recoveryCount: currentRecoveryCount })
      }
    }

    sortedActions.forEach((action) => {
      const operatorId = getOperatorIdByName(action.characterId)
      const statusEffect = getStatusEffectForAction(operatorId, action.type)
      
      // Check if this action grants SUPPORT_CRYSTAL
      if (statusEffect?.includes(Buff.SUPPORT_CRYSTAL)) {
        if (!isActive) {
          isActive = true
          segmentStart = action.timing
          currentRecoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
        } else {
          // Re-activation: close current segment, start fresh
          closeCurrentSegment(action.timing)
          segmentStart = action.timing
          currentRecoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
        }
        return
      }
      
      // Heavy attack: decrement the recovery count at end of attack animation
      if (isActive && action.type === SkillType.NORMAL) {
        const attackEndTime = action.timing + getNormalAttackDurationMs(operatorId ?? '')
        // Close the current segment at the end of the attack (when heavy attack fires)
        closeCurrentSegment(attackEndTime)
        currentRecoveryCount = Math.max(0, currentRecoveryCount - 1)
        
        if (currentRecoveryCount === 0) {
          // Crystal exhausted — no new segment
          isActive = false
        } else {
          // Start new segment with decremented count
          segmentStart = attackEndTime
        }
      }
    })
    
    // If still active at end of timeline, close the final segment
    if (isActive) {
      states.push({
        startTime: segmentStart,
        endTime: timelineDurationMs,
        recoveryCount: currentRecoveryCount,
      })
    }
    
    return states
  }, [actions, timelineDurationMs])

  const coldInfusionStates = useMemo<ColdInfusionState[]>(() => {
    const states: ColdInfusionState[] = []
    const sortedActions = [...actions].sort((a, b) => a.timing - b.timing)
    
    sortedActions.forEach((action) => {
      const operatorId = getOperatorIdByName(action.characterId)
      const statusEffect = getStatusEffectForAction(operatorId, action.type)
      
      // Check if this action grants COLD_INFUSION
      if (statusEffect?.includes(Buff.COLD_INFUSION)) {
        const startTime = action.timing
        const endTime = Math.min(startTime + LONG_STATUS_EFFECT_DURATION_MS, timelineDurationMs)
        states.push({
          startTime,
          endTime,
        })
      }
    })
    
    return states
  }, [actions, timelineDurationMs])

  const supportCrystalBgColor = STATUS_EFFECT_COLORS[Buff.SUPPORT_CRYSTAL] || 'bg-purple-500'
  const supportCrystalLabel = t(getStatusEffectLabelKey(Buff.SUPPORT_CRYSTAL))
  
  const coldInfusionBgColor = STATUS_EFFECT_COLORS[Buff.COLD_INFUSION] || 'bg-blue-300'
  const coldInfusionLabel = t(getStatusEffectLabelKey(Buff.COLD_INFUSION))

  return (
    <div className="flex flex-col">
      {showHeader && (
        <div className="flex items-center">
          <div className="w-40 text-sm font-semibold text-gray-200">自操作キャラ</div>
          <div className="w-24 shrink-0" />
          <div className="text-xs text-gray-500" style={{ width: `${TIMELINE_WIDTH}px` }}>
            {Array.from({ length: Math.ceil(timelineDurationMs / 1000) }, (_, i) => (
              <span key={i} style={{ display: 'inline-block', width: `${secondMarkerWidthPx}px`, textAlign: 'center' }}>
                {i}s
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center border-b border-gray-600">
        <div className="w-40 px-4 py-2 flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${supportCrystalBgColor}`} />
          <span className="text-sm font-medium text-gray-200">{supportCrystalLabel}</span>
        </div>
        <div className="w-24 shrink-0" />
        <div className="flex-1 relative h-12" style={{ width: `${TIMELINE_WIDTH}px` }}>
          {supportCrystalStates.map((state, idx) => {
            const leftPx = getActionPosition(state.startTime)
            const widthPx = getActionPosition(state.endTime) - leftPx
            
            // Determine color based on recovery count
            let segmentBgColor = supportCrystalBgColor
            if (state.recoveryCount === 0) {
              segmentBgColor = 'bg-gray-400 opacity-50' // Exhausted state
            } else if (state.recoveryCount === 1) {
              segmentBgColor = 'bg-purple-600 opacity-80' // Low recovery
            }
            
            return (
              <div
                key={idx}
                className={`absolute h-8 top-2 ${segmentBgColor} border border-slate-400 flex items-center justify-center`}
                style={{
                  left: `${leftPx}px`,
                  width: `${Math.max(30, widthPx)}px`,
                }}
              >
                <span className="text-xs font-bold text-white pointer-events-none">
                  ×{state.recoveryCount}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center border-b border-gray-600">
        <div className="w-40 px-4 py-2 flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${coldInfusionBgColor}`} />
          <span className="text-sm font-medium text-gray-200">{coldInfusionLabel}</span>
        </div>
        <div className="w-24 shrink-0" />
        <div className="flex-1 relative h-12" style={{ width: `${TIMELINE_WIDTH}px` }}>
          {coldInfusionStates.map((state, idx) => {
            const leftPx = getActionPosition(state.startTime)
            const widthPx = getActionPosition(state.endTime) - leftPx
            
            return (
              <div
                key={idx}
                className={`absolute h-8 top-2 ${coldInfusionBgColor} border border-slate-400`}
                style={{
                  left: `${leftPx}px`,
                  width: `${Math.max(30, widthPx)}px`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
