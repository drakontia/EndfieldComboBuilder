// Attack skills data for Arknights: Endfield
import { AttackType, StatusEffect } from '@/types/combo'

export interface AttackSkillData {
  id: string
  operatorId: string
  type: AttackType
  name: {
    ja: string
    en: string
  }
  description: {
    ja: string
    en: string
  }
  cooldown?: number // in milliseconds
  chargeGain?: number // ultimate charge gained
  statusEffect?: StatusEffect
  damage?: number
  duration?: number
}

// Normal Attacks (通常攻撃)
export const NORMAL_ATTACKS: AttackSkillData[] = [
  {
    id: 'normal_1',
    operatorId: '1',
    type: AttackType.NORMAL,
    name: {
      ja: '通常攻撃',
      en: 'Normal Attack'
    },
    description: {
      ja: '5段攻撃。最後が重攻撃。',
      en: '5-hit combo. Last hit is heavy attack.'
    },
    chargeGain: 5,
    damage: 100
  }
]

// Battle Skills (戦技)
export const BATTLE_SKILLS: AttackSkillData[] = [
  {
    id: 'skill_1_1',
    operatorId: '1',
    type: AttackType.BATTLE_SKILL,
    name: {
      ja: '突進斬り',
      en: 'Rush Slash'
    },
    description: {
      ja: '前方に突進して敵を斬る',
      en: 'Rush forward and slash enemies'
    },
    cooldown: 5000,
    chargeGain: 15,
    damage: 250
  },
  {
    id: 'skill_2_1',
    operatorId: '2',
    type: AttackType.BATTLE_SKILL,
    name: {
      ja: '連続斬り',
      en: 'Rapid Slash'
    },
    description: {
      ja: '素早く連続攻撃',
      en: 'Quick consecutive attacks'
    },
    cooldown: 4000,
    chargeGain: 15,
    statusEffect: StatusEffect.WEAKNESS,
    damage: 200
  }
]

// Synergy Skills (連携技)
export const SYNERGY_SKILLS: AttackSkillData[] = [
  {
    id: 'synergy_1_1',
    operatorId: '1',
    type: AttackType.SYNERGY_SKILL,
    name: {
      ja: '炎の連携',
      en: 'Fire Synergy'
    },
    description: {
      ja: '味方と連携して炎属性攻撃',
      en: 'Coordinate with allies for fire attack'
    },
    cooldown: 8000,
    chargeGain: 20,
    statusEffect: StatusEffect.BURN,
    damage: 400
  },
  {
    id: 'synergy_2_1',
    operatorId: '2',
    type: AttackType.SYNERGY_SKILL,
    name: {
      ja: '氷結連携',
      en: 'Freeze Synergy'
    },
    description: {
      ja: '味方と連携して氷結攻撃',
      en: 'Coordinate with allies for freeze attack'
    },
    cooldown: 8000,
    chargeGain: 20,
    statusEffect: StatusEffect.FREEZE,
    damage: 400
  }
]

// Ultimates (必殺技)
export const ULTIMATES: AttackSkillData[] = [
  {
    id: 'ultimate_1_1',
    operatorId: '1',
    type: AttackType.ULTIMATE,
    name: {
      ja: '烈火の一閃',
      en: 'Blazing Flash'
    },
    description: {
      ja: '全力で炎を纏った一撃を放つ',
      en: 'Unleash a powerful flame-wrapped strike'
    },
    chargeGain: 0, // Ultimates consume charge
    statusEffect: StatusEffect.BURN,
    damage: 1000,
    duration: 3000
  },
  {
    id: 'ultimate_2_1',
    operatorId: '2',
    type: AttackType.ULTIMATE,
    name: {
      ja: '絶対零度',
      en: 'Absolute Zero'
    },
    description: {
      ja: '周囲を凍てつかせる必殺技',
      en: 'Freeze the surroundings with ultimate power'
    },
    chargeGain: 0,
    statusEffect: StatusEffect.FREEZE,
    damage: 1200,
    duration: 4000
  }
]

// Helper functions
export function getAttackSkillsByOperator(operatorId: string, type?: AttackType): AttackSkillData[] {
  const allSkills = [...NORMAL_ATTACKS, ...BATTLE_SKILLS, ...SYNERGY_SKILLS, ...ULTIMATES]
  return allSkills.filter(skill => 
    skill.operatorId === operatorId && (type === undefined || skill.type === type)
  )
}

export function getAttackSkillById(id: string): AttackSkillData | undefined {
  const allSkills = [...NORMAL_ATTACKS, ...BATTLE_SKILLS, ...SYNERGY_SKILLS, ...ULTIMATES]
  return allSkills.find(skill => skill.id === id)
}

export function getAttackSkillName(id: string, locale: 'ja' | 'en' = 'ja'): string {
  const skill = getAttackSkillById(id)
  return skill ? skill.name[locale] : ''
}
