'use client'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface ControlPanelProps {
  comboName: string
  onComboNameChange: (name: string) => void
  onSave: () => void
  onLoad: () => void
  onExportImage: () => void
  onShare: () => void
  onClear: () => void
}

export default function ControlPanel({
  comboName,
  onComboNameChange,
  onSave,
  onLoad,
  onExportImage,
  onShare,
  onClear,
}: ControlPanelProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          type="text"
          value={comboName}
          onChange={(e) => onComboNameChange(e.target.value)}
          placeholder="コンボ名を入力..."
          className="flex-1 min-w-[200px] px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <Button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          保存
        </Button>
        
        <Button
          onClick={onLoad}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
        >
          読込
        </Button>
        
        <Button
          onClick={onExportImage}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
        >
          画像エクスポート
        </Button>
        
        <Button
          onClick={onShare}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
        >
          共有
        </Button>
        
        <Button
          onClick={onClear}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          クリア
        </Button>
      </div>
    </div>
  )
}
