'use client'

import { ComboState } from '@/types/combo'

interface LoadDialogProps {
  isOpen: boolean
  savedCombos: ComboState[]
  onClose: () => void
  onLoad: (combo: ComboState) => void
  onDelete: (name: string) => void
}

export default function LoadDialog({
  isOpen,
  savedCombos,
  onClose,
  onLoad,
  onDelete,
}: LoadDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">コンボを読み込む</h2>
        
        {savedCombos.length === 0 ? (
          <p className="text-gray-400 mb-4">保存されたコンボがありません</p>
        ) : (
          <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
            {savedCombos.map((combo) => (
              <div
                key={combo.name}
                className="bg-gray-700 p-3 rounded flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-semibold">{combo.name}</div>
                  <div className="text-sm text-gray-400">
                    {combo.characters.filter(c => c).length} キャラ, {combo.actions.length} アクション
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onLoad(combo)
                      onClose()
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    読込
                  </button>
                  <button
                    onClick={() => onDelete(combo.name)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}
