'use client'

import { FolderOpen, Image, Link, Save, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations()

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          data-testid="combo-name-input"
          type="text"
          value={comboName}
          onChange={(e) => onComboNameChange(e.target.value)}
          placeholder={t('dialog.comboNamePlaceholder')}
          className="flex-1 min-w-50 px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
          onClick={onSave}
          className="gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          <Save size={15} />
          {t('actions.save')}
        </Button>

        <Button
          onClick={onLoad}
          className="gap-1.5 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white border border-gray-500 rounded transition"
        >
          <FolderOpen size={15} />
          {t('actions.load')}
        </Button>

        <Button
          onClick={onExportImage}
          className="gap-1.5 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white border border-gray-500 rounded transition"
        >
          <Image size={15} />
          {t('actions.export')}
        </Button>

        <Button
          onClick={onShare}
          className="gap-1.5 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white border border-gray-500 rounded transition"
        >
          <Link size={15} />
          {t('actions.share')}
        </Button>

        <Button
          onClick={onClear}
          className="gap-1.5 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition"
        >
          <Trash2 size={15} />
          {t('actions.clear')}
        </Button>
      </div>
    </div>
  )
}
