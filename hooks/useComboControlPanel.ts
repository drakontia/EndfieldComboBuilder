import { useTranslations } from 'next-intl'

import { exportAsImage } from '@/lib/export'
import { generateShareUrl, saveCombo } from '@/lib/storage'
import type { ComboAction, Operator } from '@/types/combo'

import { createEmptyCharacters } from './useComboCharacters'

interface UseComboControlPanelOptions {
  comboName: string
  characters: (Operator | null)[]
  actions: ComboAction[]
  setComboName: (name: string) => void
  setCharacters: (characters: (Operator | null)[]) => void
  setActions: (actions: ComboAction[]) => void
}

export const useComboControlPanel = ({
  comboName,
  characters,
  actions,
  setComboName,
  setCharacters,
  setActions,
}: UseComboControlPanelOptions) => {
  const t = useTranslations()
  const handleSave = () => {
    saveCombo({ name: comboName, characters, actions })
    alert(t('messages.saved'))
  }

  const handleExportImage = async () => {
    try {
      await exportAsImage('combo-timeline', `${comboName}.png`)
      alert(t('messages.exported'))
    } catch {
      alert(t('messages.exportFailed'))
    }
  }

  const handleShare = () => {
    const url = generateShareUrl({ name: comboName, characters, actions })
    navigator.clipboard.writeText(url)
    alert(t('messages.urlCopied'))
  }

  const handleClear = () => {
    if (!confirm(t('dialog.confirmClear'))) return
    setComboName(t('dialog.comboNamePlaceholder'))
    setCharacters(createEmptyCharacters())
    setActions([])
  }

  return {
    handleSave,
    handleExportImage,
    handleShare,
    handleClear,
  }
}
