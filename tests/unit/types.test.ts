import { describe, it, expect } from 'vitest'
import { AttackType, StatusEffect } from '@/types/combo'

describe('Combo Types', () => {
  describe('AttackType', () => {
    it('should have all attack types defined', () => {
      expect(AttackType.NORMAL).toBe('normal')
      expect(AttackType.BATTLE_SKILL).toBe('battleSkill')
      expect(AttackType.SYNERGY_SKILL).toBe('synergySkill')
      expect(AttackType.ULTIMATE).toBe('ultimate')
    })
  })

  describe('StatusEffect', () => {
    it('should have all status effects defined', () => {
      expect(StatusEffect.BURN).toBe('burn')
      expect(StatusEffect.FREEZE).toBe('freeze')
      expect(StatusEffect.SHOCK).toBe('shock')
      expect(StatusEffect.POISON).toBe('poison')
      expect(StatusEffect.STUN).toBe('stun')
      expect(StatusEffect.WEAKNESS).toBe('weakness')
    })
  })
})
