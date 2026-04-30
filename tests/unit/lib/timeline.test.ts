import { describe, it, expect } from 'vitest'

import { buildSpTimeline, buildStaggerMeterTimeline, getSecondMarkerWidthPx } from '@/lib/timeline'
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

const buildStaggerAction = (timing: number, type: SkillType, operatorId = 'endministrator') => ({
  timing,
  type,
  operatorId,
})

describe('buildStaggerMeterTimeline', () => {
  it('returns initial stagger meter point when no actions provided', () => {
    const { points, maxStaggerMeter } = buildStaggerMeterTimeline([], 100, 2000)

    expect(points[0]).toEqual({ timing: 0, staggerMeter: 100, delta: 0 })
    expect(maxStaggerMeter).toBe(100)
  })

  it('reduces stagger meter after a normal attack completes', () => {
    // endministrator: duration=3633ms, stagger=18
    // damage event fires at t=3633, processed at step t=4000
    const { points } = buildStaggerMeterTimeline(
      [buildStaggerAction(0, SkillType.NORMAL)],
      100,
      5000
    )

    const pointAt3000 = points.find((p) => p.timing === 3000)
    expect(pointAt3000?.staggerMeter).toBe(100)

    const pointAt4000 = points.find((p) => p.timing === 4000)
    expect(pointAt4000?.staggerMeter).toBe(82) // 100 - 18
  })

  it('schedules recovery 5 seconds after stagger meter reaches zero', () => {
    // endministrator stagger=18, takes 6 attacks to drain from 100 to 0
    // attacks at t=0,4000,...,20000 → damage events at 3633,7633,...,23633
    // 6th damage (t=23633) brings stagger to max(0, 10-18)=0
    // recovery scheduled at 23633+5000=28633 → fires before step t=29000
    const actions = [0, 4000, 8000, 12000, 16000, 20000].map((timing) =>
      buildStaggerAction(timing, SkillType.NORMAL)
    )

    const { points } = buildStaggerMeterTimeline(actions, 100, 30000)

    const pointAt24000 = points.find((p) => p.timing === 24000)
    expect(pointAt24000?.staggerMeter).toBe(0)

    const pointAt29000 = points.find((p) => p.timing === 29000)
    expect(pointAt29000?.staggerMeter).toBe(100) // fully recovered
  })

  it('immediately schedules recovery when initial stagger meter starts at zero', () => {
    // pendingRecoveryTime=null, currentTime=0 → recovery at t=0+5000=5000
    const { points } = buildStaggerMeterTimeline([], 0, 10000)

    const pointAt4000 = points.find((p) => p.timing === 4000)
    expect(pointAt4000?.staggerMeter).toBe(0)

    const pointAt5000 = points.find((p) => p.timing === 5000)
    expect(pointAt5000?.staggerMeter).toBe(100) // recovered
  })

  it('ignores non-normal-attack actions for stagger calculation', () => {
    const { points } = buildStaggerMeterTimeline(
      [buildStaggerAction(0, SkillType.BATTLE_SKILL)],
      100,
      5000
    )

    // No damage events: stagger stays at 100 throughout
    points.forEach((p) => expect(p.staggerMeter).toBe(100))
  })

  it('tracks maxStaggerMeter as the highest observed value', () => {
    const { maxStaggerMeter } = buildStaggerMeterTimeline([], 50, 5000)
    expect(maxStaggerMeter).toBe(50)
  })

  it('processes events for multiple operators correctly', () => {
    // Two different operators dealing stagger damage
    const actions = [
      buildStaggerAction(0, SkillType.NORMAL, 'endministrator'),   // stagger=18, done at 3633
      buildStaggerAction(0, SkillType.NORMAL, 'ardelia'),           // stagger=18, done at 3517
    ]

    const { points } = buildStaggerMeterTimeline(actions, 100, 5000)

    // Both damage events fire before t=4000 → 100 - 18 - 18 = 64
    const pointAt4000 = points.find((p) => p.timing === 4000)
    expect(pointAt4000?.staggerMeter).toBe(64)
  })
})
