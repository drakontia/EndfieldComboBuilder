// Operator data for Arknights: Endfield

export interface OperatorData {
  id: string
  name: {
    ja: string
    en: string
  }
  class: string
  rarity: number
  imageUrl?: string
}

export const OPERATORS: OperatorData[] = [
  {
    id: '1',
    name: {
      ja: 'オペレーター1',
      en: 'Operator 1'
    },
    class: 'vanguard',
    rarity: 4
  },
  {
    id: '2',
    name: {
      ja: 'オペレーター2',
      en: 'Operator 2'
    },
    class: 'guard',
    rarity: 5
  },
  {
    id: '3',
    name: {
      ja: 'オペレーター3',
      en: 'Operator 3'
    },
    class: 'sniper',
    rarity: 5
  },
  {
    id: '4',
    name: {
      ja: 'オペレーター4',
      en: 'Operator 4'
    },
    class: 'caster',
    rarity: 4
  },
  {
    id: '5',
    name: {
      ja: 'オペレーター5',
      en: 'Operator 5'
    },
    class: 'medic',
    rarity: 3
  },
  {
    id: '6',
    name: {
      ja: 'オペレーター6',
      en: 'Operator 6'
    },
    class: 'defender',
    rarity: 5
  }
]

export function getOperatorById(id: string): OperatorData | undefined {
  return OPERATORS.find(op => op.id === id)
}

export function getOperatorName(id: string, locale: 'ja' | 'en' = 'ja'): string {
  const operator = getOperatorById(id)
  return operator ? operator.name[locale] : ''
}
