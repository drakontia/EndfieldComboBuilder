import { ArtsInfliction, ArtsReaction, PhysicalStatus, SpecialEffect, Buff, Debuff } from '@/types/combo'

type TimelineStatusEffect = ArtsInfliction | ArtsReaction | PhysicalStatus | SpecialEffect | Buff | Debuff

/**
 * 状態異常のenum値から翻訳キーを構築する
 * 例: ArtsInfliction.HEAT ('heat') → 'artsInfliction.heat'
 */
export const getStatusEffectLabelKey = (effect: TimelineStatusEffect): string => {
  if (Object.values(ArtsInfliction).includes(effect as ArtsInfliction)) {
    return `artsInfliction.${effect}`
  }
  if (Object.values(ArtsReaction).includes(effect as ArtsReaction)) {
    return `artsReaction.${effect}`
  }
  if (Object.values(PhysicalStatus).includes(effect as PhysicalStatus)) {
    return `physicalStatus.${effect}`
  }
  if (Object.values(SpecialEffect).includes(effect as SpecialEffect)) {
    return `specialEffects.${effect}`
  }
  if (Object.values(Buff).includes(effect as Buff)) {
    return `buff.${effect}`
  }
  if (Object.values(Debuff).includes(effect as Debuff)) {
    return `debuff.${effect}`
  }
  return ''
}
