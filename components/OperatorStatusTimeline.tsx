'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

import {
  TIMELINE_WIDTH,
  getSecondMarkerWidthPx,
  STATUS_EFFECT_COLORS,
} from '@/lib/timeline'
import { getStatusEffectLabelKey } from '@/lib/statusEffectLabels'
import { getOperatorIdByName } from '@/lib/data/operators'
import { getStatusEffectForAction } from '@/lib/data/skills'
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
    let activeSince = 0
    let currentRecoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
    
    sortedActions.forEach((action) => {
      const operatorId = getOperatorIdByName(action.characterId)
      const statusEffect = getStatusEffectForAction(operatorId, action.type)
      
      // Check if this action grants SUPPORT_CRYSTAL
      if (statusEffect?.includes(Buff.SUPPORT_CRYSTAL)) {
        if (!isActive) {
          // Start new support crystal segment
          isActive = true
          activeSince = action.timing
          currentRecoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
        } else {
          // Extend existing segment
          currentRecoveryCount = SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT
        }
        return
      }
      
      // Check if this is a normal attack (potential heavy attack)
      if (isActive && action.type === SkillType.NORMAL) {
        // Decrement recovery count
        if (currentRecoveryCount > 0) {
          currentRecoveryCount = Math.max(0, currentRecoveryCount - 1)
        }
        
        // If recovery count reaches 0, close the segment
        if (currentRecoveryCount === 0) {
          states.push({
            startTime: activeSince,
            endTime: action.timing,
            recoveryCount: SUPPORT_CRYSTAL_MAX_RECOVERY_COUNT,
          })
          isActive = false
        }
      }
    })
    
    // If still active at the end, close the segment
    if (isActive) {
      states.push({
        startTime: activeSince,
        endTime: timelineDurationMs,
        recoveryCount: currentRecoveryCount,
      })
    }
    
    return states
  }, [actions, timelineDurationMs])

  const backgroundColor = STATUS_EFFECT_COLORS[Buff.SUPPORT_CRYSTAL] || 'bg-purple-500'
  const label = t(getStatusEffectLabelKey(Buff.SUPPORT_CRYSTAL))

  return (
    <div className="flex flex-col">
      {showHeader && (
        <div className="flex items-center">
          <div className="w-40 text-sm font-semibold text-gray-700">自操作キャラ</div>
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
      
      <div className="flex items-center border-b border-slate-200">
        <div className="w-40 px-4 py-2 flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${backgroundColor}`} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="w-24 shrink-0" />
        <div className="flex-1 relative h-12" style={{ width: `${TIMELINE_WIDTH}px` }}>
          {supportCrystalStates.map((state, idx) => {
            const leftPx = getActionPosition(state.startTime)
            const widthPx = getActionPosition(state.endTime) - leftPx
            
            // Determine color based on recovery count
            let segmentBgColor = backgroundColor
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
    </div>
  )
}
