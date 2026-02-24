import { describe, it, expect } from 'vitest'

import { buildSpTimeline, getSecondMarkerWidthPx } from '@/lib/timeline'
import { SkillType } from '@/types/combo'

const buildAction = (timing: number, type: SkillType, characterId = 'endministrator') => ({
  timing,
  type,
  characterId,
})

describe('timeline helpers', () => {
  it('calculates second marker width', () => {
    expect(getSecondMarkerWidthPx(10000)).toBe(100)
  })

  it('builds SP timeline with battle skill cost', () => {
    const { points, minSp } = buildSpTimeline([buildAction(0, SkillType.BATTLE_SKILL)], 200, 100, 2000)

    expect(points[0]).toEqual({ timing: 0, sp: 200, delta: 0 })
    expect(points[1]?.sp).toBe(110)
    expect(points[2]?.sp).toBe(120)
    expect(minSp).toBe(100)
  })

  it('adds SP from normal attacks when the action finishes', () => {
    const { points } = buildSpTimeline([buildAction(0, SkillType.NORMAL)], 200, 100, 4000)

    expect(points[3]?.sp).toBe(230)
    expect(points[4]?.sp).toBe(260)
  })
})
