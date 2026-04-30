import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import ControlPanel from '@/components/ControlPanel'

describe('ControlPanel', () => {
  it('calls handlers when interacting with controls', () => {
    const onComboNameChange = vi.fn()
    const onSave = vi.fn()
    const onLoad = vi.fn()
    const onExportImage = vi.fn()
    const onShare = vi.fn()
    const onClear = vi.fn()
    const onToggleDeleteMode = vi.fn()

    render(
      <ControlPanel
        comboName="Test Combo"
        onComboNameChange={onComboNameChange}
        onSave={onSave}
        onLoad={onLoad}
        onExportImage={onExportImage}
        onShare={onShare}
        onClear={onClear}
        deleteMode={false}
        onToggleDeleteMode={onToggleDeleteMode}
        deleteModeLabel="削除モード: OFF"
      />
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Next Combo' } })
    expect(onComboNameChange).toHaveBeenCalledWith('Next Combo')

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(6)

    fireEvent.click(buttons[0])
    expect(onToggleDeleteMode).toHaveBeenCalled()

    fireEvent.click(buttons[1])
    expect(onSave).toHaveBeenCalled()

    fireEvent.click(buttons[2])
    expect(onLoad).toHaveBeenCalled()

    fireEvent.click(buttons[3])
    expect(onExportImage).toHaveBeenCalled()

    fireEvent.click(buttons[4])
    expect(onShare).toHaveBeenCalled()

    fireEvent.click(buttons[5])
    expect(onClear).toHaveBeenCalled()
  })
})
