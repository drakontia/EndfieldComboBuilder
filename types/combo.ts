// Core game types for Arknights: Endfield combo builder

export enum SkillType {
  NORMAL = 'normal',
  BATTLE_SKILL = 'battleSkill',
  COMBO_SKILL = 'comboSkill',
  ULTIMATE = 'ultimate',
}

export enum PhysicalStatus {
  VULNERABLE = 'vulnerable', // 脆弱
  LIFT = 'lift', // 浮遊
  KNOCKDOWN = 'knockdown', // 転倒
  SMASH = 'smash', // 猛撃
  SHATTER = 'shatter', // 破砕
  CRUSH = 'crush', // クラッシュ
}

export enum ArtsInfliction { // アーツ付着
  HEAT = 'heat',
  CRYO = 'cryo',
  ELECTRIC = 'electric',
  NATURE = 'nature',
}

export enum ArtsBurst { // アーツ爆発
  HEAT = 'heat',
  CRYO = 'cryo',
  ELECTRIC = 'electric',
  NATURE = 'nature',
}

export enum ArtsReaction { // アーツ異常
  COMBUSTION = 'combustion', // 燃焼
  SHOCK = 'shock', // 感電
  FREEZE = 'freeze', // 凍結
  CORROSION = 'corrosion', // 腐食
}

export enum SpecialEffect {
  ORIGINIUM_CRYSTALS = 'originium_crystals', // 源石の結晶
  SHIELD = 'shield', // シールド
  LINK = 'link', // リンク
}

export enum BuffDebuff {
  SHIELD = 'shield',
  WEAKEN = 'weaken',
  PROTECT = 'protect',
  SUSCEPTIBLE = 'susceptible',
  SLOW = 'slow',
  AMP = 'amp',
  LINK = 'link',
  DISPEL = 'dispel'
}

export enum CharcterType {
  GUARD = 'guard', // 前衛
  CASTER = 'caster', // 術師
  STRIKER = 'striker', // 突撃
  VANGUARD = 'vanguard', // 先鋒
  DEFENDER = 'defender', // 重装
  SUPPORTER = 'supporter' // 補助
}

export enum CharacterElement {
  PHYSICS = 'physics',
  HEAT = 'heat',
  CRYO = 'cryo',
  ELECTRIC = 'electric',
  NATURE = 'nature',
}

export interface Operator {
  name: string
  type: CharcterType
  element: CharacterElement
  rarity: number
  imageUrl?: string
}

export interface ActionRequirement {
  statusEffects?: (PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect)[]
  synergyActivated?: boolean
}

export interface BaseAttack {
  operatorId: string
  name: string
  description: string
  duration: number // milliseconds from start
  hitCount?: number // for normal attacks (1-5)
  statusEffect?: PhysicalStatus | ArtsInfliction | ArtsReaction
}

export interface Skill {
  operatorId: string
  name: string
  description: string
  type: SkillType
  statusEffect?: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect
}

export interface BattleSkill extends Skill {
  type: SkillType.BATTLE_SKILL
  skillPoints: number // 0-100
}

export interface ComboSkill extends Skill {
  type: SkillType.COMBO_SKILL
  requirement: ActionRequirement
  cooldown: number // milliseconds
}

export interface Ultimate extends Skill {
  type: SkillType.ULTIMATE
  chargeGain: number // 0-100
  cooldown: number // milliseconds
}

export interface ComboAction {
  id: string
  characterId: string
  type: SkillType
  timing: number
}

export interface ComboState {
  name: string
  characters: (Operator | null)[]
  actions: ComboAction[]
  timelineDurationMs?: number
  initialTeamSp?: number
  initialUltimateCharges?: number[]
}

export interface CharacterState {
  operatorId: string
  ultimateCharge: number // 0-100
  cooldowns: Map<SkillType, number> // remaining cooldown in ms
}

export interface EnemyStatusEffect {
  id: string
  effect: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect
  startTime: number // milliseconds from start
  duration: number // milliseconds
  sourceActionId: string
}

export interface UltimateChargePoint {
  timing: number // milliseconds from start
  charge: number // 0-100
}
