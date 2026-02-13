import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveCombo, loadCombo, getSavedCombos, deleteCombo, generateShareUrl, loadComboFromUrl } from '@/lib/storage'
import { ComboState, AttackType } from '@/types/combo'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

describe('Storage Functions', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  const mockCombo: ComboState = {
    name: 'Test Combo',
    characters: [
      { id: '1', name: 'Character 1' },
      { id: '2', name: 'Character 2' },
    ],
    actions: [
      {
        id: '1',
        characterId: '1',
        type: AttackType.NORMAL,
        timing: 1000,
        hitCount: 1,
      },
      {
        id: '2',
        characterId: '2',
        type: AttackType.BATTLE_SKILL,
        timing: 2000,
      },
    ],
  }

  describe('saveCombo', () => {
    it('should save a combo to localStorage', () => {
      saveCombo(mockCombo)
      const saved = getSavedCombos()
      expect(saved).toHaveLength(1)
      expect(saved[0].name).toBe('Test Combo')
    })

    it('should update existing combo with same name', () => {
      saveCombo(mockCombo)
      const updatedCombo = { ...mockCombo, actions: [] }
      saveCombo(updatedCombo)
      const saved = getSavedCombos()
      expect(saved).toHaveLength(1)
      expect(saved[0].actions).toHaveLength(0)
    })
  })

  describe('loadCombo', () => {
    it('should load a combo by name', () => {
      saveCombo(mockCombo)
      const loaded = loadCombo('Test Combo')
      expect(loaded).not.toBeNull()
      expect(loaded?.name).toBe('Test Combo')
      expect(loaded?.characters).toHaveLength(2)
    })

    it('should return null for non-existent combo', () => {
      const loaded = loadCombo('Non-existent')
      expect(loaded).toBeNull()
    })
  })

  describe('deleteCombo', () => {
    it('should delete a combo by name', () => {
      saveCombo(mockCombo)
      expect(getSavedCombos()).toHaveLength(1)
      deleteCombo('Test Combo')
      expect(getSavedCombos()).toHaveLength(0)
    })
  })

  describe('getSavedCombos', () => {
    it('should return empty array when no combos saved', () => {
      expect(getSavedCombos()).toEqual([])
    })

    it('should return all saved combos', () => {
      saveCombo(mockCombo)
      saveCombo({ ...mockCombo, name: 'Another Combo' })
      expect(getSavedCombos()).toHaveLength(2)
    })
  })

  describe('generateShareUrl', () => {
    it('should generate a URL with encoded combo data', () => {
      vi.stubGlobal('window', {
        location: {
          origin: 'http://localhost:3000',
          pathname: '/',
        },
      })

      const url = generateShareUrl(mockCombo)
      expect(url).toContain('http://localhost:3000')
      expect(url).toContain('?combo=')
    })
  })

  describe('loadComboFromUrl', () => {
    it('should load combo from URL parameters', () => {
      const encoded = btoa(JSON.stringify(mockCombo))
      vi.stubGlobal('window', {
        location: {
          search: `?combo=${encoded}`,
        },
      })

      const loaded = loadComboFromUrl()
      expect(loaded).not.toBeNull()
      expect(loaded?.name).toBe('Test Combo')
    })

    it('should return null when no combo in URL', () => {
      vi.stubGlobal('window', {
        location: {
          search: '',
        },
      })

      const loaded = loadComboFromUrl()
      expect(loaded).toBeNull()
    })
  })
})
