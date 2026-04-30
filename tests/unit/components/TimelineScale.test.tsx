import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { TimelineScale } from '@/components/TimelineScale'

describe('TimelineScale', () => {
  it('renders second markers based on duration', () => {
    render(<TimelineScale timelineDurationMs={3000} />)

    expect(screen.getByText('0s')).toBeInTheDocument()
    expect(screen.getByText('1s')).toBeInTheDocument()
    expect(screen.getByText('2s')).toBeInTheDocument()
    expect(screen.getByText('3s')).toBeInTheDocument()
  })
})
