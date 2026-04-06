import { getNormalAttackStatusEffect } from '@/lib/data/attacks'
import { SkillType, PhysicalStatus, ArtsInfliction, ArtsReaction, BattleSkill, Ultimate, ComboSkill, SpecialEffect, Buff, Debuff } from '@/types/combo'

// Battle Skills (戦技)
export const BATTLE_SKILLS: Record<string, BattleSkill> = {
  'laevatain_battle_skill': {
    operatorId: 'laevatain',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.laevatain_battle_skill.name',
    description: 'skill.laevatain_battle_skill.description',
    statusEffect: [ArtsReaction.COMBUSTION],
    skillPoints: 100
  },
  'gilberta_battle_skill': {
    operatorId: 'gilberta',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.gilberta_battle_skill.name',
    description: 'skill.gilberta_battle_skill.description',
    statusEffect: [ArtsInfliction.NATURE],
    skillPoints: 100
  },
  'yvonne_battle_skill': {
    operatorId: 'yvonne',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.yvonne_battle_skill.name',
    description: 'skill.yvonne_battle_skill.description',
    statusEffect: [],
    skillPoints: 100
  },
  'endministrator_battle_skill': {
    operatorId: 'endministrator',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.endministrator_battle_skill.name',
    description: 'skill.endministrator_battle_skill.description',
    statusEffect: [PhysicalStatus.CRUSH],
    skillPoints: 100
  },
  'ardelia_battle_skill': {
    operatorId: 'ardelia',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.ardelia_battle_skill.name',
    description: 'skill.ardelia_battle_skill.description',
    statusEffect: [Debuff.PHYSICAL_SUSCEPTIBILITY, Debuff.ARTS_SUSCEPTIBILITY],
    skillPoints: 100
  },
  'pogranichnik_battle_skill': {
    operatorId: 'pogranichnik',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.pogranichnik_battle_skill.name',
    description: 'skill.pogranichnik_battle_skill.description',
    statusEffect: [PhysicalStatus.SHATTER],
    skillPoints: 100
  },
  'last_rite_battle_skill': {
    operatorId: 'last_rite',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.last_rite_battle_skill.name',
    description: 'skill.last_rite_battle_skill.description',
    statusEffect: [Buff.COLD_INFUSION],
    skillPoints: 100
  },
  'ember_battle_skill': {
    operatorId: 'ember',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.ember_battle_skill.name',
    description: 'skill.ember_battle_skill.description',
    statusEffect: [PhysicalStatus.VULNERABLE],
    skillPoints: 100
  },
  'lifeng_battle_skill': {
    operatorId: 'lifeng',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.lifeng_battle_skill.name',
    description: 'skill.lifeng_battle_skill.description',
    statusEffect: [PhysicalStatus.VULNERABLE],
    skillPoints: 100
  },
  'chen_qianyu_battle_skill': {
    operatorId: 'chen_qianyu',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.chen_qianyu_battle_skill.name',
    description: 'skill.chen_qianyu_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'wolfgard_battle_skill': {
    operatorId: 'wolfgard',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.wolfgard_battle_skill.name',
    description: 'skill.wolfgard_battle_skill.description',
    statusEffect: [ArtsInfliction.HEAT],
    skillPoints: 100
  },
  'avywenna_battle_skill': {
    operatorId: 'avywenna',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.avywenna_battle_skill.name',
    description: 'skill.avywenna_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'xaihi_battle_skill': {
    operatorId: 'xaihi',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.xaihi_battle_skill.name',
    description: 'skill.xaihi_battle_skill.description',
    statusEffect: [Buff.SUPPORT_CRYSTAL],
    skillPoints: 100
  },
  'alesh_battle_skill': {
    operatorId: 'alesh',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.alesh_battle_skill.name',
    description: 'skill.alesh_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'arclight_battle_skill': {
    operatorId: 'arclight',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.arclight_battle_skill.name',
    description: 'skill.arclight_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'snowshine_battle_skill': {
    operatorId: 'snowshine',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.snowshine_battle_skill.name',
    description: 'skill.snowshine_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'perlica_battle_skill': {
    operatorId: 'perlica',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.perlica_battle_skill.name',
    description: 'skill.perlica_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'da_pan_battle_skill': {
    operatorId: 'da_pan',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.da_pan_battle_skill.name',
    description: 'skill.da_pan_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'antal_battle_skill': {
    operatorId: 'antal',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.antal_battle_skill.name',
    description: 'skill.antal_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'akekuri_battle_skill': {
    operatorId: 'akekuri',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.akekuri_battle_skill.name',
    description: 'skill.akekuri_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'estella_battle_skill': {
    operatorId: 'estella',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.estella_battle_skill.name',
    description: 'skill.estella_battle_skill.description',
    statusEffect: [ArtsInfliction.CRYO],
    skillPoints: 100
  },
  'catcher_battle_skill': {
    operatorId: 'catcher',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.catcher_battle_skill.name',
    description: 'skill.catcher_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'fluorite_battle_skill': {
    operatorId: 'fluorite',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.fluorite_battle_skill.name',
    description: 'skill.fluorite_battle_skill.description',
    statusEffect: [PhysicalStatus.LIFT],
    skillPoints: 100
  },
  'tangtang_battle_skill': {
    // 水竜巻を引き起こし、敵に寒冷付着を付与する。
    operatorId: 'tangtang',
    type: SkillType.BATTLE_SKILL,
    name: 'skill.tangtang_battle_skill.name',
    description: 'skill.tangtang_battle_skill.description',
    statusEffect: [ArtsInfliction.CRYO],
    skillPoints: 100
  }
}

// Combo Skills (連携技)
export const COMBO_SKILLS: Record<string, ComboSkill> = {
  'laevatain_combo_skill': {
    // 敵が燃焼または腐食状態になったときに発動可能。
    // 燃焼または腐食状態の敵の足元から炎を噴き上げ、灼熱ダメージを与える。
    // 敵に命中すると、劫火を1回獲得する。
    // 命中した敵1体につき、追加で必殺チャージを回復する。
    operatorId: 'laevatain',
    type: SkillType.COMBO_SKILL,
    name: 'laevatain.combo_skill.name',
    description: 'laevatain.combo_skill.description',
    cooldown: 16000,
    statusEffect: [],
    requirement: {
      statusEffects: [ArtsReaction.COMBUSTION, ArtsReaction.CORROSION]
    }
  },
  'gilberta_combo_skill': {
    // 敵がアーツ異常状態になった場合に発動可能。
    // 短時間のチャージ後、重力で目標および周囲の敵を引き寄せ、
    // 自然ダメージを与え、強制的に浮遊効果を発動させる。
    operatorId: 'gilberta',
    type: SkillType.COMBO_SKILL,
    name: 'gilberta.combo_skill.name',
    description: 'gilberta.combo_skill.description',
    cooldown: 16000,
    statusEffectForcibly: [PhysicalStatus.LIFT],
    requirement: {
      statusEffects: [ArtsReaction.COMBUSTION, ArtsReaction.FREEZE, ArtsReaction.SHOCK, ArtsReaction.CORROSION]
    }
  },
  'yvonne_combo_skill': {
    // 操作中のオペレーターが凍結状態の敵に重攻撃を与えた後に発動可能。
    // 目標の近くにエネルギーを放出し続けるアイスちゃんを配置し、
    // 周囲の敵に寒冷ダメージを与えながら、敵を中心に牽引する。
    // 持続時間が終了すると、アイスちゃんは自爆し、周囲の敵を強制的に凍結状態にして寒冷ダメージを与える。
    // 連携技が敵に命中すると、追加で必殺チャージを回復する（複数の敵に命中しても回復は1回のみ）。
    operatorId: 'yvonne',
    type: SkillType.COMBO_SKILL,
    name: 'yvonne.combo_skill.name',
    description: 'yvonne.combo_skill.description',
    cooldown: 16000,
    statusEffectForcibly: [ArtsReaction.FREEZE],
    requirement: {
      statusEffects: [ArtsReaction.FREEZE],
      requiresHeavyAttack: true
    }
  },
  'endministrator_combo_skill': {
    // チーム内の他のオペレーターの連携技でダメージを与えたときに発動可能。
    // 敵の近くに突進し、物理ダメージを与え、源石の結晶を付与して一定時間封印する。
    // 物理異常を与えるかクラッシュを付与すると、源石の結晶が消費され、追加の物理ダメージを与える。
    operatorId: 'endministrator',
    type: SkillType.COMBO_SKILL,
    name: 'endministrator.combo_skill.name',
    description: 'endministrator.combo_skill.description',
    cooldown: 16000,
    statusEffect: [SpecialEffect.ORIGINIUM_CRYSTALS],
    requirement: {
      requiresTeamComboSkillDamage: true
    }
  },
  'ardelia_combo_skill': {
    // 操作中のオペレーターがクラッシュまたはアーツ付着状態でない敵に重攻撃を与えると発動可能。
    // 敵に火山雲を放ち、接近後に自然ダメージを与える。
    // 火山雲は敵を追尾し、そのあと爆発する。
    // 周囲の他の敵には、そのダメージの半分の自然ダメージを与え、強制的に短時間腐食状態にする。
    operatorId: 'ardelia',
    type: SkillType.COMBO_SKILL,
    name: 'ardelia.combo_skill.name',
    description: 'ardelia.combo_skill.description',
    cooldown: 16000,
    statusEffectForcibly: [ArtsReaction.CORROSION],
    requirement: {
      requiresHeavyAttack: true,
      excludedStatusEffects: [
        PhysicalStatus.CRUSH,
        ArtsInfliction.HEAT,
        ArtsInfliction.CRYO,
        ArtsInfliction.ELECTRIC,
        ArtsInfliction.NATURE
      ]
    }
  },
  'pogranichnik_combo_skill': {
    // 敵が猛撃または破砕によってクラッシュ重ね掛け回数が消費された場合に発動可能。
    // 消費した最大クラッシュ重ね掛け回数に応じて、敵に斬撃を行う（最大3回）。
    // 斬撃ごとに物理ダメージを与え、SPを一定量回復する。
    // 斬撃数が多いほど、ダメージとSP回復量がアップする。
    // 4回クラッシュを消費した場合、3回目の斬撃が強化される。
    operatorId: 'pogranichnik',
    type: SkillType.COMBO_SKILL,
    name: 'pogranichnik.combo_skill.name',
    description: 'pogranichnik.combo_skill.description',
    cooldown: 16000,
    requirement: {
      requiresCrashStackConsumptionBy: [PhysicalStatus.CRUSH, PhysicalStatus.SHATTER]
    }
  },
  'last_rite_combo_skill': {
    // 敵の寒冷付着状態が3段階以上の場合に発動可能。
    // 敵に氷柱を生成し、斬撃で砕く。敵の寒冷付着をすべて消費し、
    // 消費した寒冷付着段階に応じて寒冷ダメージを与え、必殺チャージを回復する
    operatorId: 'last_rite',
    type: SkillType.COMBO_SKILL,
    name: 'last_rite.combo_skill.name',
    description: 'last_rite.combo_skill.description',
    cooldown: 16000,
    requirement: {
      statusEffectStackRequirements: [
        { effect: ArtsInfliction.CRYO, minStacks: 3 }
      ]
    }
  },
  'ember_combo_skill': {
    // 操作中のオペレーターが攻撃を受けた場合に発動可能。
    // 敵に向かって飛び上がり、重い打撃を放つ。
    // 物理ダメージを与え、転倒効果を付与する。
    // 操作中のオペレーターのHPを回復し、回復量は意志の値に応じて追加でアップする。
    operatorId: 'ember',
    type: SkillType.COMBO_SKILL,
    name: 'ember.combo_skill.name',
    description: 'ember.combo_skill.description',
    cooldown: 16000,
    statusEffect: [PhysicalStatus.KNOCKDOWN],
    requirement: {}
  },
  'lifeng_combo_skill': {
    // 物理脆弱または破砕効果が付与されている敵が、
    // 操作中のオペレーターの重攻撃を受けた場合に発動可能。
    // 化身を放ち、槍で突き刺す。物理ダメージを与え、リンク状態を獲得する
    operatorId: 'lifeng',
    type: SkillType.COMBO_SKILL,
    name: 'lifeng.combo_skill.name',
    description: 'lifeng.combo_skill.description',
    cooldown: 16000,
    statusEffect: [Buff.LINK],
    requirement: {
      statusEffects: [Debuff.PHYSICAL_SUSCEPTIBILITY, PhysicalStatus.SHATTER],
      requiresHeavyAttack: true
    }
  },
  'chen_qianyu_combo_skill': {
    // 敵がクラッシュ状態になったときに発動可能。
    // 駆け抜けながら連続斬撃を行い、進路上のすべての敵に物理ダメージと浮遊効果を与える。
    operatorId: 'chen_qianyu',
    type: SkillType.COMBO_SKILL,
    name: 'chen_qianyu.combo_skill.name',
    description: 'chen_qianyu.combo_skill.description',
    cooldown: 16000,
    statusEffect: [PhysicalStatus.LIFT],
    requirement: {
      statusEffects: [PhysicalStatus.VULNERABLE]
    }
  },
  'wolfgard_combo_skill': {
    // 敵がアーツ付着状態になったときに発動可能。
    // 目標位置にフラググレネードを投げ、地面に落下すると爆発する。
    // 範囲内の敵に灼熱ダメージを与え、灼熱付着を付与する。
    operatorId: 'wolfgard',
    type: SkillType.COMBO_SKILL,
    name: 'wolfgard.combo_skill.name',
    description: 'wolfgard.combo_skill.description',
    cooldown: 16000,
    statusEffect: [ArtsInfliction.HEAT],
    requirement: {
      statusEffects: [ArtsInfliction.HEAT, ArtsInfliction.CRYO, ArtsInfliction.ELECTRIC, ArtsInfliction.NATURE]
    }
  },
  'avywenna_combo_skill': {
    // 操作中のオペレーターが電磁付着、または感電状態の敵に重攻撃を与えた後に発動可能。
    // ジャンプしながら敵に3本の雷槍を投げ、範囲内の敵に1回電磁ダメージを与える
    operatorId: 'avywenna',
    type: SkillType.COMBO_SKILL,
    name: 'avywenna.combo_skill.name',
    description: 'avywenna.combo_skill.description',
    cooldown: 16000,
    requirement: {
      statusEffects: [ArtsInfliction.ELECTRIC, ArtsReaction.SHOCK],
      requiresHeavyAttack: true
    }
  },
  'xaihi_combo_skill': {
    // サポートクリスタルによるHP回復の回数が0になった場合に発動可能。
    // 短時間のチャージ後、サポートクリスタルを敵に投げて寒冷ダメージを与え、寒冷付着を付与する。
    operatorId: 'xaihi',
    type: SkillType.COMBO_SKILL,
    name: 'xaihi.combo_skill.name',
    description: 'xaihi.combo_skill.description',
    cooldown: 16000,
    statusEffect: [ArtsInfliction.CRYO],
    requirement: {
      requiresSupportCrystalRecoveryZero: true
    }
  },
  'alesh_combo_skill': {
    // 付近の敵のアーツ異常または源石の結晶が消費された場合に発動可能。
    // 敵の足元に穴を開けて鱗獣を釣り上げる。物理ダメージを与え、SPを一定量回復する。
    // 一定確率で珍鱗を釣り上げ、ダメージが大幅にアップし、SPをさらに回復する。
    // アーツ異常と源石の結晶の継続時間は10秒間。源石の結晶は物理異常かクラッシュが付与されると消費される。
    operatorId: 'alesh',
    type: SkillType.COMBO_SKILL,
    name: 'alesh.combo_skill.name',
    description: 'alesh.combo_skill.description',
    cooldown: 16000,
    requirement: {
      requiresStatusEffectConsumed: [ArtsReaction.COMBUSTION, ArtsReaction.FREEZE, ArtsReaction.SHOCK, ArtsReaction.CORROSION, SpecialEffect.ORIGINIUM_CRYSTALS]
    }
  },
  'fluorite_combo_skill': {
    // 敵の寒冷付着または自然付着の付着段階が2以上の場合に発動可能。
    // 目標の敵に射撃を行い、特殊な爆発を引き起こす。
    // 敵に自然ダメージを与え、対応属性のアーツ付着を付与する。
    operatorId: 'fluorite',
    type: SkillType.COMBO_SKILL,
    name: 'fluorite.combo_skill.name',
    description: 'fluorite.combo_skill.description',
    cooldown: 16000,
    statusEffect: [ArtsInfliction.NATURE],
    requirement: {
      statusEffectStackRequirements: [
        { effect: ArtsInfliction.CRYO, minStacks: 2 },
        { effect: ArtsInfliction.NATURE, minStacks: 2 }
      ]
    }
  },
  'akekuri_combo_skill': {
    // 敵がブレイク状態になるかブレイク点に到達した場合に発動可能。
    // 往復移動の突撃で2回物理ダメージを与え、SPを一定量回復する。
    operatorId: 'akekuri',
    type: SkillType.COMBO_SKILL,
    name: 'akekuri.combo_skill.name',
    description: 'akekuri.combo_skill.description',
    cooldown: 16000,
    requirement: {}
  },
  'arclight_combo_skill': {
    // 敵が感電状態になるか感電状態が消費された場合に発動可能。
    // 瞬時に敵の近くに移動して連続斬撃を行い、物理ダメージを与え、SPを一定量回復する。
    operatorId: 'arclight',
    type: SkillType.COMBO_SKILL,
    name: 'arclight.combo_skill.name',
    description: 'arclight.combo_skill.description',
    cooldown: 16000,
    requirement: {
      statusEffects: [ArtsReaction.SHOCK]
    }
  },
  'snowshine_combo_skill': {
    // 操作中のオペレーターが攻撃を受け、HPが60%未満になった場合に発動可能。
    // スノーシャインはそのオペレーターに救援アシスタントを投げ、
    // 命中時に周囲のオペレーターを大きく回復させる。
    // さらに一定時間、範囲内のオペレーターを継続的に治療する。回復量は意思の値に応じて追加でアップする。
    operatorId: 'snowshine',
    type: SkillType.COMBO_SKILL,
    name: 'snowshine.combo_skill.name',
    description: 'snowshine.combo_skill.description',
    cooldown: 16000,
    requirement: {}
  },
  'perlica_combo_skill': {
    // 操作中のオペレーターが敵に重攻撃を与えた場合に発動可能。
    // 蓄積された電磁エネルギーを放出して敵を攻撃し、
    // 電磁ダメージを与え、強制的に短時間感電状態にする。
    operatorId: 'perlica',
    type: SkillType.COMBO_SKILL,
    name: 'perlica.combo_skill.name',
    description: 'perlica.combo_skill.description',
    cooldown: 16000,
    statusEffectForcibly: [ArtsReaction.SHOCK],
    requirement: {
      requiresHeavyAttack: true
    }
  },
  'estella_combo_skill': {
    // 敵が凍結状態に入った場合に発動可能。
    // 素早く敵の近くに移動し、一定範囲内の敵に物理ダメージを与え、強制的に浮遊効果を発動させる。
    // 凍結状態の敵に命中した場合、追加でダメージを与え、物理脆弱を付与する。
    operatorId: 'estella',
    type: SkillType.COMBO_SKILL,
    name: 'estella.combo_skill.name',
    description: 'estella.combo_skill.description',
    cooldown: 16000,
    statusEffectForcibly: [PhysicalStatus.LIFT],
    requirement: {
      statusEffects: [ArtsReaction.FREEZE]
    }
  },
  'antal_combo_skill': {
    // フォーカス中の敵が物理異常またはアーツ付着状態になった場合に発動可能。
    // 敵に1回エネルギー爆発を引き起こし、電磁ダメージを与える。さらに、物理異常またはアーツ付着を再度付与する
    operatorId: 'antal',
    type: SkillType.COMBO_SKILL,
    name: 'antal.combo_skill.name',
    description: 'antal.combo_skill.description',
    cooldown: 16000,
    requirement: {}
  },
  'da_pan_combo_skill': {
    // 敵のクラッシュ重ね掛けが4回に達した場合に発動可能。
    // 鍋を振り回して敵に高い物理ダメージを与え、猛撃効果を付与する。
    // この1回の猛撃はダメージが追加でアップする。
    operatorId: 'da_pan',
    type: SkillType.COMBO_SKILL,
    name: 'da_pan.combo_skill.name',
    description: 'da_pan.combo_skill.description',
    cooldown: 16000,
    statusEffect: [PhysicalStatus.CRUSH],
    requirement: {
      statusEffects: [PhysicalStatus.CRUSH]
    }
  },
  'catcher_combo_skill': {
    // 敵がチャージを開始するか操作中のオペレーターが攻撃を受け、HPが40%未満になった場合に発動可能。
    // 拳で前方を強く叩きつけ、敵に物理ダメージを与える。
    // 同時に、自身と味方オペレーター1人（操作中のオペレーターを優先）にシールドを付与する。シールドの最大値は防御力に応じて追加でアップする。
    operatorId: 'catcher',
    type: SkillType.COMBO_SKILL,
    name: 'catcher.combo_skill.name',
    description: 'catcher.combo_skill.description',
    cooldown: 16000,
    statusEffect: [Buff.SHIELD],
    requirement: {}
  },
  'tangtang_combo_skill': {
    // 敵が寒冷付着またはアーツ爆発状態になったときに発動可能。
    // 激流を解き放ち、敵に寒冷ダメージを与える。
    operatorId: 'tangtang',
    type: SkillType.COMBO_SKILL,
    name: 'tangtang.combo_skill.name',
    description: 'tangtang.combo_skill.description',
    cooldown: 12000,
    statusEffect: [ArtsInfliction.CRYO],
    requirement: {
      statusEffects: [ArtsInfliction.CRYO]
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
    statusEffect: [ArtsInfliction.HEAT],
    cooldown: 10000
  },
  'gilberta_ultimate': {
    operatorId: 'gilberta',
    type: SkillType.ULTIMATE,
    name: 'gilberta.ultimate.name',
    description: 'gilberta.ultimate.description',
    chargeGain: 80,
    statusEffect: [ArtsInfliction.NATURE],
    cooldown: 10000
  },
  'yvonne_ultimate': {
    operatorId: 'yvonne',
    type: SkillType.ULTIMATE,
    name: 'yvonne.ultimate.name',
    description: 'yvonne.ultimate.description',
    chargeGain: 75,
    statusEffect: [ArtsReaction.FREEZE],
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
    statusEffect: [Buff.SHIELD],
    cooldown: 10000
  },
  'lifeng_ultimate': {
    operatorId: 'lifeng',
    type: SkillType.ULTIMATE,
    name: 'lifeng.ultimate.name',
    description: 'lifeng.ultimate.description',
    chargeGain: 80,
    statusEffect: [PhysicalStatus.KNOCKDOWN],
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
    statusEffect: [ArtsReaction.COMBUSTION],
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
    statusEffect: [ArtsInfliction.CRYO],
    cooldown: 10000
  },
  'arclight_ultimate': {
    operatorId: 'arclight',
    type: SkillType.ULTIMATE,
    name: 'arclight.ultimate.name',
    description: 'arclight.ultimate.description',
    chargeGain: 80,
    statusEffect: [ArtsReaction.SHOCK],
    cooldown: 10000
  },
  'snowshine_ultimate': {
    operatorId: 'snowshine',
    type: SkillType.ULTIMATE,
    name: 'snowshine.ultimate.name',
    description: 'snowshine.ultimate.description',
    chargeGain: 80,
    statusEffect: [ArtsReaction.FREEZE],
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
    statusEffect: [PhysicalStatus.KNOCKDOWN],
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
    statusEffect: [PhysicalStatus.LIFT],
    cooldown: 10000
  },
  'catcher_ultimate': {
    operatorId: 'catcher',
    type: SkillType.ULTIMATE,
    name: 'catcher.ultimate.name',
    description: 'catcher.ultimate.description',
    chargeGain: 80,
    statusEffect: [PhysicalStatus.KNOCKDOWN],
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
  'ardelia_ultimate': {
    operatorId: 'ardelia',
    type: SkillType.ULTIMATE,
    name: 'ardelia.ultimate.name',
    description: 'ardelia.ultimate.description',
    chargeGain: 80,
    statusEffect: [ArtsInfliction.NATURE],
    cooldown: 10000
  },
  'tangtang_ultimate': {
    operatorId: 'tangtang',
    type: SkillType.ULTIMATE,
    name: 'tangtang.ultimate.name',
    description: 'tangtang.ultimate.description',
    chargeGain: 90,
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
