import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import { formatINR, CHART_COLORS, chartTheme, tooltipStyle } from '@/utils/salesUtils'
import ChartCard, { ChartContainer } from './ChartCard'

const CategoryDonut = ({ data }) => {
  const { theme } = useTheme()
  const t = chartTheme(theme === 'dark')

  return (
    <ChartCard title='Revenue by Category' description='Share of revenue per category'>
      <ChartContainer height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey='revenue'
            nameKey='category'
            innerRadius='55%'
            outerRadius='80%'
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle(t)} formatter={(value) => formatINR(value)} />
          <Legend wrapperStyle={{ color: t.axis, fontSize: 12 }} />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  )
}

export default CategoryDonut