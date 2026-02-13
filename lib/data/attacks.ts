// Attack skills data for Arknights: Endfield
import { PhysicalStatus, ArtsInfliction } from '@/types/combo'

export interface AttackData {
  id: string
  operatorId: string
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

// Normal Attacks (通常攻撃)
export const NORMAL_ATTACKS: AttackData[] = [
  {
    id: 'normal_1',
    operatorId: '1',
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
