// Operator data for Arknights: Endfield
import { Operator, CharcterType, CharacterElement } from '@/types/combo'

export const OPERATORS: Record<string, Operator> = {
  // Laevatain
  'laevatain': {
    name: 'character.laevatain.name',
    type: CharcterType.STRIKER,
    element: CharacterElement.HEAT,
    rarity: 6,
    imageUrl: '/images/operators/laevatain.png'
  },
  // Gilberta
  'gilberta': {
    name: 'character.gilberta.name',
    type: CharcterType.SUPPORTER,
    element: CharacterElement.NATURE,
    rarity: 6,
    imageUrl: '/images/operators/gilberta.png'
  },
  // Yvonne
  'yvonne': {
    name: 'character.yvonne.name',
    type: CharcterType.CASTER,
    element: CharacterElement.CRYO,
    rarity: 6,
    imageUrl: '/images/operators/yvonne.png'
  },
  'endministrator': {
    name: 'character.endministrator.name',
    type: CharcterType.GUARD,
    element: CharacterElement.PHYSICS,
    rarity: 6,
    imageUrl: '/images/operators/endministrator.png'
  },
  'ardelia': {
    name: 'character.ardelia.name',
    type: CharcterType.SUPPORTER,
    element: CharacterElement.NATURE,
    rarity: 6,
    imageUrl: '/images/operators/ardelia.png'
  },
  'pogranichnik': {
    name: 'character.pogranichnik.name',
    type: CharcterType.VANGUARD,
    element: CharacterElement.PHYSICS,
    rarity: 6,
    imageUrl: '/images/operators/pogranichnik.png'
  },
  'last_rite': {
    name: 'character.last_rite.name',
    type: CharcterType.STRIKER,
    element: CharacterElement.CRYO,
    rarity: 6,
    imageUrl: '/images/operators/last_rite.png'
  },
  'ember': {  
    name: 'character.ember.name',
    type: CharcterType.DEFENDER,
    element: CharacterElement.HEAT,
    rarity: 6,
    imageUrl: '/images/operators/ember.png'
  },
  'lifeng': {
    name: 'character.lifeng.name',
    type: CharcterType.GUARD,
    element: CharacterElement.PHYSICS,
    rarity: 6,
    imageUrl: '/images/operators/lifeng.png'
  },
  'chen_qianyu': {
    name: 'character.chen_qianyu.name',
    type: CharcterType.GUARD,
    element: CharacterElement.PHYSICS,
    rarity: 5,
    imageUrl: '/images/operators/chen_qianyu.png'
  },
  'wolfgard': {
    name: 'character.wolfgard.name',
    type: CharcterType.CASTER,
    element: CharacterElement.HEAT,
    rarity: 5,
    imageUrl: '/images/operators/wolfgard.png'
  },
  // Avywenna
  'avywenna': {
    name: 'character.avywenna.name',
    type: CharcterType.STRIKER,
    element: CharacterElement.ELECTRIC,
    rarity: 5,
    imageUrl: '/images/operators/avywenna.png'
  },
  // Xaihi
  'xaihi': {
    name: 'character.xaihi.name',
    type: CharcterType.SUPPORTER,
    element: CharacterElement.CRYO,
    rarity: 5,
    imageUrl: '/images/operators/xaihi.png'
  },
  // Alesh
  'alesh': {
    name: 'character.alesh.name',
    type: CharcterType.VANGUARD,
    element: CharacterElement.CRYO,
    rarity: 5,
    imageUrl: '/images/operators/alesh.png'
  },
  // Arclight
  'arclight': {
    name: 'character.arclight.name',
    type: CharcterType.VANGUARD,
    element: CharacterElement.ELECTRIC,
    rarity: 5,
    imageUrl: '/images/operators/arclight.png'
  },
  // Snowshine
  'snowshine': {
    name: 'character.snowshine.name',
    type: CharcterType.DEFENDER,
    element: CharacterElement.CRYO,
    rarity: 5,
    imageUrl: '/images/operators/snowshine.png'
  },
  // Perlica
  'perlica': {
    name: 'character.perlica.name',
    type: CharcterType.CASTER,
    element: CharacterElement.ELECTRIC,
    rarity: 5,
    imageUrl: '/images/operators/perlica.png'
  },
  // Da Pan
  'da_pan': {
    name: 'character.da_pan.name',
    type: CharcterType.STRIKER,
    element: CharacterElement.PHYSICS,
    rarity: 5,
    imageUrl: '/images/operators/da_pan.png'
  },
  // Antal
  'antal': {
    name: 'character.antal.name',
    type: CharcterType.SUPPORTER,
    element: CharacterElement.ELECTRIC,
    rarity: 4,
    imageUrl: '/images/operators/antal.png'
  },
  // Akekuri
  'akekuri': {
    name: 'character.akekuri.name',
    type: CharcterType.VANGUARD,
    element: CharacterElement.HEAT,
    rarity: 4,
    imageUrl: '/images/operators/akekuri.png'
  },
  // Estella
  'estella': {
    name: 'character.estella.name',
    type: CharcterType.GUARD,
    element: CharacterElement.CRYO,
    rarity: 4,
    imageUrl: '/images/operators/estella.png'
  },
  // Catcher
  'catcher': {
    name: 'character.catcher.name',
    type: CharcterType.DEFENDER,
    element: CharacterElement.PHYSICS,
    rarity: 4,
    imageUrl: '/images/operators/catcher.png'
  },
  // Fluorite
  'fluorite': {
    name: 'character.fluorite.name',
    type: CharcterType.CASTER,
    element: CharacterElement.NATURE,
    rarity: 4,
    imageUrl: '/images/operators/fluorite.png'
  },
  // Tangtang
  'tangtang': {
    name: 'character.tangtang.name',
    type: CharcterType.CASTER,
    element: CharacterElement.CRYO,
    rarity: 6,
    imageUrl: '/images/operators/tangtang.png'
  }
}

export const getOperatorIdByName = (name: string) => {
  const matched = Object.entries(OPERATORS).find(([, operator]) => operator.name === name)
  return matched?.[0] ?? null
}
