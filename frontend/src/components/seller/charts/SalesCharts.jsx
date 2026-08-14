import { useState } from 'react'
import {
  ComposedChart, AreaChart, BarChart,
  Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import { formatINR, chartTheme, tooltipStyle, RANGES, filterTrendByRange } from '@/utils/salesUtils'
import ChartCard, { ChartContainer } from './ChartCard'

const formatTick = (date) => {
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

const useChartTheme = () => {
  const { theme } = useTheme()
  return chartTheme(theme === 'dark')
}

export const SalesOverview = ({ salesTrend }) => {
  const [range, setRange] = useState('30d')
  const t = useChartTheme()
  const data = filterTrendByRange(salesTrend, range)

  return (
    <ChartCard
      title='Sales Overview'
      description='Revenue & orders over time'
      className='lg:col-span-2'
      action={(
        <div className='flex flex-wrap gap-1'>
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                range === r.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    >
      <ChartContainer height={320}>
        <ComposedChart data={data} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke={t.grid} vertical={false} />
          <XAxis dataKey='date' tickFormatter={formatTick} stroke={t.axis} tickLine={false} axisLine={false} />
          <YAxis yAxisId='revenue' stroke={t.axis} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
          <YAxis yAxisId='orders' orientation='right' stroke={t.axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={tooltipStyle(t)}
            labelFormatter={formatTick}
            formatter={(value, name) => (name === 'revenue' ? formatINR(value) : value)}
          />
          <Area yAxisId='revenue' type='monotone' dataKey='revenue' stroke='#22c55e' fill='#22c55e' fillOpacity={0.2} strokeWidth={2} />
          <Bar yAxisId='orders' dataKey='orders' fill='#3b82f6' radius={[3, 3, 0, 0]} barSize={8} />
        </ComposedChart>
      </ChartContainer>
    </ChartCard>
  )
}

// export const RevenueChart = ({ salesTrend }) => {
//   const t = useChartTheme()
//   return (
//     <ChartCard title='Revenue Over Time' description='Revenue from delivered orders'>
//       <ChartContainer height={260}>
//         <AreaChart data={salesTrend} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
//           <CartesianGrid strokeDasharray='3 3' stroke={t.grid} vertical={false} />
//           <XAxis dataKey='date' tickFormatter={formatTick} stroke={t.axis} tickLine={false} axisLine={false} />
//           <YAxis stroke={t.axis} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
//           <Tooltip contentStyle={tooltipStyle(t)} labelFormatter={formatTick} formatter={(value) => formatINR(value)} />
//           <Area type='monotone' dataKey='revenue' stroke='#22c55e' fill='#22c55e' fillOpacity={0.3} strokeWidth={2} />
//         </AreaChart>
//       </ChartContainer>
//     </ChartCard>
//   )
// }

// export const OrdersChart = ({ salesTrend }) => {
//   const t = useChartTheme()
//   return (
//     <ChartCard title='Orders Over Time' description='Orders placed per day'>
//       <ChartContainer height={260}>
//         <BarChart data={salesTrend} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
//           <CartesianGrid strokeDasharray='3 3' stroke={t.grid} vertical={false} />
//           <XAxis dataKey='date' tickFormatter={formatTick} stroke={t.axis} tickLine={false} axisLine={false} />
//           <YAxis stroke={t.axis} tickLine={false} axisLine={false} allowDecimals={false} />
//           <Tooltip contentStyle={tooltipStyle(t)} labelFormatter={formatTick} />
//           <Bar dataKey='orders' fill='#3b82f6' radius={[3, 3, 0, 0]} barSize={8} />
//         </BarChart>
//       </ChartContainer>
//     </ChartCard>
//   )
// }