import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import { chartTheme, tooltipStyle } from '@/utils/salesUtils'
import ChartCard, { ChartContainer } from './ChartCard'

const LOW_STOCK_THRESHOLD = 10

const StockChart = ({ data }) => {
  const { theme } = useTheme()
  const t = chartTheme(theme === 'dark')

  return (
    <ChartCard title='Stock Levels' description='Current stock per product'>
      <ChartContainer height={320}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' stroke={t.grid} vertical={false} />
          <XAxis dataKey='name' stroke={t.axis} tickLine={false} axisLine={false} interval={0} angle={-35} textAnchor='end' height={70} />
          <YAxis stroke={t.axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle(t)} />
          <ReferenceLine
            y={LOW_STOCK_THRESHOLD}
            stroke='#ef4444'
            strokeDasharray='4 4'
            label={{ value: 'Low stock', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }}
          />
          <Bar dataKey='stock' radius={[3, 3, 0, 0]} barSize={22}>
            {data.map(({ stock }, index) => (
              <Cell key={index} fill={stock <= LOW_STOCK_THRESHOLD ? '#ef4444' : '#22c55e'} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

export default StockChart