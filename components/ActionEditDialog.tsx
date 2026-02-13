'use client'

import { Action, StatusEffect } from '@/types/combo'

interface ActionEditDialogProps {
  isOpen: boolean
  action: Action | null
  onClose: () => void
  onSave: (action: Action) => void
}

const STATUS_EFFECT_OPTIONS = [
  { value: StatusEffect.BURN, label: '炎上' },
  { value: StatusEffect.FREEZE, label: '凍結' },
  { value: StatusEffect.SHOCK, label: '感電' },
  { value: StatusEffect.POISON, label: '中毒' },
  { value: StatusEffect.STUN, label: 'スタン' },
  { value: StatusEffect.WEAKNESS, label: '脆弱' },
]

export default function ActionEditDialog({
  isOpen,
  action,
  onClose,
  onSave,
}: ActionEditDialogProps) {
  if (!isOpen || !action) return null

  const handleStatusEffectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const updatedAction = {
      ...action,
      statusEffect: value ? (value as StatusEffect) : undefined,
    }
    onSave(updatedAction)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">アクション編集</h2>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            状態異常
          </label>
          <select
            value={action.statusEffect || ''}
            onChange={handleStatusEffectChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">なし</option>
            {STATUS_EFFECT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
