import { TrendingUp, ShoppingCart, Wallet, Package, AlertTriangle, XCircle } from 'lucide-react'
import { formatINR } from '@/utils/salesUtils'

const StatCards = ({ stats, activeOrders, lowStockCount }) => {
  const cancellationRate = stats.totalOrders > 0
    ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)
    : 0

  const cards = [
    { label: 'Total Revenue', value: formatINR(stats.totalRevenue), icon: Wallet, color: 'text-green-600 dark:text-green-400' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Avg Order Value', value: formatINR(stats.avgOrderValue), icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Active Orders', value: activeOrders, icon: Package, color: 'text-orange-500 dark:text-orange-400' },
    { label: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
    { label: 'Cancellation Rate', value: `${cancellationRate}%`, icon: XCircle, color: 'text-rose-500 dark:text-rose-400' },
  ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm'
        >
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{label}</p>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className='text-2xl font-bold mt-2 text-gray-900 dark:text-white'>{value}</p>
        </div>
      ))}
    </div>
  )
}

export default StatCards