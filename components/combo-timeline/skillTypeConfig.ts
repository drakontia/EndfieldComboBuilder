import { SkillType } from '@/types/combo'

export const SKILL_TYPE_LABELS = {
  [SkillType.NORMAL]: '通常攻撃',
  [SkillType.BATTLE_SKILL]: '戦技',
  [SkillType.COMBO_SKILL]: '連携技',
  [SkillType.ULTIMATE]: '必殺技',
}

export const SKILL_TYPE_COLORS = {
  [SkillType.NORMAL]: 'bg-slate-500',
  [SkillType.BATTLE_SKILL]: 'bg-green-500',
  [SkillType.COMBO_SKILL]: 'bg-purple-500',
  [SkillType.ULTIMATE]: 'bg-red-500',
}

export const SKILL_TYPE_BG_COLORS = {
  [SkillType.NORMAL]: '#64748b',
  [SkillType.BATTLE_SKILL]: '#22c55e',
  [SkillType.COMBO_SKILL]: '#a855f7',
  [SkillType.ULTIMATE]: '#ef4444',
}

export const SKILL_TYPE_TEXT_COLORS = {
  [SkillType.NORMAL]: 'text-slate-300',
  [SkillType.BATTLE_SKILL]: 'text-green-400',
  [SkillType.COMBO_SKILL]: 'text-purple-400',
  [SkillType.ULTIMATE]: 'text-red-400',
}

export const SKILL_TYPE_ACCENT_COLORS = {
  [SkillType.NORMAL]: '#64748b',
  [SkillType.BATTLE_SKILL]: '#22c55e',
  [SkillType.COMBO_SKILL]: '#a855f7',
  [SkillType.ULTIMATE]: '#ef4444',
}
