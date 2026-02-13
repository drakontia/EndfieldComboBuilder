// Core game types for Arknights: Endfield combo builder

export enum AttackType {
  NORMAL = 'normal',
  BATTLE_SKILL = 'battleSkill',
  SYNERGY_SKILL = 'synergySkill',
  ULTIMATE = 'ultimate',
}

export enum StatusEffect {
  BURN = 'burn',
  FREEZE = 'freeze',
  SHOCK = 'shock',
  POISON = 'poison',
  STUN = 'stun',
  WEAKNESS = 'weakness',
}

export interface Character {
  id: string
  name: string
  imageUrl?: string
}

export interface ActionRequirement {
  statusEffects?: StatusEffect[]
  synergyActivated?: boolean
}

export interface Action {
  id: string
  characterId: string
  type: AttackType
  timing: number // milliseconds from start
  hitCount?: number // for normal attacks (1-5)
  statusEffect?: StatusEffect
  cooldown?: number // milliseconds
  requirement?: ActionRequirement
}

export interface ComboState {
  name: string
  characters: (Character | null)[]
  actions: Action[]
}

export interface CharacterState {
  characterId: string
  ultimateCharge: number // 0-100
  cooldowns: Map<AttackType, number> // remaining cooldown in ms
}
