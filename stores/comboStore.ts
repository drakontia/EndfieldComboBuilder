import { create } from 'zustand'
import { SkillType } from '@/types/combo'
import {
  INITIAL_TEAM_SP,
  MAX_TEAM_SP,
  MAX_TIMELINE_DURATION,
  MIN_TIMELINE_DURATION,
  TIMELINE_DURATION,
} from '@/lib/timeline'
import type { ComboAction, ComboState, Operator } from '@/types/combo'

interface ComboStore {
  // State
  comboName: string
  characters: (Operator | null)[]
  actions: ComboAction[]
  timelineDurationMs: number
  initialTeamSp: number
  initialUltimateCharges: number[]
  
  // Actions
  setComboName: (name: string) => void
  setCharacters: (characters: (Operator | null)[] | ((prev: (Operator | null)[]) => (Operator | null)[])) => void
  setActions: (actions: ComboAction[] | ((prev: ComboAction[]) => ComboAction[])) => void
  setTimelineDurationMs: (durationMs: number) => void
  setInitialTeamSp: (value: number) => void
  setInitialUltimateCharges: (charges: number[] | ((prev: number[]) => number[])) => void
  setInitialUltimateCharge: (index: number, value: number) => void
  setCharacter: (character: Operator | null, index: number) => void
  reorderCharacters: (fromIndex: number, toIndex: number) => void
  addAction: (characterId: string, type: SkillType, timing: number) => void
  removeAction: (actionId: string) => void
  updateAction: (action: ComboAction) => void
  clearCombo: () => void
  loadCombo: (combo: ComboState) => void
  getComboState: () => ComboState
}

const normalizeUltimateCharges = (charges: number[], length: number) => {
  return Array.from({ length }, (_, index) => {
    const value = charges[index] ?? 0
    return Math.min(100, Math.max(0, Math.round(value)))
  })
}

export const useComboStore = create<ComboStore>((set, get) => ({
  // Initial state
  comboName: '',
  characters: Array(4).fill(null),
  actions: [],
  timelineDurationMs: TIMELINE_DURATION,
  initialTeamSp: INITIAL_TEAM_SP,
  initialUltimateCharges: Array(4).fill(0),
  
  // Actions
  setComboName: (name) => set({ comboName: name }),
  
  setCharacters: (characters) => set((state) => ({
    characters: typeof characters === 'function' ? characters(state.characters) : characters,
  })),

  setActions: (actions) => set((state) => ({
    actions: typeof actions === 'function' ? actions(state.actions) : actions,
  })),

  setTimelineDurationMs: (durationMs) => set({
    timelineDurationMs: Math.min(MAX_TIMELINE_DURATION, Math.max(MIN_TIMELINE_DURATION, durationMs)),
  }),

  setInitialTeamSp: (value) => set({
    initialTeamSp: Math.min(MAX_TEAM_SP, Math.max(0, Math.round(value))),
  }),

  setInitialUltimateCharges: (charges) => set((state) => ({
    initialUltimateCharges: normalizeUltimateCharges(
      typeof charges === 'function' ? charges(state.initialUltimateCharges) : charges,
      state.characters.length
    ),
  })),

  setInitialUltimateCharge: (index, value) => set((state) => {
    const next = [...state.initialUltimateCharges]
    next[index] = value
    return { initialUltimateCharges: normalizeUltimateCharges(next, state.characters.length) }
  }),
  
  setCharacter: (character, index) => set((state) => {
    const newCharacters = [...state.characters]
    newCharacters[index] = character
    return { characters: newCharacters }
  }),
  
  reorderCharacters: (fromIndex, toIndex) => set((state) => {
    const newCharacters = [...state.characters]
    const [movedChar] = newCharacters.splice(fromIndex, 1)
    newCharacters.splice(toIndex, 0, movedChar)
    const newCharges = [...state.initialUltimateCharges]
    const [movedCharge] = newCharges.splice(fromIndex, 1)
    newCharges.splice(toIndex, 0, movedCharge ?? 0)
    return { characters: newCharacters, initialUltimateCharges: normalizeUltimateCharges(newCharges, newCharacters.length) }
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
    actions: [],
    timelineDurationMs: TIMELINE_DURATION,
    initialTeamSp: INITIAL_TEAM_SP,
    initialUltimateCharges: Array(4).fill(0),
  }),
  
  loadCombo: (combo) => set({
    comboName: combo.name,
    characters: combo.characters,
    actions: combo.actions,
    timelineDurationMs: combo.timelineDurationMs ?? TIMELINE_DURATION,
    initialTeamSp: combo.initialTeamSp ?? INITIAL_TEAM_SP,
    initialUltimateCharges: normalizeUltimateCharges(combo.initialUltimateCharges ?? [], combo.characters.length),
  }),
  
  getComboState: () => {
    const state = get()
    return {
      name: state.comboName,
      characters: state.characters,
      actions: state.actions,
      timelineDurationMs: state.timelineDurationMs,
      initialTeamSp: state.initialTeamSp,
      initialUltimateCharges: state.initialUltimateCharges,
    }
  }
}))
