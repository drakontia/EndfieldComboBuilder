import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import ShareableTimeline from '@/components/ShareableTimeline'

describe('ShareableTimeline', () => {
  it('changes timeline width based on timelineDurationMs', () => {
    const baseProps = {
      characters: [null, null, null, null],
      actions: [],
    }

    const { rerender } = render(<ShareableTimeline {...baseProps} timelineDurationMs={30000} />)
    const firstLine = screen.getAllByTestId('shareable-timeline-line')[0]
    expect(firstLine).toHaveStyle({ width: '1000px' })

    rerender(<ShareableTimeline {...baseProps} timelineDurationMs={60000} />)
    const updatedFirstLine = screen.getAllByTestId('shareable-timeline-line')[0]
    expect(updatedFirstLine).toHaveStyle({ width: '2000px' })
  })
})
