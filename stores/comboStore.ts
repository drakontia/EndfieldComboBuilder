import { create } from 'zustand'
import { SkillType } from '@/types/combo'
import type { ComboAction, ComboState, Operator } from '@/types/combo'

interface ComboStore {
  // State
  comboName: string
  characters: (Operator | null)[]
  actions: ComboAction[]
  
  // Actions
  setComboName: (name: string) => void
  setCharacters: (characters: (Operator | null)[] | ((prev: (Operator | null)[]) => (Operator | null)[])) => void
  setActions: (actions: ComboAction[] | ((prev: ComboAction[]) => ComboAction[])) => void
  setCharacter: (character: Operator | null, index: number) => void
  reorderCharacters: (fromIndex: number, toIndex: number) => void
  addAction: (characterId: string, type: SkillType, timing: number) => void
  removeAction: (actionId: string) => void
  updateAction: (action: ComboAction) => void
  clearCombo: () => void
  loadCombo: (combo: ComboState) => void
  getComboState: () => ComboState
}

export const useComboStore = create<ComboStore>((set, get) => ({
  // Initial state
  comboName: '',
  characters: Array(4).fill(null),
  actions: [],
  
  // Actions
  setComboName: (name) => set({ comboName: name }),
  
  setCharacters: (characters) => set((state) => ({
    characters: typeof characters === 'function' ? characters(state.characters) : characters,
  })),

  setActions: (actions) => set((state) => ({
    actions: typeof actions === 'function' ? actions(state.actions) : actions,
  })),
  
  setCharacter: (character, index) => set((state) => {
    const newCharacters = [...state.characters]
    newCharacters[index] = character
    return { characters: newCharacters }
  }),
  
  reorderCharacters: (fromIndex, toIndex) => set((state) => {
    const newCharacters = [...state.characters]
    const [movedChar] = newCharacters.splice(fromIndex, 1)
    newCharacters.splice(toIndex, 0, movedChar)
    return { characters: newCharacters }
  }),
  
  addAction: (characterId, type, timing) => set((state) => {
    const newAction: ComboAction = {
      id: `${Date.now()}-${Math.random()}`,
      characterId,
      type,
      timing,
    }
    return { actions: [...state.actions, newAction] }
  }),
  
  removeAction: (actionId) => set((state) => ({
    actions: state.actions.filter(a => a.id !== actionId)
  })),
  
  updateAction: (updatedAction) => set((state) => ({
    actions: state.actions.map(a => a.id === updatedAction.id ? updatedAction : a)
  })),
  
  clearCombo: () => set({
    comboName: '',
    characters: Array(4).fill(null),
    actions: []
  }),
  
  loadCombo: (combo) => set({
    comboName: combo.name,
    characters: combo.characters,
    actions: combo.actions
  }),
  
  getComboState: () => {
    const state = get()
    return {
      name: state.comboName,
      characters: state.characters,
      actions: state.actions
    }
  }
}))
