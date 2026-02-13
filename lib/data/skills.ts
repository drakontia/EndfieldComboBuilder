import { SkillType, PhysicalStatus, ArtsInfliction } from '@/types/combo'

export interface SkillData {
  id: string
  operatorId: string
  type: SkillType
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
  statusEffect?: PhysicalStatus | ArtsInfliction
  damage?: number
  duration?: number
}

// Battle Skills (戦技)
export const BATTLE_SKILLS: SkillData[] = [
  {
    id: 'skill_1_1',
    operatorId: '1',
    type: SkillType.BATTLE_SKILL,
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
    type: SkillType.BATTLE_SKILL,
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
    statusEffect: PhysicalStatus.WEAKNESS,
    damage: 200
  }
]

// Synergy Skills (連携技)
export const SYNERGY_SKILLS: SkillData[] = [
  {
    id: 'synergy_1_1',
    operatorId: '1',
    type: SkillType.COMBO_SKILL,
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
    statusEffect: ArtsInfliction.HEAT,
    damage: 400
  },
  {
    id: 'synergy_2_1',
    operatorId: '2',
    type: SkillType.COPMBO_SKILL,
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
    statusEffect: ArtsInfliction.CRYO,
    damage: 400
  }
]

// Ultimates (必殺技)
export const ULTIMATES: SkillData[] = [
  {
    id: 'ultimate_1_1',
    operatorId: '1',
    type: SkillType.ULTIMATE,
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
    type: SkillType.ULTIMATE,
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
