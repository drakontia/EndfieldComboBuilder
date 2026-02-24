import { describe, it, expect } from 'vitest'
import {
  getActiveStatusEffectsAtTime,
  canActivateComboSkill,
  getComboSkillAvailableTimeRanges,
} from '@/lib/comboRequirements'
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

    it('イヴォンヌの連携技 - 凍結が必要', () => {
      const actions: ComboAction[] = [
        {
          id: '1',
          characterId: 'character.yvonne.name',
          type: SkillType.BATTLE_SKILL,
          timing: 1000,
        },
      ]

      const result = canActivateComboSkill('yvonne', actions, 2000)
      expect(result.canActivate).toBe(true)
    })

    it('エンドミニストラ - ステータス効果の条件なし', () => {
      const actions: ComboAction[] = []

      const result = canActivateComboSkill('endministrator', actions, 2000)
      expect(result.canActivate).toBe(true)
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
})
