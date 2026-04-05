import { describe, it, expect } from 'vitest'

import { buildResolvedStatusEffectState, buildResolvedStatusEffectsByAction } from '@/lib/statusEffects'
import { getOperatorIdByName } from '@/lib/data/operators'
import { ArtsInfliction, Buff, SkillType } from '@/types/combo'

// Character names (i18n keys) matching the OPERATORS data structure
const LAST_RITE_NAME = 'character.last_rite.name'

const buildAction = (
  id: string,
  timing: number,
  type: SkillType,
  characterId: string = 'character.endministrator.name'
) => ({
  id,
  timing,
  type,
  characterId,
})

describe('Last Rite cold infusion', () => {
  it('should correctly resolve operator ID from Last Rite character name', () => {
    const operatorId = getOperatorIdByName(LAST_RITE_NAME)
    expect(operatorId).toBe('last_rite')
  })

  it('should apply cryo attachment when Last Rite uses normal attack with COLD_INFUSION active', () => {
    // Setup: Last Rite uses battle skill (applies COLD_INFUSION buff)
    // Then uses normal attack within the 30-second window
    const actions = [
      buildAction('action1', 1000, SkillType.BATTLE_SKILL, LAST_RITE_NAME), // Applies COLD_INFUSION
      buildAction('action2', 5000, SkillType.NORMAL, LAST_RITE_NAME), // Normal attack while COLD_INFUSION active
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    // Check that the normal attack at 5000ms has cryo attachment
    const normalAttackEffects = resolved.get('action2') ?? []
    expect(normalAttackEffects).toContain(ArtsInfliction.CRYO)
  })

  it('should not apply cryo when COLD_INFUSION is not active', () => {
    const actions = [
      buildAction('action1', 1000, SkillType.NORMAL, LAST_RITE_NAME), // Normal attack without COLD_INFUSION
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    const normalAttackEffects = resolved.get('action1') ?? []
    expect(normalAttackEffects).not.toContain(ArtsInfliction.CRYO)
  })

  it('should apply COLD_INFUSION buff from Last Rite battle skill', () => {
    const actions = [
      buildAction('action1', 1000, SkillType.BATTLE_SKILL, LAST_RITE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    const battleSkillEffects = resolved.get('action1') ?? []
    expect(battleSkillEffects).toContain(Buff.COLD_INFUSION)
  })

  it('should have cryo stacked when multiple normal attacks are used within COLD_INFUSION window', () => {
    // Setup: Multiple normal attacks apply cryo
    const actions = [
      buildAction('action1', 1000, SkillType.BATTLE_SKILL, LAST_RITE_NAME), // Applies COLD_INFUSION
      buildAction('action2', 2000, SkillType.NORMAL, LAST_RITE_NAME), // +1 cryo
      buildAction('action3', 3000, SkillType.NORMAL, LAST_RITE_NAME), // +1 cryo
      buildAction('action4', 4000, SkillType.NORMAL, LAST_RITE_NAME), // +1 cryo
      buildAction('action5', 5000, SkillType.NORMAL, LAST_RITE_NAME), // +1 cryo (total 4)
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    // All normal attacks should have cryo
    const effects2 = resolved.get('action2') ?? []
    const effects3 = resolved.get('action3') ?? []
    const effects4 = resolved.get('action4') ?? []
    const effects5 = resolved.get('action5') ?? []

    expect(effects2).toContain(ArtsInfliction.CRYO)
    expect(effects3).toContain(ArtsInfliction.CRYO)
    expect(effects4).toContain(ArtsInfliction.CRYO)
    expect(effects5).toContain(ArtsInfliction.CRYO)
  })

  it('should expire COLD_INFUSION buff after 30 seconds', () => {
    const actions = [
      buildAction('action1', 0, SkillType.BATTLE_SKILL, LAST_RITE_NAME), // Applies COLD_INFUSION (duration 30000ms)
      buildAction('action2', 25000, SkillType.NORMAL, LAST_RITE_NAME), // Within 30s, should have cryo
      buildAction('action3', 35000, SkillType.NORMAL, LAST_RITE_NAME), // After 30s, no cryo
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    // At 25000ms, COLD_INFUSION should still be active
    const action2Effects = resolved.get('action2') ?? []
    expect(action2Effects).toContain(ArtsInfliction.CRYO)

    // At 35000ms, COLD_INFUSION should have expired
    const action3Effects = resolved.get('action3') ?? []
    expect(action3Effects).not.toContain(ArtsInfliction.CRYO)
  })

  it('should handle multiple Last Rite battle skills', () => {
    const actions = [
      buildAction('action1', 1000, SkillType.BATTLE_SKILL, LAST_RITE_NAME), // First COLD_INFUSION
      buildAction('action2', 2000, SkillType.NORMAL, LAST_RITE_NAME), // Normal attack with first buff
      buildAction('action3', 35000, SkillType.BATTLE_SKILL, LAST_RITE_NAME), // Second COLD_INFUSION
      buildAction('action4', 36000, SkillType.NORMAL, LAST_RITE_NAME), // Normal attack with second buff
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    // Both battle skills should have COLD_INFUSION
    const battleSkillEffects1 = resolved.get('action1') ?? []
    const battleSkillEffects3 = resolved.get('action3') ?? []
    expect(battleSkillEffects1).toContain(Buff.COLD_INFUSION)
    expect(battleSkillEffects3).toContain(Buff.COLD_INFUSION)

    // Both normal attacks should have cryo
    const normalAttackEffects2 = resolved.get('action2') ?? []
    const normalAttackEffects4 = resolved.get('action4') ?? []
    expect(normalAttackEffects2).toContain(ArtsInfliction.CRYO)
    expect(normalAttackEffects4).toContain(ArtsInfliction.CRYO)
  })

  it('should preserve buffed status with buildResolvedStatusEffectState', () => {
    const actions = [
      buildAction('action1', 1000, SkillType.BATTLE_SKILL, LAST_RITE_NAME),
      buildAction('action2', 5000, SkillType.NORMAL, LAST_RITE_NAME),
    ]

    const { resolvedEffects } = buildResolvedStatusEffectState(actions)

    // Verify the detailed state object
    const action2Effects = resolvedEffects.get('action2') ?? []
    expect(action2Effects).toContain(ArtsInfliction.CRYO)
  })
})
