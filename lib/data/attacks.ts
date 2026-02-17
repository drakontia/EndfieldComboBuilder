// Attack skills data for Arknights: Endfield
import { BaseAttack } from '@/types/combo'

export const NORMAL_ATTACK_DEFAULT_DURATION_MS = 3000

// Normal Attacks (通常攻撃)
export const NORMAL_ATTACKS: Record<string, BaseAttack> = {
  'endministrator_base_attack': {
    operatorId: 'endministrator',
    name: 'endministrator.base_attack.name',
    description: 'endministrator.base_attack.description',
    duration: 3633
  },
  'ardelia_base_attack': {
    operatorId: 'ardelia',
    name: 'ardelia.base_attack.name',
    description: 'ardelia.base_attack.description',
    duration: 3517
  },
  'pogranichnik_base_attack': {
    operatorId: 'pogranichnik',
    name: 'pogranichnik.base_attack.name',
    description: 'pogranichnik.base_attack.description',
    duration: 3450
  },
  'last_rite_base_attack': {
    operatorId: 'last_rite',
    name: 'last_rite.base_attack.name',
    description: 'last_rite.base_attack.description',
    duration: 4433
  },
  'ember_base_attack': {
    operatorId: 'ember',
    name: 'ember.base_attack.name',
    description: 'ember.base_attack.description',
    duration: 4033
  },
  'lifeng_base_attack': {
    operatorId: 'lifeng',
    name: 'lifeng.base_attack.name',
    description: 'lifeng.base_attack.description',
    duration: 3067
  },
  'chen_qianyu_base_attack': {
    operatorId: 'chen_qianyu',
    name: 'chen_qianyu.base_attack.name',
    description: 'chen_qianyu.base_attack.description',
    duration: 2817
  },
  'avywenna_base_attack': {
    operatorId: 'avywenna',
    name: 'avywenna.base_attack.name',
    description: 'avywenna.base_attack.description',
    duration: 3167
  },
  'gilberta_base_attack': {
    operatorId: 'gilberta',
    name: 'gilberta.base_attack.name',
    description: 'gilberta.base_attack.description',
    duration: 3133
  },
  'laevatain_base_attack': {
    operatorId: 'laevatain',
    name: 'laevatain.base_attack.name',
    description: 'laevatain.base_attack.description',
    duration: 3300
  },
  'xaihi_base_attack': {
    operatorId: 'xaihi',
    name: 'xaihi.base_attack.name',
    description: 'xaihi.base_attack.description',
    duration: 2967
  },
  'wolfgard_base_attack': {
    operatorId: 'wolfgard',
    name: 'wolfgard.base_attack.name',
    description: 'wolfgard.base_attack.description',
    duration: 3600
  },
  'alesh_base_attack': {
    operatorId: 'alesh',
    name: 'alesh.base_attack.name',
    description: 'alesh.base_attack.description',
    duration: 3167
  },
  'fluorite_base_attack': {
    operatorId: 'fluorite',
    name: 'fluorite.base_attack.name',
    description: 'fluorite.base_attack.description',
    duration: 3017
  },
  'akekuri_base_attack': {
    operatorId: 'akekuri',
    name: 'akekuri.base_attack.name',
    description: 'akekuri.base_attack.description',
    duration: 3017
  },
  'arclight_base_attack': {
    operatorId: 'arclight',
    name: 'arclight.base_attack.name',
    description: 'arclight.base_attack.description',
    duration: 2767
  },
  'snowshine_base_attack': {
    operatorId: 'snowshine',
    name: 'snowshine.base_attack.name',
    description: 'snowshine.base_attack.description',
    duration: 3950
  },
  'perlica_base_attack': {
    operatorId: 'perlica',
    name: 'perlica.base_attack.name',
    description: 'perlica.base_attack.description',
    duration: 3050
  },
  'estella_base_attack': {
    operatorId: 'estella',
    name: 'estella.base_attack.name',
    description: 'estella.base_attack.description',
    duration: 3633
  },
  'antal_base_attack': {
    operatorId: 'antal',
    name: 'antal.base_attack.name',
    description: 'antal.base_attack.description',
    duration: 2967
  },
  'da_pan_base_attack': {
    operatorId: 'da_pan',
    name: 'da_pan.base_attack.name',
    description: 'da_pan.base_attack.description',
    duration: 3600
  },
  'catcher_base_attack': {
    operatorId: 'catcher',
    name: 'catcher.base_attack.name',
    description: 'catcher.base_attack.description',
    duration: 3817
  },
  'yvonne_base_attack': {
    operatorId: 'yvonne',
    name: 'yvonne.base_attack.name',
    description: 'yvonne.base_attack.description',
    duration: 3317
  }
}

export const getNormalAttackDurationMs = (operatorId: string) => {
  const attack = NORMAL_ATTACKS[`${operatorId}_base_attack`]
  return attack?.duration ?? NORMAL_ATTACK_DEFAULT_DURATION_MS
}

export const getNormalAttackStatusEffect = (operatorId: string) => {
  return NORMAL_ATTACKS[`${operatorId}_base_attack`]?.statusEffect
}
