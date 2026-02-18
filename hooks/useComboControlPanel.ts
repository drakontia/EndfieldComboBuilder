import { useTranslations } from 'next-intl'

import { exportAsImage } from '@/lib/export'
import { generateShareUrl, saveCombo } from '@/lib/storage'
import { INITIAL_TEAM_SP, TIMELINE_DURATION } from '@/lib/timeline'
import type { ComboAction, Operator } from '@/types/combo'

import { createEmptyCharacters } from './useComboCharacters'

interface UseComboControlPanelOptions {
  comboName: string
  characters: (Operator | null)[]
  actions: ComboAction[]
  timelineDurationMs: number
  initialTeamSp: number
  initialUltimateCharges: number[]
  setComboName: (name: string) => void
  setCharacters: (characters: (Operator | null)[]) => void
  setActions: (actions: ComboAction[]) => void
  setTimelineDurationMs: (durationMs: number) => void
  setInitialTeamSp: (value: number) => void
  setInitialUltimateCharges: (charges: number[]) => void
}

export const useComboControlPanel = ({
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
}: UseComboControlPanelOptions) => {
  const t = useTranslations()
  const handleSave = () => {
    saveCombo({
      name: comboName,
      characters,
      actions,
      timelineDurationMs,
      initialTeamSp,
      initialUltimateCharges,
    })
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
    const url = generateShareUrl({
      name: comboName,
      characters,
      actions,
      timelineDurationMs,
      initialTeamSp,
      initialUltimateCharges,
    })
    navigator.clipboard.writeText(url)
    alert(t('messages.urlCopied'))
  }

  const handleClear = () => {
    if (!confirm(t('dialog.confirmClear'))) return
    setComboName(t('dialog.comboNamePlaceholder'))
    setCharacters(createEmptyCharacters())
    setActions([])
    setTimelineDurationMs(TIMELINE_DURATION)
    setInitialTeamSp(INITIAL_TEAM_SP)
    setInitialUltimateCharges(Array(4).fill(0))
  }

  return {
    handleSave,
    handleExportImage,
    handleShare,
    handleClear,
  }
}
