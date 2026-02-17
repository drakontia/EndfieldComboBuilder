'use client'

import { TIMELINE_DURATION, TIMELINE_WIDTH } from '@/lib/timeline'

interface TimelineScaleProps {
  withCharacterOffset?: boolean
}

export const TimelineScale = ({ withCharacterOffset = false }: TimelineScaleProps) => {
  const totalSeconds = Math.round(TIMELINE_DURATION / 1000)

  return (
    <div className="flex items-center px-4">
      {withCharacterOffset && (
        <>
          <div className="w-40 shrink-0" />
          <div className="w-4 shrink-0" />
        </>
      )}
      <div className="w-24" />
      <div className="relative flex-1 h-6">
        {Array.from({ length: totalSeconds + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute text-xs text-gray-400"
            style={{ left: `${(i / totalSeconds) * TIMELINE_WIDTH}px` }}
          >
            {i}s
          </div>
        ))}
      </div>
    </div>
  )
}
