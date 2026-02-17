import { getNormalAttackStatusEffect } from '@/lib/data/attacks'
import { SkillType, PhysicalStatus, ArtsInfliction, ArtsReaction, BattleSkill, Ultimate, ComboSkill, SpecialEffect } from '@/types/combo'

// Battle Skills (戦技)
export const BATTLE_SKILLS: Record<string, BattleSkill> = {
  'endministrator_battle_skill': {
    operatorId: 'endministrator',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.endministrator_battle_skill.name',
    description: 'skill.endministrator_battle_skill.description',
    statusEffect: PhysicalStatus.CRUSH,
    skillPoints: 100
  },
  'chen_qianyu_battle_skill': {
    operatorId: 'chen_qianyu',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.chen_qianyu_battle_skill.name',
    description: 'skill.chen_qianyu_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'alderia_battle_skill': {
    operatorId: 'alderia',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.alderia_battle_skill.name',
    description: 'skill.alderia_battle_skill.description',
    statusEffect: PhysicalStatus.VULNERABLE,
    skillPoints: 100
  },
  'wolfgard_battle_skill': {
    operatorId: 'wolfgard',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.wolfgard_battle_skill.name',
    description: 'skill.wolfgard_battle_skill.description',
    statusEffect: ArtsInfliction.HEAT,
    skillPoints: 100
  }
}

// Combo Skills (連携技)
export const COMBO_SKILLS: Record<string, ComboSkill> = {
  'endministrator_combo_skill': {
    operatorId: 'endministrator',
    type: SkillType.COMBO_SKILL,
    name: 'endministrator.combo_skill.name',
    description: 'endministrator.combo_skill.description',
    cooldown: 16000,
    statusEffect: SpecialEffect.ORIGINIUM_CRYSTALS,
    requirement: {
      synergyActivated: true
    }
  },
  'chen_qianyu_combo_skill': {
    operatorId: 'chen_qianyu',
    type: SkillType.COMBO_SKILL,
    name: 'chen_qianyu.combo_skill.name',
    description: 'chen_qianyu.combo_skill.description',
    cooldown: 16000,
    statusEffect: PhysicalStatus.LIFT,
    requirement: {
      synergyActivated: true,
      statusEffects: [PhysicalStatus.VULNERABLE]
    }
  },
  'alderia_combo_skill': {
    operatorId: 'alderia',
    type: SkillType.COMBO_SKILL,
    name: 'alderia.combo_skill.name',
    description: 'alderia.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsInfliction.NATURE,
    requirement: {
      synergyActivated: true
    },
  },
  'wolfgard_combo_skill': {
    operatorId: 'wolfgard',
    type: SkillType.COMBO_SKILL,
    name: 'wolfgard.combo_skill.name',
    description: 'wolfgard.combo_skill.description',
    cooldown: 20000,
    statusEffect: ArtsInfliction.HEAT,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsInfliction.HEAT, ArtsInfliction.CRYO, ArtsInfliction.ELECTRIC, ArtsInfliction.NATURE]
    },
  }
}

// Ultimates (必殺技)
export const ULTIMATES: Record<string, Ultimate> = {
  'endministrator_ultimate': {
    operatorId: 'endministrator',
    type: SkillType.ULTIMATE,
    name: 'endministrator.ultimate.name',
    description:'endministrator.ultimate.description',
    chargeGain: 80, // Ultimates consume charge
    cooldown: 10000
  },
  'chen_qianyu_ultimate': {
    operatorId: 'chen_qianyu',
    type: SkillType.ULTIMATE,
    name: 'chen_qianyu.ultimate.name',
    description:'chen_qianyu.ultimate.description',
    chargeGain: 70, // Ultimates consume charge
    cooldown: 10000
  },
  'alderia_ultimate': {
    operatorId: 'alderia',
    type: SkillType.ULTIMATE,
    name: 'alderia.ultimate.name',
    description: 'alderia.ultimate.description',
    chargeGain: 80, // Ultimates consume charge
    statusEffect: ArtsInfliction.NATURE,
    cooldown: 10000
  },
  'wolfgard_ultimate': {
    operatorId: 'wolfgard',
    type: SkillType.ULTIMATE,
    name: 'wolfgard.ultimate.name',
    description: 'wolfgard.ultimate.description',
    chargeGain: 80, // Ultimates consume charge
    statusEffect: ArtsReaction.COMBUSTION,
    cooldown: 10000
  }
}

export const getStatusEffectForAction = (operatorId: string | null, type: SkillType) => {
  if (!operatorId) return undefined

  if (type === SkillType.NORMAL) {
    return getNormalAttackStatusEffect(operatorId)
  }

  if (type === SkillType.BATTLE_SKILL) {
    return Object.values(BATTLE_SKILLS).find((skill) => skill.operatorId === operatorId)?.statusEffect
  }

  if (type === SkillType.COMBO_SKILL) {
    return Object.values(COMBO_SKILLS).find((skill) => skill.operatorId === operatorId)?.statusEffect
  }

  if (type === SkillType.ULTIMATE) {
    return Object.values(ULTIMATES).find((skill) => skill.operatorId === operatorId)?.statusEffect
  }

  return undefined
}
