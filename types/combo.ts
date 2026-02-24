// Core game types for Arknights: Endfield combo builder

export enum SkillType {
  NORMAL = 'normal',
  BATTLE_SKILL = 'battleSkill',
  COMBO_SKILL = 'comboSkill',
  ULTIMATE = 'ultimate',
}

export enum PhysicalStatus {
  VULNERABLE = 'vulnerable', // クラッシュ
  LIFT = 'lift', // 浮遊
  KNOCKDOWN = 'knockdown', // 転倒
  CRUSH = 'crush', // 猛撃
  SHATTER = 'shatter' // 破砕
}

export enum ArtsInfliction { // アーツ付着
  HEAT = 'heat', // 灼熱
  CRYO = 'cryo', // 寒冷
  ELECTRIC = 'electric', // 電磁
  NATURE = 'nature', // 自然
}

export enum ArtsBurst { // アーツ爆発
  HEAT = 'heat', // 灼熱
  CRYO = 'cryo', // 寒冷
  ELECTRIC = 'electric', // 電磁
  NATURE = 'nature', // 自然
}

export enum ArtsReaction { // アーツ異常
  COMBUSTION = 'combustion', // 燃焼
  SHOCK = 'shock', // 感電
  FREEZE = 'freeze', // 凍結
  CORROSION = 'corrosion', // 腐食
}

export enum SpecialEffect {
  ORIGINIUM_CRYSTALS = 'originium_crystals', // 源石の結晶
}

export enum Buff {
  SHIELD = 'shield', // シールド
  PROTECT = 'protect', // 加護
  AMP = 'amp', // 増幅
  LINK = 'link', // リンク
  DISPEL = 'dispel', // 浄化
  SUPPORT_CRYSTAL = 'support_crystal' // サポートクリスタル
}

export enum Debuff {
  WEAKEN = 'weaken', // 弱体化
  SUSCEPTIBLE = 'susceptible', // 脆弱
  SLOW = 'slow', // スロー
  PHYSICAL_SUSCEPTIBILITY = 'physical_susceptibility', // 物理脆弱
  ARTS_SUSCEPTIBILITY = 'arts_susceptibility' // アーツ脆弱
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
  statusEffects?: (PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff)[]
  statusEffectStackRequirements?: StatusEffectStackRequirement[]
  excludedStatusEffects?: (PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff)[]
  requiresHeavyAttack?: boolean
  requiresTeamComboSkillDamage?: boolean
  requiresCrashStackConsumptionBy?: PhysicalStatus[]
  requiresSupportCrystalRecoveryZero?: boolean
  requiresStatusEffectConsumed?: (ArtsReaction | SpecialEffect)[] // アーツ異常または特殊効果が消費された時（継続時間終了または特定条件による消費）
}

export interface StatusEffectStackRequirement {
  effect: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff
  minStacks: number
}

export interface BaseAttack {
  operatorId: string
  name: string
  description: string
  duration: number // milliseconds from start
  hitCount?: number // for normal attacks (1-5)
  statusEffect?: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff
  stagger?: number // スタッガーメーターダメージ
}

export interface Skill {
  operatorId: string
  name: string
  description: string
  type: SkillType
  statusEffect?: (PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff)[]
  statusEffectForcibly?: (PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff)[]
  stagger?: number // スタッガーメーターダメージ
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
  operatorSupportCrystalRecoveryCount?: number
  initialEnemyStaggerMeter?: number
}

export interface CharacterState {
  operatorId: string
  ultimateCharge: number // 0-100
  cooldowns: Map<SkillType, number> // remaining cooldown in ms
}

export interface EnemyStatusEffect {
  id: string
  effect: PhysicalStatus | ArtsInfliction | ArtsReaction | SpecialEffect | Buff | Debuff
  startTime: number // milliseconds from start
  duration: number // milliseconds
  sourceActionId: string
}

export interface UltimateChargePoint {
  timing: number // milliseconds from start
  charge: number // 0-100
}
