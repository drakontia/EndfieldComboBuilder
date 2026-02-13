'use client'

import { Character, Action, AttackType, StatusEffect, EnemyStatusEffect } from '@/types/combo'
import { useState, useEffect } from 'react'

interface ComboTimelineProps {
  characters: (Character | null)[]
  actions: Action[]
  onAddAction: (characterId: string, type: AttackType, timing: number) => void
  onRemoveAction: (actionId: string) => void
  onEditAction: (action: Action) => void
}

const ATTACK_TYPE_LABELS = {
  [AttackType.NORMAL]: '通常攻撃',
  [AttackType.BATTLE_SKILL]: '戦技',
  [AttackType.SYNERGY_SKILL]: '連携技',
  [AttackType.ULTIMATE]: '必殺技',
}

const ATTACK_TYPE_COLORS = {
  [AttackType.NORMAL]: 'bg-blue-500',
  [AttackType.BATTLE_SKILL]: 'bg-green-500',
  [AttackType.SYNERGY_SKILL]: 'bg-purple-500',
  [AttackType.ULTIMATE]: 'bg-red-500',
}

const STATUS_EFFECT_COLORS = {
  [StatusEffect.BURN]: 'bg-orange-500',
  [StatusEffect.FREEZE]: 'bg-cyan-500',
  [StatusEffect.SHOCK]: 'bg-yellow-500',
  [StatusEffect.POISON]: 'bg-purple-700',
  [StatusEffect.STUN]: 'bg-gray-500',
  [StatusEffect.WEAKNESS]: 'bg-pink-500',
}

const STATUS_EFFECT_LABELS = {
  [StatusEffect.BURN]: '炎上',
  [StatusEffect.FREEZE]: '凍結',
  [StatusEffect.SHOCK]: '感電',
  [StatusEffect.POISON]: '中毒',
  [StatusEffect.STUN]: 'スタン',
  [StatusEffect.WEAKNESS]: '脆弱',
}

const DEFAULT_STATUS_EFFECT_DURATION_MS = 3000
const CHARGE_SEGMENT_WIDTH = 10
const ULTIMATE_CHARGE_COLOR_RGB = '239, 68, 68'
const ULTIMATE_CHARGE_OPACITY_MULTIPLIER = 0.3

export default function ComboTimeline({
  characters,
  actions,
  onAddAction,
  onRemoveAction,
  onEditAction,
}: ComboTimelineProps) {
  const TIMELINE_WIDTH = 1000 // pixels
  const TIMELINE_DURATION = 10000 // 10 seconds in ms

  const [enemyStatusEffects, setEnemyStatusEffects] = useState<EnemyStatusEffect[]>([])

  const getActionPosition = (timing: number) => {
    return (timing / TIMELINE_DURATION) * TIMELINE_WIDTH
  }

  // Calculate ultimate charge for each character over time
  const calculateUltimateCharge = (characterId: string, upToTime: number) => {
    const charActions = actions
      .filter(a => a.characterId === characterId && a.timing <= upToTime)
      .sort((a, b) => a.timing - b.timing)
    
    let charge = 0
    charActions.forEach(action => {
      if (action.type === AttackType.NORMAL) {
        charge += 5
      } else if (action.type === AttackType.BATTLE_SKILL) {
        charge += 15
      } else if (action.type === AttackType.SYNERGY_SKILL) {
        charge += 20
      } else if (action.type === AttackType.ULTIMATE) {
        charge = 0 // Reset after using ultimate
      }
    })
    return Math.min(charge, 100)
  }

  // Update enemy status effects when actions change
  useEffect(() => {
    const effects: EnemyStatusEffect[] = []
    actions.forEach(action => {
      if (action.statusEffect) {
        effects.push({
          id: `${action.id}-effect`,
          effect: action.statusEffect,
          startTime: action.timing,
          duration: DEFAULT_STATUS_EFFECT_DURATION_MS,
          sourceActionId: action.id,
        })
      }
    })
    setEnemyStatusEffects(effects)
  }, [actions])

  const getAttackTypesForCharacter = (index: number) => {
    // First character (player-controlled) has all attack types
    if (index === 0) {
      return [AttackType.NORMAL, AttackType.BATTLE_SKILL, AttackType.SYNERGY_SKILL, AttackType.ULTIMATE]
    }
    // Other characters don't have normal attack
    return [AttackType.BATTLE_SKILL, AttackType.SYNERGY_SKILL, AttackType.ULTIMATE]
  }

  return (
    <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">コンボタイムライン</h2>
      
      {characters.filter((c): c is Character => c !== null).map((character, index) => (
        <div key={character.id} className="mb-8">
          <div className="text-lg font-semibold mb-2 flex items-center gap-2">
            {character.name}
            {index === 0 && <span className="text-yellow-400 text-xs">(自操作)</span>}
          </div>
          
          {getAttackTypesForCharacter(index).map((type) => (
            <div key={type} className="mb-2">
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-400">
                  {ATTACK_TYPE_LABELS[type]}
                </div>
                <div className="relative flex-1 h-12 bg-gray-700 rounded">
                  {/* Ultimate charge background for ultimate lines */}
                  {type === AttackType.ULTIMATE && (
                    <div className="absolute inset-0 flex">
                      {[...Array(TIMELINE_WIDTH / CHARGE_SEGMENT_WIDTH)].map((_, i) => {
                        const time = (i * CHARGE_SEGMENT_WIDTH / TIMELINE_WIDTH) * TIMELINE_DURATION
                        const charge = calculateUltimateCharge(character.id, time)
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
                  
                  {/* Timeline markers */}
                  <div className="absolute inset-0 flex">
                    {[...Array(11)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-gray-600"
                        style={{ width: `${100 / 10}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Actions */}
                  {actions
                    .filter(a => a.characterId === character.id && a.type === type)
                    .map(action => (
                      <div
                        key={action.id}
                        className={`absolute top-1 h-10 ${ATTACK_TYPE_COLORS[type]} rounded px-2 text-xs flex items-center justify-between cursor-pointer hover:opacity-80`}
                        style={{
                          left: `${getActionPosition(action.timing)}px`,
                          width: '60px',
                        }}
                        onClick={() => onRemoveAction(action.id)}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          onEditAction(action)
                        }}
                        title="左クリック: 削除 / 右クリック: 編集"
                      >
                        <span>{action.timing / 1000}s</span>
                        {action.hitCount && <span>x{action.hitCount}</span>}
                        {action.statusEffect && <span className="text-yellow-300">⚡</span>}
                      </div>
                    ))}
                  
                  {/* Click to add action */}
                  <div
                    className="absolute inset-0 cursor-crosshair"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const timing = Math.round((x / TIMELINE_WIDTH) * TIMELINE_DURATION / 100) * 100
                      onAddAction(character.id, type, timing)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      
      {/* Enemy Status Line */}
      <div className="mb-8 border-t-2 border-red-700 pt-4">
        <div className="text-lg font-semibold mb-2 text-red-400">敵の状態</div>
        <div className="flex items-center">
          <div className="w-24 text-sm text-gray-400">
            状態異常
          </div>
          <div className="relative flex-1 h-12 bg-gray-900 rounded border border-red-700">
            {/* Timeline markers */}
            <div className="absolute inset-0 flex">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-gray-600"
                  style={{ width: `${100 / 10}%` }}
                />
              ))}
            </div>
            
            {/* Status effects */}
            {enemyStatusEffects.map(effect => (
              <div
                key={effect.id}
                className={`absolute top-1 h-10 ${STATUS_EFFECT_COLORS[effect.effect]} rounded px-2 text-xs flex items-center justify-center opacity-80`}
                style={{
                  left: `${getActionPosition(effect.startTime)}px`,
                  width: `${(effect.duration / TIMELINE_DURATION) * TIMELINE_WIDTH}px`,
                }}
                title={`${STATUS_EFFECT_LABELS[effect.effect]} (${effect.duration / 1000}s)`}
              >
                {STATUS_EFFECT_LABELS[effect.effect]}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Timeline scale */}
      <div className="flex items-center mt-4">
        <div className="w-24" />
        <div className="relative flex-1 h-6">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xs text-gray-400"
              style={{ left: `${(i / 10) * TIMELINE_WIDTH}px` }}
            >
              {i}s
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
