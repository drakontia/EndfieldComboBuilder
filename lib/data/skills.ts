import { getNormalAttackStatusEffect } from '@/lib/data/attacks'
import { SkillType, PhysicalStatus, ArtsInfliction, ArtsReaction, BattleSkill, Ultimate, ComboSkill, SpecialEffect } from '@/types/combo'

// Battle Skills (戦技)
export const BATTLE_SKILLS: Record<string, BattleSkill> = {
  'laevatain_battle_skill': {
    operatorId: 'laevatain',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.laevatain_battle_skill.name',
    description: 'skill.laevatain_battle_skill.description',
    statusEffect: PhysicalStatus.CRUSH,
    skillPoints: 100
  },
  'gilberta_battle_skill': {
    operatorId: 'gilberta',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.gilberta_battle_skill.name',
    description: 'skill.gilberta_battle_skill.description',
    statusEffect: PhysicalStatus.CRUSH,
    skillPoints: 100
  },
  'yvonne_battle_skill': {
    operatorId: 'yvonne',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.yvonne_battle_skill.name',
    description: 'skill.yvonne_battle_skill.description',
    statusEffect: PhysicalStatus.CRUSH,
    skillPoints: 100
  },
  'endministrator_battle_skill': {
    operatorId: 'endministrator',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.endministrator_battle_skill.name',
    description: 'skill.endministrator_battle_skill.description',
    statusEffect: PhysicalStatus.CRUSH,
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
  'pogranichnik_battle_skill': {
    operatorId: 'pogranichnik',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.pogranichnik_battle_skill.name',
    description: 'skill.pogranichnik_battle_skill.description',
    statusEffect: PhysicalStatus.VULNERABLE,
    skillPoints: 100
  },
  'last_rite_battle_skill': {
    operatorId: 'last_rite',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.last_rite_battle_skill.name',
    description: 'skill.last_rite_battle_skill.description',
    statusEffect: PhysicalStatus.VULNERABLE,
    skillPoints: 100
  },
  'ember_battle_skill': {
    operatorId: 'ember',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.ember_battle_skill.name',
    description: 'skill.ember_battle_skill.description',
    statusEffect: PhysicalStatus.VULNERABLE,
    skillPoints: 100
  },
  'lifeng_battle_skill': {
    operatorId: 'lifeng',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.lifeng_battle_skill.name',
    description: 'skill.lifeng_battle_skill.description',
    statusEffect: PhysicalStatus.VULNERABLE,
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
  'wolfgard_battle_skill': {
    operatorId: 'wolfgard',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.wolfgard_battle_skill.name',
    description: 'skill.wolfgard_battle_skill.description',
    statusEffect: ArtsInfliction.HEAT,
    skillPoints: 100
  },
  'avywenna_battle_skill': {
    operatorId: 'avywenna',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.avywenna_battle_skill.name',
    description: 'skill.avywenna_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'xaihi_battle_skill': {
    operatorId: 'xaihi',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.xaihi_battle_skill.name',
    description: 'skill.xaihi_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'alesh_battle_skill': {
    operatorId: 'alesh',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.alesh_battle_skill.name',
    description: 'skill.alesh_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'arclight_battle_skill': {
    operatorId: 'arclight',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.arclight_battle_skill.name',
    description: 'skill.arclight_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'snowshine_battle_skill': {
    operatorId: 'snowshine',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.snowshine_battle_skill.name',
    description: 'skill.snowshine_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'perlica_battle_skill': {
    operatorId: 'perlica',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.perlica_battle_skill.name',
    description: 'skill.perlica_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'da_pan_battle_skill': {
    operatorId: 'da_pan',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.da_pan_battle_skill.name',
    description: 'skill.da_pan_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'antal_battle_skill': {
    operatorId: 'antal',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.antal_battle_skill.name',
    description: 'skill.antal_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'akekuri_battle_skill': {
    operatorId: 'akekuri',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.akekuri_battle_skill.name',
    description: 'skill.akekuri_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'estella_battle_skill': {
    operatorId: 'estella',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.estella_battle_skill.name',
    description: 'skill.estella_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'catcher_battle_skill': {
    operatorId: 'catcher',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.catcher_battle_skill.name',
    description: 'skill.catcher_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  },
  'fluorite_battle_skill': {
    operatorId: 'fluorite',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.fluorite_battle_skill.name',
    description: 'skill.fluorite_battle_skill.description',
    statusEffect: PhysicalStatus.LIFT,
    skillPoints: 100
  }
}

// Combo Skills (連携技)
export const COMBO_SKILLS: Record<string, ComboSkill> = {
  'laevatain_combo_skill': {
    operatorId: 'laevatain',
    type: SkillType.COMBO_SKILL,
    name: 'laevatain.combo_skill.name',
    description: 'laevatain.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsInfliction.HEAT,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsReaction.COMBUSTION, ArtsReaction.CORROSION]
    }
  },
  'gilberta_combo_skill': {
    operatorId: 'gilberta',
    type: SkillType.COMBO_SKILL,
    name: 'gilberta.combo_skill.name',
    description: 'gilberta.combo_skill.description',
    cooldown: 16000,
    statusEffect: PhysicalStatus.LIFT,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsReaction.COMBUSTION, ArtsReaction.FREEZE, ArtsReaction.SHOCK, ArtsReaction.CORROSION]
    }
  },
  'yvonne_combo_skill': {
    operatorId: 'yvonne',
    type: SkillType.COMBO_SKILL,
    name: 'yvonne.combo_skill.name',
    description: 'yvonne.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsReaction.FREEZE,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsReaction.FREEZE]
    }
  },
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
  'pogranichnik_combo_skill': {
    operatorId: 'pogranichnik',
    type: SkillType.COMBO_SKILL,
    name: 'pogranichnik.combo_skill.name',
    description: 'pogranichnik.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true,
      statusEffects: [PhysicalStatus.SMASH, PhysicalStatus.SHATTER]
    }
  },
  'last_rite_combo_skill': {
    operatorId: 'last_rite',
    type: SkillType.COMBO_SKILL,
    name: 'last_rite.combo_skill.name',
    description: 'last_rite.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsInfliction.CRYO]
    }
  },
  'ember_combo_skill': {
    operatorId: 'ember',
    type: SkillType.COMBO_SKILL,
    name: 'ember.combo_skill.name',
    description: 'ember.combo_skill.description',
    cooldown: 16000,
    statusEffect: PhysicalStatus.KNOCKDOWN,
    requirement: {
      synergyActivated: true
    }
  },
  'lifeng_combo_skill': {
    operatorId: 'lifeng',
    type: SkillType.COMBO_SKILL,
    name: 'lifeng.combo_skill.name',
    description: 'lifeng.combo_skill.description',
    cooldown: 16000,
    statusEffect: SpecialEffect.LINK,
    requirement: {
      synergyActivated: true,
      statusEffects: [PhysicalStatus.VULNERABLE, PhysicalStatus.SHATTER]
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
      statusEffects: [PhysicalStatus.CRUSH]
    }
  },
  'wolfgard_combo_skill': {
    operatorId: 'wolfgard',
    type: SkillType.COMBO_SKILL,
    name: 'wolfgard.combo_skill.name',
    description: 'wolfgard.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsInfliction.HEAT,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsInfliction.HEAT, ArtsInfliction.CRYO, ArtsInfliction.ELECTRIC, ArtsInfliction.NATURE]
    }
  },
  'avywenna_combo_skill': {
    operatorId: 'avywenna',
    type: SkillType.COMBO_SKILL,
    name: 'avywenna.combo_skill.name',
    description: 'avywenna.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsInfliction.ELECTRIC, ArtsReaction.SHOCK]
    }
  },
  'xaihi_combo_skill': {
    operatorId: 'xaihi',
    type: SkillType.COMBO_SKILL,
    name: 'xaihi.combo_skill.name',
    description: 'xaihi.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsInfliction.CRYO,
    requirement: {
      synergyActivated: true
    }
  },
  'alesh_combo_skill': {
    operatorId: 'alesh',
    type: SkillType.COMBO_SKILL,
    name: 'alesh.combo_skill.name',
    description: 'alesh.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsReaction.COMBUSTION, ArtsReaction.FREEZE, ArtsReaction.SHOCK, ArtsReaction.CORROSION, SpecialEffect.ORIGINIUM_CRYSTALS]
    }
  },
  'fluorite_combo_skill': {
    operatorId: 'fluorite',
    type: SkillType.COMBO_SKILL,
    name: 'fluorite.combo_skill.name',
    description: 'fluorite.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsInfliction.NATURE,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsInfliction.CRYO, ArtsInfliction.NATURE]
    }
  },
  'akekuri_combo_skill': {
    operatorId: 'akekuri',
    type: SkillType.COMBO_SKILL,
    name: 'akekuri.combo_skill.name',
    description: 'akekuri.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true
    }
  },
  'arclight_combo_skill': {
    operatorId: 'arclight',
    type: SkillType.COMBO_SKILL,
    name: 'arclight.combo_skill.name',
    description: 'arclight.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsReaction.SHOCK]
    }
  },
  'snowshine_combo_skill': {
    operatorId: 'snowshine',
    type: SkillType.COMBO_SKILL,
    name: 'snowshine.combo_skill.name',
    description: 'snowshine.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true
    }
  },
  'perlica_combo_skill': {
    operatorId: 'perlica',
    type: SkillType.COMBO_SKILL,
    name: 'perlica.combo_skill.name',
    description: 'perlica.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsReaction.SHOCK,
    requirement: {
      synergyActivated: true
    }
  },
  'estella_combo_skill': {
    operatorId: 'estella',
    type: SkillType.COMBO_SKILL,
    name: 'estella.combo_skill.name',
    description: 'estella.combo_skill.description',
    cooldown: 16000,
    statusEffect: PhysicalStatus.LIFT,
    requirement: {
      synergyActivated: true,
      statusEffects: [ArtsReaction.FREEZE]
    }
  },
  'antal_combo_skill': {
    operatorId: 'antal',
    type: SkillType.COMBO_SKILL,
    name: 'antal.combo_skill.name',
    description: 'antal.combo_skill.description',
    cooldown: 16000,
    requirement: {
      synergyActivated: true
    }
  },
  'da_pan_combo_skill': {
    operatorId: 'da_pan',
    type: SkillType.COMBO_SKILL,
    name: 'da_pan.combo_skill.name',
    description: 'da_pan.combo_skill.description',
    cooldown: 16000,
    statusEffect: PhysicalStatus.SMASH,
    requirement: {
      synergyActivated: true,
      statusEffects: [PhysicalStatus.CRUSH]
    }
  },
  'catcher_combo_skill': {
    operatorId: 'catcher',
    type: SkillType.COMBO_SKILL,
    name: 'catcher.combo_skill.name',
    description: 'catcher.combo_skill.description',
    cooldown: 16000,
    statusEffect: SpecialEffect.SHIELD,
    requirement: {
      synergyActivated: true
    }
  },
  'alderia_combo_skill': {
    operatorId: 'alderia',
    type: SkillType.COMBO_SKILL,
    name: 'alderia.combo_skill.name',
    description: 'alderia.combo_skill.description',
    cooldown: 16000,
    statusEffect: ArtsReaction.CORROSION,
    requirement: {
      synergyActivated: true
    }
  }
}

// Ultimates (必殺技)
export const ULTIMATES: Record<string, Ultimate> = {
  'laevatain_ultimate': {
    operatorId: 'laevatain',
    type: SkillType.ULTIMATE,
    name: 'laevatain.ultimate.name',
    description: 'laevatain.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsInfliction.HEAT,
    cooldown: 10000
  },
  'gilberta_ultimate': {
    operatorId: 'gilberta',
    type: SkillType.ULTIMATE,
    name: 'gilberta.ultimate.name',
    description: 'gilberta.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsInfliction.NATURE,
    cooldown: 10000
  },
  'yvonne_ultimate': {
    operatorId: 'yvonne',
    type: SkillType.ULTIMATE,
    name: 'yvonne.ultimate.name',
    description: 'yvonne.ultimate.description',
    chargeGain: 75,
    statusEffect: ArtsReaction.FREEZE,
    cooldown: 10000
  },
  'endministrator_ultimate': {
    operatorId: 'endministrator',
    type: SkillType.ULTIMATE,
    name: 'endministrator.ultimate.name',
    description:'endministrator.ultimate.description',
    chargeGain: 80,
    cooldown: 10000
  },
  'pogranichnik_ultimate': {
    operatorId: 'pogranichnik',
    type: SkillType.ULTIMATE,
    name: 'pogranichnik.ultimate.name',
    description: 'pogranichnik.ultimate.description',
    chargeGain: 80,
    cooldown: 10000
  },
  'last_rite_ultimate': {
    operatorId: 'last_rite',
    type: SkillType.ULTIMATE,
    name: 'last_rite.ultimate.name',
    description: 'last_rite.ultimate.description',
    chargeGain: 85,
    cooldown: 10000
  },
  'ember_ultimate': {
    operatorId: 'ember',
    type: SkillType.ULTIMATE,
    name: 'ember.ultimate.name',
    description: 'ember.ultimate.description',
    chargeGain: 75,
    statusEffect: SpecialEffect.SHIELD,
    cooldown: 10000
  },
  'lifeng_ultimate': {
    operatorId: 'lifeng',
    type: SkillType.ULTIMATE,
    name: 'lifeng.ultimate.name',
    description: 'lifeng.ultimate.description',
    chargeGain: 80,
    statusEffect: PhysicalStatus.KNOCKDOWN,
    cooldown: 10000
  },
  'chen_qianyu_ultimate': {
    operatorId: 'chen_qianyu',
    type: SkillType.ULTIMATE,
    name: 'chen_qianyu.ultimate.name',
    description:'chen_qianyu.ultimate.description',
    chargeGain: 70,
    cooldown: 10000
  },
  'wolfgard_ultimate': {
    operatorId: 'wolfgard',
    type: SkillType.ULTIMATE,
    name: 'wolfgard.ultimate.name',
    description: 'wolfgard.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsReaction.COMBUSTION,
    cooldown: 10000
  },
  'avywenna_ultimate': {
    operatorId: 'avywenna',
    type: SkillType.ULTIMATE,
    name: 'avywenna.ultimate.name',
    description: 'avywenna.ultimate.description',
    chargeGain: 75,
    cooldown: 10000
  },
  'xaihi_ultimate': {
    operatorId: 'xaihi',
    type: SkillType.ULTIMATE,
    name: 'xaihi.ultimate.name',
    description: 'xaihi.ultimate.description',
    chargeGain: 70,
    cooldown: 10000
  },
  'alesh_ultimate': {
    operatorId: 'alesh',
    type: SkillType.ULTIMATE,
    name: 'alesh.ultimate.name',
    description: 'alesh.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsInfliction.CRYO,
    cooldown: 10000
  },
  'arclight_ultimate': {
    operatorId: 'arclight',
    type: SkillType.ULTIMATE,
    name: 'arclight.ultimate.name',
    description: 'arclight.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsReaction.SHOCK,
    cooldown: 10000
  },
  'snowshine_ultimate': {
    operatorId: 'snowshine',
    type: SkillType.ULTIMATE,
    name: 'snowshine.ultimate.name',
    description: 'snowshine.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsReaction.FREEZE,
    cooldown: 10000
  },
  'perlica_ultimate': {
    operatorId: 'perlica',
    type: SkillType.ULTIMATE,
    name: 'perlica.ultimate.name',
    description: 'perlica.ultimate.description',
    chargeGain: 85,
    cooldown: 10000
  },
  'da_pan_ultimate': {
    operatorId: 'da_pan',
    type: SkillType.ULTIMATE,
    name: 'da_pan.ultimate.name',
    description: 'da_pan.ultimate.description',
    chargeGain: 80,
    statusEffect: PhysicalStatus.KNOCKDOWN,
    cooldown: 10000
  },
  'antal_ultimate': {
    operatorId: 'antal',
    type: SkillType.ULTIMATE,
    name: 'antal.ultimate.name',
    description: 'antal.ultimate.description',
    chargeGain: 70,
    cooldown: 10000
  },
  'akekuri_ultimate': {
    operatorId: 'akekuri',
    type: SkillType.ULTIMATE,
    name: 'akekuri.ultimate.name',
    description: 'akekuri.ultimate.description',
    chargeGain: 70,
    cooldown: 10000
  },
  'estella_ultimate': {
    operatorId: 'estella',
    type: SkillType.ULTIMATE,
    name: 'estella.ultimate.name',
    description: 'estella.ultimate.description',
    chargeGain: 75,
    statusEffect: PhysicalStatus.LIFT,
    cooldown: 10000
  },
  'catcher_ultimate': {
    operatorId: 'catcher',
    type: SkillType.ULTIMATE,
    name: 'catcher.ultimate.name',
    description: 'catcher.ultimate.description',
    chargeGain: 80,
    statusEffect: PhysicalStatus.KNOCKDOWN,
    cooldown: 10000
  },
  'fluorite_ultimate': {
    operatorId: 'fluorite',
    type: SkillType.ULTIMATE,
    name: 'fluorite.ultimate.name',
    description: 'fluorite.ultimate.description',
    chargeGain: 75,
    cooldown: 10000
  },
  'alderia_ultimate': {
    operatorId: 'alderia',
    type: SkillType.ULTIMATE,
    name: 'alderia.ultimate.name',
    description: 'alderia.ultimate.description',
    chargeGain: 80,
    statusEffect: ArtsInfliction.NATURE,
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
