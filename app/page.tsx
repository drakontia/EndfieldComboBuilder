'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import CharacterSelector from '@/components/CharacterSelector'
import ComboTimeline from '@/components/ComboTimeline'
import ControlPanel from '@/components/ControlPanel'
import LoadDialog from '@/components/LoadDialog'
import ActionEditDialog from '@/components/ActionEditDialog'
import { Character, Action, SkillType, ComboState } from '@/types/combo'
import { saveCombo, getSavedCombos, deleteCombo, generateShareUrl, loadComboFromUrl } from '@/lib/storage'
import { exportAsImage } from '@/lib/export'

export default function Home() {
  const t = useTranslations()
  const [comboName, setComboName] = useState(t('dialog.comboNamePlaceholder'))
  const [characters, setCharacters] = useState<(Character | null)[]>(Array(4).fill(null))
  const [actions, setActions] = useState<Action[]>([])
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [savedCombos, setSavedCombos] = useState<ComboState[]>([])
  const [editingAction, setEditingAction] = useState<Action | null>(null)
  const [showActionEditDialog, setShowActionEditDialog] = useState(false)

  useEffect(() => {
    // Load combo from URL if present
    const comboFromUrl = loadComboFromUrl()
    if (comboFromUrl) {
      loadComboState(comboFromUrl)
    }
  }, [])

  const handleCharacterSelect = (character: Character | null, index: number) => {
    const newCharacters = [...characters]
    newCharacters[index] = character
    setCharacters(newCharacters)
  }

  const handleCharacterReorder = (fromIndex: number, toIndex: number) => {
    const newCharacters = [...characters]
    const [movedChar] = newCharacters.splice(fromIndex, 1)
    newCharacters.splice(toIndex, 0, movedChar)
    setCharacters(newCharacters)
    
    // Update character IDs in actions to maintain associations
    const fromChar = characters[fromIndex]
    const toChar = characters[toIndex]
    if (fromChar) {
      const updatedActions = actions.map(action => {
        if (action.characterId === fromChar.id) {
          return { ...action }
        }
        return action
      })
      setActions(updatedActions)
    }
  }

  const handleAddAction = (characterId: string, type: AttackType, timing: number) => {
    const newAction: Action = {
      id: `${Date.now()}-${Math.random()}`,
      characterId,
      type,
      timing,
      hitCount: type === SkillType.COMBO_SKILL ? 1 : undefined,
    }
    setActions([...actions, newAction])
  }

  const handleRemoveAction = (actionId: string) => {
    setActions(actions.filter(a => a.id !== actionId))
  }

  const handleEditAction = (action: Action) => {
    setEditingAction(action)
    setShowActionEditDialog(true)
  }

  const handleSaveAction = (updatedAction: Action) => {
    setActions(actions.map(a => a.id === updatedAction.id ? updatedAction : a))
  }

  const handleCloseActionEdit = () => {
    setShowActionEditDialog(false)
    setEditingAction(null)
  }

  const handleSave = () => {
    const combo: ComboState = {
      name: comboName,
      characters,
      actions,
    }
    saveCombo(combo)
    alert(t('messages.saved'))
  }

  const handleLoadOpen = () => {
    setSavedCombos(getSavedCombos())
    setShowLoadDialog(true)
  }

  const loadComboState = (combo: ComboState) => {
    setComboName(combo.name)
    setCharacters(combo.characters)
    setActions(combo.actions)
  }

  const handleLoad = (combo: ComboState) => {
    loadComboState(combo)
    alert(t('messages.loaded'))
  }

  const handleDelete = (name: string) => {
    deleteCombo(name)
    setSavedCombos(getSavedCombos())
  }

  const handleExportImage = async () => {
    try {
      await exportAsImage('combo-timeline', `${comboName}.png`)
      alert(t('messages.exported'))
    } catch (error) {
      alert(t('messages.exportFailed'))
    }
  }

  const handleShare = () => {
    const combo: ComboState = {
      name: comboName,
      characters,
      actions,
    }
    const url = generateShareUrl(combo)
    navigator.clipboard.writeText(url)
    alert(t('messages.urlCopied'))
  }

  const handleClear = () => {
    if (confirm(t('dialog.confirmClear'))) {
      setComboName(t('dialog.comboNamePlaceholder'))
      setCharacters(Array(4).fill(null))
      setActions([])
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {t('app.title')}
      </h1>
      
      <ControlPanel
        comboName={comboName}
        onComboNameChange={setComboName}
        onSave={handleSave}
        onLoad={handleLoadOpen}
        onExportImage={handleExportImage}
        onShare={handleShare}
        onClear={handleClear}
      />
      
      <div className="flex gap-4">
        <CharacterSelector
          selectedCharacters={characters}
          onCharacterSelect={handleCharacterSelect}
          onCharacterReorder={handleCharacterReorder}
        />
        
        <div id="combo-timeline" className="flex-1">
          <ComboTimeline
            characters={characters}
            actions={actions}
            onAddAction={handleAddAction}
            onRemoveAction={handleRemoveAction}
            onEditAction={handleEditAction}
          />
        </div>
      </div>
      
      <LoadDialog
        isOpen={showLoadDialog}
        savedCombos={savedCombos}
        onClose={() => setShowLoadDialog(false)}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />
      
      <ActionEditDialog
        isOpen={showActionEditDialog}
        action={editingAction}
        onClose={handleCloseActionEdit}
        onSave={handleSaveAction}
      />
    </main>
  )
}
