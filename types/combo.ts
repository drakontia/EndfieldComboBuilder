// Core game types for Arknights: Endfield combo builder

export enum SkillType {
  BATTLE_SKILL = 'battleSkill',
  COMBO_SKILL = 'comboSkill',
  ULTIMATE = 'ultimate',
}

export enum PhysicalStatus {
  VULNERABLE = 'vulnerable',
  LIFT = 'lift',
  KNOCKDOWN = 'knockdown',
  CRUSH = 'crush',
  BREACH = 'breach',
}

export enum ArtsInfliction {
  HEAT = 'heat',
  CRYO = 'cryo',
  ELECTRIC = 'electric',
  NATURE = 'nature',
}

export interface Character {
  id: string
  name: string
  imageUrl?: string
}

export interface ActionRequirement {
  statusEffects?: PhysicalStatus[] | ArtsInfliction[]
  synergyActivated?: boolean
}

export interface Skill {
  id: string
  characterId: string
  type: SkillType
  timing: number // milliseconds from start
  hitCount?: number // for normal attacks (1-5)
  statusEffect?: PhysicalStatus | ArtsInfliction
  cooldown?: number // milliseconds
  requirement?: ActionRequirement
}

export interface ComboState {
  name: string
  characters: (Character | null)[]
  actions: Skill[]
}

export interface CharacterState {
  characterId: string
  ultimateCharge: number // 0-100
  cooldowns: Map<SkillType, number> // remaining cooldown in ms
}

export interface EnemyStatusEffect {
  id: string
  effect: PhysicalStatus | ArtsInfliction
  startTime: number // milliseconds from start
  duration: number // milliseconds
  sourceActionId: string
}

export interface UltimateChargePoint {
  timing: number // milliseconds from start
  charge: number // 0-100
}
