import { describe, it, expect } from 'vitest'
import {
  getActiveStatusEffectsAtTime,
  canActivateComboSkill,
  getComboSkillAvailableTimeRanges,
  getComboSkillTriggerWindows,
  checkSupportCrystalExhausted,
} from '@/lib/comboRequirements'
import { COMBO_SKILL_EXECUTION_WINDOW_MS } from '@/lib/timeline'
import { SkillType, ArtsReaction, ArtsInfliction } from '@/types/combo'
import type { ComboAction } from '@/types/combo'

describe('comboRequirements', () => {
  describe('getActiveStatusEffectsAtTime', () => {
    it('指定時刻でアクティブなステータス効果を取得する', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      // 効果が開始される前（1000ms前）
      const effectsBefore = getActiveStatusEffectsAtTime(actions, 500)
      expect(effectsBefore.size).toBe(0)

      // 効果がアクティブな時刻（1000ms〜4000ms）
      const effectsDuring = getActiveStatusEffectsAtTime(actions, 2000)
      expect(effectsDuring.has(ArtsReaction.COMBUSTION)).toBe(true)

      // 効果が終了した後（4000ms後）
      const effectsAfter = getActiveStatusEffectsAtTime(actions, 5000)
      expect(effectsAfter.size).toBe(0)
    })

    it('複数のステータス効果が重なる場合を処理する', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
        {
          id: '2',
          characterId: 'character.gilberta.name',
          type: SkillType.BATTLE_SKILL,
          timing: 2000,
        },
      ]

      // 両方の効果がアクティブな時刻
      const effects = getActiveStatusEffectsAtTime(actions, 2500)
      expect(effects.has(ArtsReaction.COMBUSTION)).toBe(true)
      expect(effects.has(ArtsInfliction.NATURE)).toBe(true)
    })
  })

  describe('canActivateComboSkill', () => {
    it('発動条件を満たす場合、trueを返す - レーヴァテイン', () => {
      // レーヴァテインの連携技は燃焼または腐食が必要
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      const result = canActivateComboSkill('laevatain', actions, 2000)
      expect(result.canActivate).toBe(true)
      expect(result.missingEffects).toEqual([])
    })

    it('発動条件を満たさない場合、falseを返す', () => {
      // 必要なステータス効果がない
      const actions: ComboAction[] = []

      const result = canActivateComboSkill('laevatain', actions, 2000)
      expect(result.canActivate).toBe(false)
      expect(result.missingEffects.length).toBeGreaterThan(0)
    })

    it('イヴォンヌの連携技 - 凍結 + 重攻撃が必要', () => {
      // yvonne の連携技には凍結(FREEZE)が必要 かつ requiresHeavyAttack: true
      // tangtang の戦技 t=0 → CRYO付着を付与
      // yvonne の通常攻撃 t=0: duration=3317ms → heavyAttackEndTime=3317
      // yvonne の戦技 t=1000 → CRYO消費してFREEZE発動 (有効: 1000~11000ms)
      const actions: ComboAction[] = [
        {
          id: 'tangtang_bs',
          characterId: 'character.tangtang.name',
          type: SkillType.BATTLE_SKILL,
          timing: 0,
        },
        {
          id: 'na1',
          characterId: 'character.yvonne.name',
          type: SkillType.NORMAL,
          timing: 0,
        },
        {
          id: 'bs1',
          characterId: 'character.yvonne.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      // t=3500: FREEZE active(1000~11000) かつ heavyAttackEndTime=3317 <= 3500 < 8317 → true
      const result = canActivateComboSkill('yvonne', actions, 3500)
      expect(result.canActivate).toBe(true)
    })

    it('イヴォンヌの連携技 - 凍結のみ（重攻撃なし）では発動不可', () => {
      // tangtang の戦技 t=0 → CRYO付着
      // yvonne の戦技 t=1000 → CRYO消費してFREEZE発動
      // ただし重攻撃がないため発動不可
      const actions: ComboAction[] = [
        {
          id: 'tangtang_bs',
          characterId: 'character.tangtang.name',
          type: SkillType.BATTLE_SKILL,
          timing: 0,
        },
        {
          id: 'bs1',
          characterId: 'character.yvonne.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      const result = canActivateComboSkill('yvonne', actions, 2000)
      expect(result.canActivate).toBe(false)
      expect(result.missingEffects).toContain('requires_heavy_attack')
    })

    it('エンドミニストラ - チーム連携技なしでは発動不可', () => {
      const result = canActivateComboSkill('endministrator', [], 2000)
      expect(result.canActivate).toBe(false)
      expect(result.missingEffects).toContain('requires_team_combo_skill_damage')
    })

    it('エンドミニストラ - 他キャラの連携技直後は発動可能', () => {
      const actions: ComboAction[] = [
        {
          id: 'cs1',
          characterId: 'character.laevatain.name',
          type: SkillType.COMBO_SKILL,
          timing: 5000,
        },
      ]

      // t=7000: laevatain の連携技(t=5000)から 2000ms 後 → 5秒以内 → true
      const result = canActivateComboSkill('endministrator', actions, 7000)
      expect(result.canActivate).toBe(true)
    })

    it('エンドミニストラ - 他キャラの連携技から5秒後は発動不可', () => {
      const actions: ComboAction[] = [
        {
          id: 'cs1',
          characterId: 'character.laevatain.name',
          type: SkillType.COMBO_SKILL,
          timing: 5000,
        },
      ]

      // t=10100: 5秒超 → false
      const result = canActivateComboSkill('endministrator', actions, 10100)
      expect(result.canActivate).toBe(false)
    })

    it('ポグラニチニク - クラッシュ重ね掛け消費が必要', () => {
      const actionsWithout: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.da_pan.name',
          type: SkillType.COMBO_SKILL,
          timing: 1000,
        },
      ]

      const resultWithout = canActivateComboSkill('pogranichnik', actionsWithout, 1500)
      expect(resultWithout.canActivate).toBe(false)

      const actionsWithConsumption: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.chen_qianyu.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
        {
          id: '2',
          characterId: 'character.da_pan.name',
          type: SkillType.COMBO_SKILL,
          timing: 2000,
        },
      ]

      const resultDuring = canActivateComboSkill('pogranichnik', actionsWithConsumption, 2500)
      expect(resultDuring.canActivate).toBe(true)

      const resultAfter = canActivateComboSkill('pogranichnik', actionsWithConsumption, 3500)
      expect(resultAfter.canActivate).toBe(false)
    })

    it('ラストリット - 寒冷付着が3段階以上で発動可能', () => {
      const actionsTwoStacks: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.xaihi.name',
          type: SkillType.COMBO_SKILL,
          timing: 0,
        },
        {
          id: '2',
          characterId: 'character.xaihi.name',
          type: SkillType.COMBO_SKILL,
          timing: 500,
        },
      ]

      const resultTwoStacks = canActivateComboSkill('last_rite', actionsTwoStacks, 1500)
      expect(resultTwoStacks.canActivate).toBe(false)

      const actionsThreeStacks: ComboAction[] = [
        ...actionsTwoStacks,
        {
          id: '3',
          characterId: 'character.xaihi.name',
          type: SkillType.COMBO_SKILL,
          timing: 1000,
        },
      ]

      const resultThreeStacks = canActivateComboSkill('last_rite', actionsThreeStacks, 1500)
      expect(resultThreeStacks.canActivate).toBe(true)
    })

    it('フローライト - 寒冷または自然の付着段階が2以上で発動可能', () => {
      const actionsOneStack: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.xaihi.name',
          type: SkillType.COMBO_SKILL,
          timing: 0,
        },
      ]

      const resultOneStack = canActivateComboSkill('fluorite', actionsOneStack, 1500)
      expect(resultOneStack.canActivate).toBe(false)

      const actionsTwoStacks: ComboAction[] = [
        ...actionsOneStack,
        {
          id: '2',
          characterId: 'character.xaihi.name',
          type: SkillType.COMBO_SKILL,
          timing: 500,
        },
      ]

      const resultTwoStacks = canActivateComboSkill('fluorite', actionsTwoStacks, 1500)
      expect(resultTwoStacks.canActivate).toBe(true)
    })
  })

  describe('getComboSkillAvailableTimeRanges', () => {
    it('連携技が発動可能な時間範囲を取得する', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      const ranges = getComboSkillAvailableTimeRanges('laevatain', actions, 10000, 100)

      expect(ranges.length).toBeGreaterThan(0)
      // 燃焼効果は1000ms〜4000msの間アクティブなので、その範囲が含まれる
      const firstRange = ranges[0]
      expect(firstRange.start).toBeGreaterThanOrEqual(1000)
      expect(firstRange.end).toBeLessThanOrEqual(4000)
    })

    it('複数の時間範囲がある場合を処理する', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
        {
          id: '2',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 8000,
        },
      ]

      const ranges = getComboSkillAvailableTimeRanges('laevatain', actions, 15000, 100)

      // 2つの範囲が存在する可能性がある
      // 1000-4000ms と 8000-11000ms
      expect(ranges.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getComboSkillTriggerWindows', () => {
    it('発動可能区間の先頭から5秒間のウィンドウを返す', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      const windows = getComboSkillTriggerWindows('laevatain', actions, 30000, 100)

      expect(windows.length).toBeGreaterThan(0)
      const first = windows[0]
      // ウィンドウの幅は最大5秒
      expect(first.end - first.start).toBeLessThanOrEqual(COMBO_SKILL_EXECUTION_WINDOW_MS)
      // ウィンドウの幅は1ステップ以上
      expect(first.end).toBeGreaterThan(first.start)
    })

    it('発動可能区間がない場合、空配列を返す', () => {
      const windows = getComboSkillTriggerWindows('laevatain', [], 30000, 100)
      expect(windows).toEqual([])
    })

    it('発動可能区間が5秒未満の場合、その区間の長さのウィンドウを返す', () => {
      // 短い区間: 3000ms の燃焼効果（DEFAULT_STATUS_EFFECT_DURATION_MS = 3000ms）
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      const windows = getComboSkillTriggerWindows('laevatain', actions, 10000, 100)

      expect(windows.length).toBeGreaterThan(0)
      const first = windows[0]
      // 条件が満たされる区間の長さ以下
      expect(first.end - first.start).toBeLessThanOrEqual(COMBO_SKILL_EXECUTION_WINDOW_MS)
    })

    it('複数の発動可能区間がある場合、それぞれに5秒ウィンドウを返す', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
        {
          id: '2',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 20000,
        },
      ]

      const windows = getComboSkillTriggerWindows('laevatain', actions, 30000, 100)

      expect(windows.length).toBeGreaterThanOrEqual(2)
      windows.forEach((window) => {
        expect(window.end - window.start).toBeLessThanOrEqual(COMBO_SKILL_EXECUTION_WINDOW_MS)
        expect(window.end).toBeGreaterThan(window.start)
      })
    })
  })

  describe('checkSupportCrystalExhausted', () => {
    // Xaihi の battle skill が SUPPORT_CRYSTAL を付与する
    const xaihiBattleSkill: ComboAction = {
      id: 'bs1',
      characterId: 'character.xaihi.name',
      type: SkillType.BATTLE_SKILL,
      timing: 5000,
    }

    it('サポートクリスタルが付与されていない場合は false を返す', () => {
      expect(checkSupportCrystalExhausted([], 10000)).toBe(false)
    })

    it('戦技直後（通常攻撃0回）は false を返す', () => {
      const result = checkSupportCrystalExhausted([xaihiBattleSkill], 6000)
      expect(result).toBe(false)
    })

    it('通常攻撃1回後は false を返す（まだ1チャージ残り）', () => {
      const actions: ComboAction[] = [
        xaihiBattleSkill,
        { id: 'na1', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 7000 },
      ]
      const result = checkSupportCrystalExhausted(actions, 8000)
      expect(result).toBe(false)
    })

    it('通常攻撃2回後は true を返す（チャージ消耗）', () => {
      const actions: ComboAction[] = [
        xaihiBattleSkill,
        { id: 'na1', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 7000 },
        { id: 'na2', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 10000 },
      ]
      // laevatain の通常攻撃 duration=3300ms のため、2回目攻撃の終了 = 10000+3300 = 13300ms
      const result = checkSupportCrystalExhausted(actions, 14000)
      expect(result).toBe(true)
    })

    it('2回目の通常攻撃タイミング以前は false を返す', () => {
      const actions: ComboAction[] = [
        xaihiBattleSkill,
        { id: 'na1', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 7000 },
        { id: 'na2', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 10000 },
      ]
      // time=9000 では 2回目の通常攻撃 (t=10000) がまだ
      expect(checkSupportCrystalExhausted(actions, 9000)).toBe(false)
    })

    it('Xaihiの連携技: サポートクリスタル消耗前は発動不可', () => {
      const actions: ComboAction[] = [
        xaihiBattleSkill,
        { id: 'na1', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 7000 },
      ]
      const result = canActivateComboSkill('xaihi', actions, 8000)
      expect(result.canActivate).toBe(false)
      expect(result.missingEffects).toContain('support_crystal_exhausted')
    })

    it('Xaihiの連携技: サポートクリスタル消耗後は発動可能', () => {
      const actions: ComboAction[] = [
        xaihiBattleSkill,
        { id: 'na1', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 7000 },
        { id: 'na2', characterId: 'character.laevatain.name', type: SkillType.NORMAL, timing: 10000 },
      ]
      // laevatain の通常攻撃 duration=3300ms のため、2回目攻撃の終了 = 10000+3300 = 13300ms
      const result = canActivateComboSkill('xaihi', actions, 14000)
      expect(result.canActivate).toBe(true)
    })
  })

  describe('requiresHeavyAttack チェック', () => {
    it('ペルリカ - 重攻撃後5秒以内は発動可能', () => {
      // perlica の通常攻撃 duration を確認するために laevatain で代用（operatorId=perlica でチェック）
      // perlica の characterId = 'character.perlica.name', operatorId = 'perlica'
      // perlica 通常攻撃 duration が必要 → laevatain(3300ms) で検証できないので直接 perlica で
      const actions: ComboAction[] = [
        {
          id: 'na1',
          characterId: 'character.perlica.name',
          type: SkillType.NORMAL,
          timing: 0,
        },
      ]
      // perlica の duration を確認するため、t=5000 で試す（どのdurationでも0+duration <= 5000 && 5000 < duration+5000）
      // perlica duration は attacks.ts で 3317ms とする前提
      // heavyAttackEndTime = duration, t=3500: 3317<=3500<8317 → true
      const result = canActivateComboSkill('perlica', actions, 3500)
      expect(result.canActivate).toBe(true)
    })

    it('ペルリカ - 重攻撃なしでは発動不可', () => {
      const result = canActivateComboSkill('perlica', [], 5000)
      expect(result.canActivate).toBe(false)
      expect(result.missingEffects).toContain('requires_heavy_attack')
    })

    it('ペルリカ - 重攻撃から5秒後は発動不可', () => {
      const actions: ComboAction[] = [
        {
          id: 'na1',
          characterId: 'character.perlica.name',
          type: SkillType.NORMAL,
          timing: 0,
        },
      ]
      // heavyAttackEndTime + 5000 = duration+5000. t=duration+5001 → false
      // duration > 0 なので timing=0 + duration + 5001 > 5001
      // laevatain duration=3300ms を想定して t=8500: 3317+5000=8317 < 8500 → false
      const result = canActivateComboSkill('perlica', actions, 8500)
      expect(result.canActivate).toBe(false)
    })
  })

  describe('excludedStatusEffects チェック', () => {
    it('アルデリア - 除外効果なし + 重攻撃あり → 発動可能', () => {
      // ardelia: requiresHeavyAttack: true, excludedStatusEffects: [CRUSH, HEAT, CRYO, ELECTRIC, NATURE]
      // ardelia 通常攻撃 duration=3517ms, t=0 → heavyAttackEndTime=3517
      // 除外効果なし、重攻撃後5秒以内 → t=4000: 3517<=4000<8517 → true
      const actions: ComboAction[] = [
        {
          id: 'na1',
          characterId: 'character.ardelia.name',
          type: SkillType.NORMAL,
          timing: 0,
        },
      ]
      const result = canActivateComboSkill('ardelia', actions, 4000)
      expect(result.canActivate).toBe(true)
    })

    it('アルデリア - アーツ付着状態では発動不可', () => {
      const actions: ComboAction[] = [
        {
          id: 'na1',
          characterId: 'character.ardelia.name',
          type: SkillType.NORMAL,
          timing: 0,
        },
        {
          id: 'bs1',
          characterId: 'character.wolfgard.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]
      // wolfgard 戦技 → HEAT 付着（ArtsInfliction.HEAT = excluded）
      // laevatain battle_skill creates COMBUSTION; wolfgard creates HEAT
      const result = canActivateComboSkill('ardelia', actions, 3500)
      expect(result.canActivate).toBe(false)
      expect(result.missingEffects).toContain('excluded_status_effect_present')
    })
  })

  describe('requiresStatusEffectConsumed チェック', () => {
    it('アレシュ - アーツ異常が消費された直後（期限切れ）は発動可能', () => {
      // alesh: requiresStatusEffectConsumed: [COMBUSTION, FREEZE, SHOCK, CORROSION, ORIGINIUM_CRYSTALS]
      // laevatain battle_skill → COMBUSTION (duration=3000ms)
      // t=1000 → expiryTime=1000+3000=4000
      // t=4500: expiryTime=4000 <= 4500 < 4000+5000=9000 → true
      const actions: ComboAction[] = [
        {
          id: 'bs1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]
      const result = canActivateComboSkill('alesh', actions, 4500)
      expect(result.canActivate).toBe(true)
    })

    it('アレシュ - アーツ異常がまだアクティブ（未消費）の間は発動不可', () => {
      const actions: ComboAction[] = [
        {
          id: 'bs1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]
      // t=2000: expiryTime=4000 > 2000 → 消費前 → false
      const result = canActivateComboSkill('alesh', actions, 2000)
      expect(result.canActivate).toBe(false)
    })

    it('アレシュ - アーツ異常消費から5秒後は発動不可', () => {
      const actions: ComboAction[] = [
        {
          id: 'bs1',
          characterId: 'character.laevatain.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]
      // expiryTime=4000, expiryTime+5000=9000
      // t=9100: 9100 >= 9000 → false
      const result = canActivateComboSkill('alesh', actions, 9100)
      expect(result.canActivate).toBe(false)
    })
  })
})
