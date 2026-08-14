import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ResponsiveContainer } from 'recharts'

// ChartContainer standardizes the ResponsiveContainer sizing (recharts requires it to measure the parent width), so each chart just passes height and children.
export const ChartContainer = ({ height = 300, children }) => (
  <div style={{ height }} className='w-full'>
    <ResponsiveContainer width='100%' height='100%'>
      {children}
    </ResponsiveContainer>
  </div>
)

const ChartCard = ({ title, description, action, children, className }) => (
  <Card className={`rounded-lg pt-2 ${className || ''}`}>
    <CardHeader className='flex flex-row items-center justify-between'>
      <div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {action}
    </CardHeader>
    <CardContent className='px-2'>
      {children}
    </CardContent>
  </Card>
)

export default ChartCard