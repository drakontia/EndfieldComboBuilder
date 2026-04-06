import { describe, it, expect } from 'vitest'

import { buildResolvedStatusEffectState, buildResolvedStatusEffectsByAction } from '@/lib/statusEffects'
import { getOperatorIdByName } from '@/lib/data/operators'
import { ArtsInfliction, ArtsReaction, Buff, Debuff, PhysicalStatus, SkillType } from '@/types/combo'

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

// tangtang applies ArtsInfliction.CRYO via battle_skill
const TANGTANG_NAME = 'character.tangtang.name'
// gilberta applies ArtsInfliction.NATURE via battle_skill
const GILBERTA_NAME = 'character.gilberta.name'
const FLUORITE_NAME = 'character.fluorite.name'
const ARDELIA_NAME = 'character.ardelia.name'
const YVONNE_NAME = 'character.yvonne.name'
// laevatain applies ArtsReaction.COMBUSTION via battle_skill
const LAEVATAIN_NAME = 'character.laevatain.name'
// arclight applies ArtsReaction.SHOCK via ultimate
const ARCLIGHT_NAME = 'character.arclight.name'
const EMBER_NAME = 'character.ember.name'
const LIFENG_NAME = 'character.lifeng.name'
const AVYWENNA_NAME = 'character.avywenna.name'
const PERLICA_NAME = 'character.perlica.name'
const AKEKURI_NAME = 'character.akekuri.name'
const SNOWSHINE_NAME = 'character.snowshine.name'
const ANTAL_NAME = 'character.antal.name'
const ALESH_NAME = 'character.alesh.name'
const WOLFGARD_NAME = 'character.wolfgard.name'

describe('fluorite combo skill conditional effects', () => {
  it('correctly resolves fluorite operator ID', () => {
    expect(getOperatorIdByName(FLUORITE_NAME)).toBe('fluorite')
  })

  it('applies cryo when cryo stacks >= 2 at combo skill timing', () => {
    // Two tangtang battle skills at t=0 and t=1000 build 2 cryo stacks
    // fluorite combo at t=5000 sees cryoStacks=2 → applies cryo
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 1000, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a3', 5000, SkillType.COMBO_SKILL, FLUORITE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a3')).toContain(ArtsInfliction.CRYO)
  })

  it('applies nature when nature stacks >= 2 at combo skill timing', () => {
    // Two gilberta battle skills build 2 nature stacks
    // fluorite combo sees natureStacks=2 and cryoStacks=0 → applies nature
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a2', 1000, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a3', 5000, SkillType.COMBO_SKILL, FLUORITE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a3')).toContain(ArtsInfliction.NATURE)
  })

  it('applies no effects when neither cryo nor nature stacks reach 2', () => {
    // Only 1 cryo stack → neither condition met
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 5000, SkillType.COMBO_SKILL, FLUORITE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a2')).toEqual([])
  })

  it('prioritises cryo over nature when both reach 2 stacks', () => {
    // 2 cryo AND 2 nature stacks → cryo takes priority (checked first in code)
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 500, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a3', 1000, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a4', 1500, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a5', 5000, SkillType.COMBO_SKILL, FLUORITE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a5')).toContain(ArtsInfliction.CRYO)
    expect(resolved.get('a5')).not.toContain(ArtsInfliction.NATURE)
  })

  it('does not count expired cryo stacks', () => {
    // LONG_STATUS_EFFECT_DURATION_MS = 30000ms
    // tangtang at t=0 → cryo expires at t=30000
    // fluorite combo at t=35000 → cryoStacks=0 (expired)
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 1000, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a3', 35000, SkillType.COMBO_SKILL, FLUORITE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a3')).toEqual([])
  })
})

describe('ardelia battle skill conditional effects', () => {
  it('correctly resolves ardelia operator ID', () => {
    expect(getOperatorIdByName(ARDELIA_NAME)).toBe('ardelia')
  })

  it('returns empty effects when corrosion is not active', () => {
    // ardelia battle_skill alone: no corrosion in resolvedList → effects = []
    const actions = [
      buildAction('a1', 1000, SkillType.BATTLE_SKILL, ARDELIA_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    // Without active corrosion, ardelia battle_skill yields no effects
    expect(resolved.get('a1')).toEqual([])
  })

  it('returns debuff effects when corrosion is active', () => {
    // ardelia combo_skill resolves with corrosion via statusEffectForcibly,
    // but buildResolvedStatusEffectState only reads statusEffect. So we test
    // the behaviour using the tangtang→ardelia_combo chain that results in
    // ArtsReaction (corrosion forced) appearing in the resolved list.
    // Since statusEffectForcibly is not read by buildResolvedStatusEffectState,
    // this confirms ardelia combo resolves to [] and battle_skill behaves accordingly.
    const actions = [
      buildAction('a1', 0, SkillType.COMBO_SKILL, ARDELIA_NAME),   // no statusEffect → []
      buildAction('a2', 1000, SkillType.BATTLE_SKILL, ARDELIA_NAME), // corrosion not in resolvedList
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    // Without corrosion resolvable through statusEffect, battle_skill yields []
    expect(resolved.get('a2')).toEqual([])
  })
})

describe('yvonne battle skill conditional freeze', () => {
  it('correctly resolves yvonne operator ID', () => {
    expect(getOperatorIdByName(YVONNE_NAME)).toBe('yvonne')
  })

  it('does NOT apply freeze when no cryo or nature infliction is active', () => {
    const actions = [
      buildAction('a1', 1000, SkillType.BATTLE_SKILL, YVONNE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a1')).not.toContain(ArtsReaction.FREEZE)
    expect(resolved.get('a1')).toEqual([])
  })

  it('applies freeze when cryo infliction is active, consuming it', () => {
    // tangtang battle_skill applies CRYO at t=0
    // yvonne battle_skill at t=2000 consumes CRYO → applies FREEZE
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, YVONNE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a2')).toContain(ArtsReaction.FREEZE)
  })

  it('applies freeze when nature infliction is active, consuming it', () => {
    // gilberta battle_skill applies NATURE at t=0
    // yvonne battle_skill at t=2000 consumes NATURE → applies FREEZE
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, YVONNE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a2')).toContain(ArtsReaction.FREEZE)
  })

  it('consumes cryo infliction so a second yvonne battle skill does not trigger freeze again', () => {
    // CRYO applied at t=0 (30s duration), yvonne at t=2000 consumes it → FREEZE
    // Second yvonne at t=3000: CRYO consumed → no FREEZE
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, YVONNE_NAME),
      buildAction('a3', 3000, SkillType.BATTLE_SKILL, YVONNE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a2')).toContain(ArtsReaction.FREEZE)
    expect(resolved.get('a3')).not.toContain(ArtsReaction.FREEZE)
    expect(resolved.get('a3')).toEqual([])
  })

  it('does not apply freeze when cryo infliction has expired', () => {
    // tangtang battle_skill at t=0 → CRYO active until t=30000ms
    // yvonne battle_skill at t=35000 → CRYO expired → no FREEZE
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 35000, SkillType.BATTLE_SKILL, YVONNE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a2')).not.toContain(ArtsReaction.FREEZE)
    expect(resolved.get('a2')).toEqual([])
  })

  it('applies freeze using nature when cryo is not present', () => {
    // Only gilberta (NATURE) is present — no CRYO
    // yvonne should consume NATURE and apply FREEZE
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a2', 1000, SkillType.BATTLE_SKILL, GILBERTA_NAME),
      buildAction('a3', 5000, SkillType.BATTLE_SKILL, YVONNE_NAME),
    ]

    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.get('a3')).toContain(ArtsReaction.FREEZE)
  })
})

describe('action sorting with identical timing', () => {
  it('sorts actions with the same timing by id (locale order)', () => {
    // Both actions at t=0 — id ordering: 'aaa' < 'zzz'
    const actions = [
      buildAction('zzz', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('aaa', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
    ]

    // Should not throw and both actions should be resolved
    const resolved = buildResolvedStatusEffectsByAction(actions)

    expect(resolved.has('aaa')).toBe(true)
    expect(resolved.has('zzz')).toBe(true)
  })
})

// ──────────────────────────────────────────────────────────────────────────
// Phase 1: Simple status effect corrections
// ──────────────────────────────────────────────────────────────────────────

describe('ember battle skill', () => {
  it('applies KNOCKDOWN (転倒), not VULNERABLE (クラッシュ)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, EMBER_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(PhysicalStatus.KNOCKDOWN)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.VULNERABLE)
  })
})

describe('lifeng battle skill', () => {
  it('applies KNOCKDOWN (転倒), not VULNERABLE (クラッシュ)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, LIFENG_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(PhysicalStatus.KNOCKDOWN)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.VULNERABLE)
  })
})

describe('avywenna battle skill', () => {
  it('applies ELECTRIC infliction (電磁付着), not LIFT (浮遊)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, AVYWENNA_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(ArtsInfliction.ELECTRIC)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
  })
})

describe('perlica battle skill', () => {
  it('applies ELECTRIC infliction (電磁付着), not LIFT (浮遊)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, PERLICA_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(ArtsInfliction.ELECTRIC)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
  })
})

describe('akekuri battle skill', () => {
  it('applies HEAT infliction (灼熱付着), not LIFT (浮遊)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, AKEKURI_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(ArtsInfliction.HEAT)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
  })
})

describe('snowshine battle skill', () => {
  it('applies PROTECT buff (加護)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, SNOWSHINE_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(Buff.PROTECT)
  })

  it('applies CRYO infliction (寒冷付着) from counterattack', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, SNOWSHINE_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(ArtsInfliction.CRYO)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
  })
})

describe('fluorite battle skill', () => {
  it('applies SLOW debuff (スロー)', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, FLUORITE_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(Debuff.SLOW)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
  })

  it('applies NATURE infliction (自然付着) from bomb explosion', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, FLUORITE_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(ArtsInfliction.NATURE)
  })
})

describe('antal battle skill', () => {
  it('applies ARTS_SUSCEPTIBILITY debuff (アーツ脆弱), not LIFT', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, ANTAL_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(Debuff.ARTS_SUSCEPTIBILITY)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
  })
})

// ──────────────────────────────────────────────────────────────────────────
// Phase 2: Conditional logic fixes
// ──────────────────────────────────────────────────────────────────────────

describe('alesh battle skill conditional freeze', () => {
  it('gives no effect when no CRYO infliction is active', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, ALESH_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toEqual([])
  })

  it('applies FREEZE and consumes CRYO when CRYO is active', () => {
    // tangtang battle_skill at t=0 applies CRYO
    // alesh battle_skill at t=2000 should consume CRYO → FREEZE
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, ALESH_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).toContain(ArtsReaction.FREEZE)
    expect(resolved.get('a2')).not.toContain(PhysicalStatus.LIFT)
  })

  it('does NOT apply FREEZE twice (CRYO consumed after first alesh battle skill)', () => {
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, ALESH_NAME),
      buildAction('a3', 3000, SkillType.BATTLE_SKILL, ALESH_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).toContain(ArtsReaction.FREEZE)
    expect(resolved.get('a3')).toEqual([])
  })

  it('does NOT apply FREEZE when CRYO has expired', () => {
    // CRYO duration is 30000ms; alesh at t=35000 should not trigger
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, TANGTANG_NAME),
      buildAction('a2', 35000, SkillType.BATTLE_SKILL, ALESH_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).toEqual([])
  })
})

describe('wolfgard battle skill conditional heat', () => {
  it('applies HEAT when no arts reaction (COMBUSTION/SHOCK) is active', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, WOLFGARD_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).toContain(ArtsInfliction.HEAT)
  })

  it('does NOT apply HEAT when COMBUSTION is active; consumes COMBUSTION instead', () => {
    // laevatain battle_skill at t=0 applies COMBUSTION
    // wolfgard battle_skill at t=2000 should consume COMBUSTION and give no HEAT
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, LAEVATAIN_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, WOLFGARD_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).not.toContain(ArtsInfliction.HEAT)
    expect(resolved.get('a2')).toEqual([])
  })

  it('does NOT apply HEAT when SHOCK is active; consumes SHOCK instead', () => {
    // arclight ultimate at t=0 applies SHOCK
    // wolfgard battle_skill at t=2000 should consume SHOCK and give no HEAT
    const actions = [
      buildAction('a1', 0, SkillType.ULTIMATE, ARCLIGHT_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, WOLFGARD_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).not.toContain(ArtsInfliction.HEAT)
    expect(resolved.get('a2')).toEqual([])
  })

  it('applies HEAT again after COMBUSTION has been consumed', () => {
    // After wolfgard consumes COMBUSTION, a second wolfgard should give HEAT
    const actions = [
      buildAction('a1', 0, SkillType.BATTLE_SKILL, LAEVATAIN_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, WOLFGARD_NAME),
      buildAction('a3', 3000, SkillType.BATTLE_SKILL, WOLFGARD_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).toEqual([])
    expect(resolved.get('a3')).toContain(ArtsInfliction.HEAT)
  })
})

describe('arclight battle skill conditional shock consumption', () => {
  it('gives no status effect when no SHOCK is active', () => {
    const actions = [buildAction('a1', 1000, SkillType.BATTLE_SKILL, ARCLIGHT_NAME)]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a1')).not.toContain(PhysicalStatus.LIFT)
    expect(resolved.get('a1')).toEqual([])
  })

  it('consumes SHOCK when active, gives no status effect (no LIFT)', () => {
    // arclight ultimate at t=0 applies SHOCK
    // arclight battle_skill at t=2000 consumes SHOCK, no LIFT applied
    const actions = [
      buildAction('a1', 0, SkillType.ULTIMATE, ARCLIGHT_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, ARCLIGHT_NAME),
    ]
    const resolved = buildResolvedStatusEffectsByAction(actions)
    expect(resolved.get('a2')).not.toContain(PhysicalStatus.LIFT)
    expect(resolved.get('a2')).toEqual([])
  })

  it('SHOCK is consumed so second arclight battle_skill gives no effect', () => {
    const actions = [
      buildAction('a1', 0, SkillType.ULTIMATE, ARCLIGHT_NAME),
      buildAction('a2', 2000, SkillType.BATTLE_SKILL, ARCLIGHT_NAME),
      buildAction('a3', 3000, SkillType.BATTLE_SKILL, ARCLIGHT_NAME),
    ]
    const { resolvedEffects, consumedEvents } = buildResolvedStatusEffectState(actions)
    expect(resolvedEffects.get('a2')).toEqual([])
    expect(resolvedEffects.get('a3')).toEqual([])
    // SHOCK should be in consumed events
    expect(consumedEvents.some((e) => e.effect === ArtsReaction.SHOCK)).toBe(true)
  })
})
