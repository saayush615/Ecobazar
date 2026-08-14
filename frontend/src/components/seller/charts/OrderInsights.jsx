import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import {
  STATUS_COLORS, PAYMENT_METHOD_COLORS, PAYMENT_STATUS_COLORS,
  chartTheme, tooltipStyle,
} from '@/utils/salesUtils'
import ChartCard, { ChartContainer } from './ChartCard'

const useChartTheme = () => {
  const { theme } = useTheme()
  return chartTheme(theme === 'dark')
}

export const OrderStatusChart = ({ data }) => {
  const t = useChartTheme()
  return (
    <ChartCard title='Order Status' description='Orders by current status'>
      <ChartContainer height={260}>
        <PieChart>
          <Pie data={data} dataKey='count' nameKey='status' innerRadius='55%' outerRadius='80%' paddingAngle={2} strokeWidth={0}>
            {data.map(({ status }, index) => (
              <Cell key={index} fill={STATUS_COLORS[status] || '#9ca3af'} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle(t)} />
          <Legend wrapperStyle={{ color: t.axis, fontSize: 12 }} />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  )
}

// export const PaymentMethodChart = ({ data }) => {
//   const t = useChartTheme()
//   return (
//     <ChartCard title='Payment Method' description='Razorpay vs Cash on Delivery'>
//       <ChartContainer height={260}>
//         <PieChart>
//           <Pie data={data} dataKey='count' nameKey='method' innerRadius='55%' outerRadius='80%' paddingAngle={2} strokeWidth={0}>
//             {data.map(({ method }, index) => (
//               <Cell key={index} fill={PAYMENT_METHOD_COLORS[method] || '#9ca3af'} />
//             ))}
//           </Pie>
//           <Tooltip contentStyle={tooltipStyle(t)} />
//           <Legend wrapperStyle={{ color: t.axis, fontSize: 12 }} />
//         </PieChart>
//       </ChartContainer>
//     </ChartCard>
//   )
// }

export const PaymentStatusChart = ({ data }) => {
  const t = useChartTheme()
  return (
    <ChartCard title='Payment Status' description='Completed, pending & failed payments'>
      <ChartContainer height={260}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' stroke={t.grid} vertical={false} />
          <XAxis dataKey='status' stroke={t.axis} tickLine={false} axisLine={false} />
          <YAxis stroke={t.axis} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle(t)} />
          <Bar dataKey='count' radius={[3, 3, 0, 0]} barSize={40}>
            {data.map(({ status }, index) => (
              <Cell key={index} fill={PAYMENT_STATUS_COLORS[status] || '#9ca3af'} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}