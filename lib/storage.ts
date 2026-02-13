import { ComboState } from '@/types/combo'

const STORAGE_KEY = 'endfield-combo-builder'

export const saveCombo = (combo: ComboState): void => {
  try {
    const savedCombos = getSavedCombos()
    const existingIndex = savedCombos.findIndex(c => c.name === combo.name)
    
    if (existingIndex >= 0) {
      savedCombos[existingIndex] = combo
    } else {
      savedCombos.push(combo)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCombos))
  } catch (error) {
    console.error('Failed to save combo:', error)
  }
}

export const loadCombo = (name: string): ComboState | null => {
  try {
    const savedCombos = getSavedCombos()
    return savedCombos.find(c => c.name === name) || null
  } catch (error) {
    console.error('Failed to load combo:', error)
    return null
  }
}

export const getSavedCombos = (): ComboState[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to get saved combos:', error)
    return []
  }
}

export const deleteCombo = (name: string): void => {
  try {
    const savedCombos = getSavedCombos()
    const filtered = savedCombos.filter(c => c.name !== name)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete combo:', error)
  }
}

export const exportComboAsJson = (combo: ComboState): void => {
  const dataStr = JSON.stringify(combo, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `${combo.name || 'combo'}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const generateShareUrl = (combo: ComboState): string => {
  const compressed = btoa(JSON.stringify(combo))
  return `${window.location.origin}${window.location.pathname}?combo=${compressed}`
}

export const loadComboFromUrl = (): ComboState | null => {
  try {
    const params = new URLSearchParams(window.location.search)
    const comboData = params.get('combo')
    
    if (!comboData) return null
    
    const decoded = atob(comboData)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to load combo from URL:', error)
    return null
  }
}
