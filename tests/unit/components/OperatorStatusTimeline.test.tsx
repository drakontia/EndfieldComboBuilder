import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OperatorStatusTimeline } from '@/components/OperatorStatusTimeline'
import { Buff, SkillType } from '@/types/combo'

vi.mock('@/lib/data/skills', () => ({
  getStatusEffectForAction: () => [Buff.SUPPORT_CRYSTAL],
}))

describe('OperatorStatusTimeline', () => {
  it('aligns header second markers with timeline origin', () => {
    render(
      <OperatorStatusTimeline
        actions={[
          {
            id: 'action-1',
            characterId: 'character.rossi.name',
            type: SkillType.BATTLE_SKILL,
            timing: 0,
          },
        ]}
        timelineDurationMs={3000}
      />
    )

    expect(screen.getByText('0s')).toHaveStyle({ left: '0px' })
    expect(screen.getByText('3s')).toHaveStyle({ left: '1000px' })
  })
})
