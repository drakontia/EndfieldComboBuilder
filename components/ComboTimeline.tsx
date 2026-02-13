'use client'

import { Character, Action, AttackType } from '@/types/combo'

interface ComboTimelineProps {
  characters: (Character | null)[]
  actions: Action[]
  onAddAction: (characterId: string, type: AttackType, timing: number) => void
  onRemoveAction: (actionId: string) => void
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

export default function ComboTimeline({
  characters,
  actions,
  onAddAction,
  onRemoveAction,
}: ComboTimelineProps) {
  const TIMELINE_WIDTH = 1000 // pixels
  const TIMELINE_DURATION = 10000 // 10 seconds in ms

  const getActionPosition = (timing: number) => {
    return (timing / TIMELINE_DURATION) * TIMELINE_WIDTH
  }

  return (
    <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">コンボタイムライン</h2>
      
      {characters.filter((c): c is Character => c !== null).map((character, index) => (
        <div key={character.id} className="mb-8">
          <div className="text-lg font-semibold mb-2">{character.name}</div>
          
          {[AttackType.NORMAL, AttackType.BATTLE_SKILL, AttackType.SYNERGY_SKILL, AttackType.ULTIMATE].map((type) => (
            <div key={type} className="mb-2">
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-400">
                  {ATTACK_TYPE_LABELS[type]}
                </div>
                <div className="relative flex-1 h-12 bg-gray-700 rounded">
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
                        title="クリックして削除"
                      >
                        <span>{action.timing / 1000}s</span>
                        {action.hitCount && <span>x{action.hitCount}</span>}
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
