import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import { formatINR, CHART_COLORS, chartTheme, tooltipStyle } from '@/utils/salesUtils'
import ChartCard, { ChartContainer } from './ChartCard'

const TopProductsChart = ({ data }) => {
  const { theme } = useTheme()
  const t = chartTheme(theme === 'dark')

  return (
    <ChartCard title='Top Products' description='Top 8 products by revenue'>
      <ChartContainer height={320}>
        <BarChart
          data={data}
          layout='vertical'
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke={t.grid} horizontal={false} />
          <XAxis type='number' stroke={t.axis} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
          <YAxis type='category' dataKey='name' width={120} stroke={t.axis} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle(t)} formatter={(value) => formatINR(value)} />
          <Bar dataKey='revenue' radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

export default TopProductsChart