import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { deleteCombo, getSavedCombos } from '@/lib/storage'
import type { ComboState } from '@/types/combo'

interface UseComboLoadDialogOptions {
  loadComboState: (combo: ComboState) => void
}

export const useComboLoadDialog = ({ loadComboState }: UseComboLoadDialogOptions) => {
  const t = useTranslations()
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [savedCombos, setSavedCombos] = useState<ComboState[]>([])

  const handleLoadOpen = () => {
    setSavedCombos(getSavedCombos())
    setShowLoadDialog(true)
  }

  const handleLoad = (combo: ComboState) => {
    loadComboState(combo)
    alert(t('messages.loaded'))
  }

  const handleDelete = (name: string) => {
    deleteCombo(name)
    setSavedCombos(getSavedCombos())
  }

  const onCloseLoadDialog = () => setShowLoadDialog(false)

  return {
    showLoadDialog,
    savedCombos,
    handleLoadOpen,
    handleLoad,
    handleDelete,
    onCloseLoadDialog,
  }
}
