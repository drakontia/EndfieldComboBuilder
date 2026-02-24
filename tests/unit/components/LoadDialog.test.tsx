import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import LoadDialog from '@/components/LoadDialog'
import { CharacterElement, CharcterType, SkillType } from '@/types/combo'

const savedCombos = [
  {
    name: 'Combo A',
    characters: [
      {
        name: 'character.alpha',
        type: CharcterType.GUARD,
        element: CharacterElement.PHYSICS,
        rarity: 6,
      },
      null,
      null,
      null,
    ],
    actions: [
      {
        id: 'action-1',
        characterId: 'character.alpha',
        type: SkillType.NORMAL,
        timing: 1000,
      },
    ],
  },
]

describe('LoadDialog', () => {
  it('renders combos and handles load/delete', () => {
    const onClose = vi.fn()
    const onLoad = vi.fn()
    const onDelete = vi.fn()

    render(
      <LoadDialog
        isOpen
        savedCombos={savedCombos}
        onClose={onClose}
        onLoad={onLoad}
        onDelete={onDelete}
      />
    )

    expect(screen.getByText('Combo A')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onLoad).toHaveBeenCalledWith(savedCombos[0])
    expect(onClose).toHaveBeenCalled()

    fireEvent.click(buttons[1])
    expect(onDelete).toHaveBeenCalledWith('Combo A')
  })

  it('shows empty state when no combos exist', () => {
    render(
      <LoadDialog
        isOpen
        savedCombos={[]}
        onClose={vi.fn()}
        onLoad={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.queryByText('Combo A')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})
