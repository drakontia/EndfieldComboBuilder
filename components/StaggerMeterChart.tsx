'use client'

import { useTranslations } from 'next-intl'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { MAX_STAGGER_METER, TIMELINE_WIDTH } from '@/lib/timeline'

interface StaggerMeterChartProps {
  chartData: { timing: number; staggerMeter: number }[]
  initialStaggerMeter: number
  timelineDurationMs: number
  showLabel?: boolean
}

export const StaggerMeterChart = ({
  chartData,
  initialStaggerMeter,
  timelineDurationMs,
  showLabel = true,
}: StaggerMeterChartProps) => {
  const t = useTranslations()

  const chartContent = (
    <>
      <div className="w-24 shrink-0" />
      <div className="relative" style={{ width: `${TIMELINE_WIDTH}px`, height: '96px' }}>
        <ChartContainer
          id="stagger-meter"
          config={{
            staggerMeter: {
              label: t('timeline.staggerLabel'),
              color: 'hsl(280, 85%, 50%)',
            },
          }}
          className="w-full aspect-auto rounded bg-gray-700/40"
          style={{ height: '100%' }}
        >
          <BarChart data={chartData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis
              dataKey="timing"
              type="number"
              domain={[0, timelineDurationMs]}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={10}
              tickFormatter={(value) => `${value / 1000}s`}
            />
            <YAxis
              width={24}
              tickLine={false}
              axisLine={false}
              fontSize={10}
              domain={[0, MAX_STAGGER_METER]}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="staggerMeter" formatter={(value) => `${value}`} />}
            />
            <Bar dataKey="staggerMeter" fill="var(--color-staggerMeter)" radius={[6, 6, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  )

  if (!showLabel) {
    return <div className="flex items-center">{chartContent}</div>
  }

  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="w-40 shrink-0 text-sm text-gray-300 font-medium">
        {t('timeline.staggerLabel')}
        <div className="text-xs text-gray-300">
          {t('timeline.staggerInitial', { value: initialStaggerMeter })}
        </div>
      </div>
      {chartContent}
    </div>
  )
}
