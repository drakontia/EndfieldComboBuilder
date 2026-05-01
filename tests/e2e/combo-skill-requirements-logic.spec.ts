import { test, expect } from '@playwright/test'
import type { ComboAction } from '@/types/combo'
import { SkillType } from '@/types/combo'

/**
 * 連携技の発動条件データ定義の検証テスト
 * 
 * 各キャラクターの連携技発動条件が正しく定義されているかを確認します。
 * これらのテストは実装されたロジック（comboRequirements.ts）が
 * 正しいデータで動作することを保証します。
 */
test.describe('Combo Skill Requirements - Data Verification', () => {
  test('レーヴァテインの連携技: 燃焼または腐食が必要', async () => {
    // comboRequirements.tsのロジックを直接インポートしてテスト
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const laevatainCombo = COMBO_SKILLS['laevatain_combo_skill']
    
    expect(laevatainCombo).toBeDefined()
    expect(laevatainCombo.operatorId).toBe('laevatain')
    expect(laevatainCombo.requirement).toBeDefined()
    expect(laevatainCombo.requirement.statusEffects).toBeDefined()
    expect(laevatainCombo.requirement.statusEffects).toContain('combustion')
    expect(laevatainCombo.requirement.statusEffects).toContain('corrosion')
  })

  test('イヴォンヌの連携技: 凍結が必要', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const yvonneCombo = COMBO_SKILLS['yvonne_combo_skill']
    
    expect(yvonneCombo).toBeDefined()
    expect(yvonneCombo.operatorId).toBe('yvonne')
    expect(yvonneCombo.requirement.statusEffects).toContain('freeze')
  })

  test('エンドミニストラの連携技: ステータス効果の条件なし', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const endministratorCombo = COMBO_SKILLS['endministrator_combo_skill']
    
    expect(endministratorCombo).toBeDefined()
    expect(endministratorCombo.operatorId).toBe('endministrator')
    // ステータス効果の条件はない
    expect(endministratorCombo.requirement.statusEffects).toBeUndefined()
  })

  test('ギルベルタの連携技: 燃焼、凍結、感電、腐食のいずれかが必要', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const gilbertaCombo = COMBO_SKILLS['gilberta_combo_skill']
    
    expect(gilbertaCombo).toBeDefined()
    expect(gilbertaCombo.operatorId).toBe('gilberta')
    expect(gilbertaCombo.requirement.statusEffects).toBeDefined()
    expect(gilbertaCombo.requirement.statusEffects).toContain('combustion')
    expect(gilbertaCombo.requirement.statusEffects).toContain('freeze')
    expect(gilbertaCombo.requirement.statusEffects).toContain('shock')
    expect(gilbertaCombo.requirement.statusEffects).toContain('corrosion')
  })

  test('ポグラニチニクの連携技: 猛撃または破砕が必要', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const pogranichnikCombo = COMBO_SKILLS['pogranichnik_combo_skill']
    
    expect(pogranichnikCombo).toBeDefined()
    expect(pogranichnikCombo.operatorId).toBe('pogranichnik')
    expect(pogranichnikCombo.requirement.requiresCrashStackConsumptionBy).toBeDefined()
    expect(pogranichnikCombo.requirement.requiresCrashStackConsumptionBy).toContain('crush')
    expect(pogranichnikCombo.requirement.requiresCrashStackConsumptionBy).toContain('shatter')
  })

  test('ウォルフガルドの連携技: 灼熱、寒冷、電磁、自然のいずれかが必要', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const wolfgardCombo = COMBO_SKILLS['wolfgard_combo_skill']
    
    expect(wolfgardCombo).toBeDefined()
    expect(wolfgardCombo.operatorId).toBe('wolfgard')
    expect(wolfgardCombo.requirement.statusEffects).toBeDefined()
    expect(wolfgardCombo.requirement.statusEffects).toContain('heat')
    expect(wolfgardCombo.requirement.statusEffects).toContain('cryo')
    expect(wolfgardCombo.requirement.statusEffects).toContain('electric')
    expect(wolfgardCombo.requirement.statusEffects).toContain('nature')
  })

  test('チェン・チエンユの連携技: クラッシュが必要', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const chenQianyuCombo = COMBO_SKILLS['chen_qianyu_combo_skill']
    
    expect(chenQianyuCombo).toBeDefined()
    expect(chenQianyuCombo.operatorId).toBe('chen_qianyu')
    expect(chenQianyuCombo.requirement.statusEffects).toContain('vulnerable')
  })

  test('リーフェンの連携技: 脆弱または破砕が必要', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const lifengCombo = COMBO_SKILLS['lifeng_combo_skill']
    
    expect(lifengCombo).toBeDefined()
    expect(lifengCombo.operatorId).toBe('lifeng')
    expect(lifengCombo.requirement.statusEffects).toContain('physical_susceptibility')
    expect(lifengCombo.requirement.statusEffects).toContain('shatter')
  })

  test('全ての連携技にクールダウン時間が定義されている', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const allSkills = Object.values(COMBO_SKILLS)
    expect(allSkills.length).toBeGreaterThan(0)
    
    allSkills.forEach(skill => {
      expect(skill.cooldown).toBeDefined()
      expect(skill.cooldown).toBeGreaterThan(0)
    })
  })

  test('全ての連携技にrequirementが定義されている', async () => {
    const { COMBO_SKILLS } = await import('../../lib/data/skills')
    
    const allSkills = Object.values(COMBO_SKILLS)
    expect(allSkills.length).toBeGreaterThan(0)
    
    allSkills.forEach(skill => {
      expect(skill.requirement).toBeDefined()
    })
  })
})

/**
 * 連携技発動条件チェックロジックの動作検証テスト
 * 
 * comboRequirements.ts の関数が正しく動作するかを確認します。
 */
test.describe('Combo Skill Requirements - Logic Verification', () => {
  test('canActivateComboSkill: レーヴァテイン - 燃焼効果があれば発動可能', async () => {
    const { canActivateComboSkill } = await import('../../lib/comboRequirements')
    const { SkillType } = await import('../../types/combo')
    
    const actions = [
      {
        id: '1',
        characterId: 'character.laevatain.name',
        type: SkillType.BATTLE_SKILL,
        timing: 1000,
      },
    ]
    
    // 2000msの時点では燃焼効果がアクティブ（1000ms〜4000ms）
    const result = canActivateComboSkill('laevatain', actions, 2000)
    
    expect(result.canActivate).toBe(true)
    expect(result.missingEffects).toEqual([])
  })

  test('canActivateComboSkill: レーヴァテイン - 燃焼効果がなければ発動不可', async () => {
    const { canActivateComboSkill } = await import('../../lib/comboRequirements')
    
    const actions: ComboAction[] = []
    
    const result = canActivateComboSkill('laevatain', actions, 2000)
    
    expect(result.canActivate).toBe(false)
    expect(result.missingEffects.length).toBeGreaterThan(0)
  })

  test('canActivateComboSkill: エンドミニストラ - ステータス効果なしで発動可能', async () => {
    const { canActivateComboSkill } = await import('../../lib/comboRequirements')
    
    const actions: ComboAction[] = [
      {
        id: 'team-combo-1',
        type: SkillType.COMBO_SKILL,
        characterId: 'laevatain',
        timing: 1000
      }
    ]
    
    const result = canActivateComboSkill('endministrator', actions, 2000)
    
    expect(result.canActivate).toBe(true)
    expect(result.missingEffects).toEqual([])
  })

  test('getActiveStatusEffectsAtTime: 指定時刻でアクティブな効果を取得', async () => {
    const { getActiveStatusEffectsAtTime } = await import('../../lib/comboRequirements')
    const { SkillType, ArtsReaction } = await import('../../types/combo')
    
    const actions = [
      {
        id: '1',
        characterId: 'character.laevatain.name',
        type: SkillType.BATTLE_SKILL,
        timing: 1000,
      },
    ]
    
    // 効果がアクティブな時刻
    const effectsDuring = getActiveStatusEffectsAtTime(actions, 2000)
    expect(effectsDuring.has(ArtsReaction.COMBUSTION)).toBe(true)
    
    // 効果が終了した後
    const effectsAfter = getActiveStatusEffectsAtTime(actions, 5000)
    expect(effectsAfter.size).toBe(0)
  })

  test('getComboSkillAvailableTimeRanges: 発動可能な時間範囲を取得', async () => {
    const { getComboSkillAvailableTimeRanges } = await import('../../lib/comboRequirements')
    const { SkillType } = await import('../../types/combo')
    
    const actions = [
      {
        id: '1',
        characterId: 'character.laevatain.name',
        type: SkillType.BATTLE_SKILL,
        timing: 1000,
      },
    ]
    
    const ranges = getComboSkillAvailableTimeRanges('laevatain', actions, 10000, 100)
    
    expect(ranges.length).toBeGreaterThan(0)
    const firstRange = ranges[0]
    expect(firstRange.start).toBeGreaterThanOrEqual(1000)
    expect(firstRange.end).toBeLessThanOrEqual(4000)
  })
})

/**
 * タンタン連携技条件のE2Eテスト
 * 
 * タンタンの連携技「川よ、俺様に従え！」は寒冷付着状態の敵に対して発動可能。
 */
test.describe('Tangtang - Combo Skill Requirements', () => {
  test('タンタンのデータが正しく定義されている', async () => {
    const { OPERATORS } = await import('../../lib/data/operators')
    const { NORMAL_ATTACKS } = await import('../../lib/data/attacks')
    const { BATTLE_SKILLS, COMBO_SKILLS, ULTIMATES } = await import('../../lib/data/skills')

    expect(OPERATORS['tangtang']).toBeDefined()
    expect(OPERATORS['tangtang'].name).toBe('character.tangtang.name')

    expect(NORMAL_ATTACKS['tangtang_base_attack']).toBeDefined()
    expect(NORMAL_ATTACKS['tangtang_base_attack'].stagger).toBe(18)

    expect(BATTLE_SKILLS['tangtang_battle_skill']).toBeDefined()
    expect(BATTLE_SKILLS['tangtang_battle_skill'].skillPoints).toBe(100)

    const comboSkill = COMBO_SKILLS['tangtang_combo_skill']
    expect(comboSkill).toBeDefined()
    expect(comboSkill.cooldown).toBe(12000)
    expect(comboSkill.requirement.statusEffects).toContain('cryo')

    const ultimate = ULTIMATES['tangtang_ultimate']
    expect(ultimate).toBeDefined()
    expect(ultimate.chargeGain).toBe(90)
  })

  test('canActivateComboSkill: タンタン - 寒冷付着があれば発動可能', async () => {
    const { canActivateComboSkill } = await import('../../lib/comboRequirements')
    const { SkillType } = await import('../../types/combo')

    const actions = [
      {
        id: '1',
        characterId: 'character.tangtang.name',
        type: SkillType.BATTLE_SKILL,
        timing: 1000,
      },
    ]

    // 2000msの時点では寒冷付着がアクティブ（戦技から10秒間）
    const result = canActivateComboSkill('tangtang', actions, 2000)

    expect(result.canActivate).toBe(true)
    expect(result.missingEffects).toEqual([])
  })

  test('canActivateComboSkill: タンタン - 寒冷付着がなければ発動不可', async () => {
    const { canActivateComboSkill } = await import('../../lib/comboRequirements')

    const actions: ComboAction[] = []

    const result = canActivateComboSkill('tangtang', actions, 2000)

    expect(result.canActivate).toBe(false)
    expect(result.missingEffects.length).toBeGreaterThan(0)
  })

  test('canActivateComboSkill: タンタン - 寒冷付着の有効期間外は発動不可', async () => {
    const { canActivateComboSkill } = await import('../../lib/comboRequirements')
    const { SkillType } = await import('../../types/combo')

    const actions = [
      {
        id: '1',
        characterId: 'character.tangtang.name',
        type: SkillType.BATTLE_SKILL,
        timing: 1000,
      },
    ]

    // 31001ms時点では寒冷付着が終了（1000ms + 30000ms = 31000ms まで）
    const result = canActivateComboSkill('tangtang', actions, 31001)

    expect(result.canActivate).toBe(false)
    expect(result.missingEffects.length).toBeGreaterThan(0)
  })
})
