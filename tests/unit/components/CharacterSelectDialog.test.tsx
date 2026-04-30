import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import CharacterSelectDialog from '@/components/CharacterSelectDialog'
import { CharacterElement, CharcterType } from '@/types/combo'

const options = [
  {
    id: 'alpha',
    operator: {
      name: 'character.alpha',
      type: CharcterType.GUARD,
      element: CharacterElement.HEAT,
      rarity: 6,
      imageUrl: '/alpha.png',
    },
  },
  {
    id: 'beta',
    operator: {
      name: 'character.beta',
      type: CharcterType.CASTER,
      element: CharacterElement.CRYO,
      rarity: 5,
      imageUrl: '/beta.png',
    },
  },
]

describe('CharacterSelectDialog', () => {
  it('filters options by search and filters', () => {
    render(
      <CharacterSelectDialog
        isOpen
        options={options}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )

    expect(screen.getByText('character.alpha')).toBeInTheDocument()
    expect(screen.getByText('character.beta')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('team.searchPlaceholder'), {
      target: { value: 'alpha' },
    })
    expect(screen.getByText('character.alpha')).toBeInTheDocument()
    expect(screen.queryByText('character.beta')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('team.searchPlaceholder'), {
      target: { value: '' },
    })

    fireEvent.change(screen.getByLabelText('team.filterType'), {
      target: { value: CharcterType.CASTER },
    })
    expect(screen.queryByText('character.alpha')).not.toBeInTheDocument()
    expect(screen.getByText('character.beta')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('team.filterType'), {
      target: { value: 'all' },
    })

    fireEvent.change(screen.getByLabelText('team.filterRarity'), {
      target: { value: '6' },
    })
    expect(screen.getByText('character.alpha')).toBeInTheDocument()
    expect(screen.queryByText('character.beta')).not.toBeInTheDocument()
  })

  it('calls onSelect when an option is clicked', () => {
    const onSelect = vi.fn()

    render(
      <CharacterSelectDialog
        isOpen
        options={options}
        onClose={vi.fn()}
        onSelect={onSelect}
      />
    )

    fireEvent.click(screen.getByText('character.alpha'))
    expect(onSelect).toHaveBeenCalledWith(options[0].operator)
  })
})
