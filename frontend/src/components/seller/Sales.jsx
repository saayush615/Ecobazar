import { useSeller } from '@/hooks/useSeller'
import { LoadingOverlay } from '@/components/ui/loading'
import StatCards from './charts/StatCards'
import { SalesOverview, 
  // RevenueChart, 
  // OrdersChart
 } from './charts/SalesCharts'
import CategoryDonut from './charts/CategoryDonut'
import TopProductsChart from './charts/TopProductsChart'
import StockChart from './charts/StockChart'
import { OrderStatusChart, 
  // PaymentMethodChart, 
  PaymentStatusChart 
} from './charts/OrderInsights'

const Sales = () => {
  const { analytics, analyticsLoading } = useSeller()

  if (!analytics && analyticsLoading) {
    return (
      <div className='relative min-h-[60vh]'>
        <LoadingOverlay show text='Loading analytics...' />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className='flex items-center justify-center min-h-[60vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8'>
        <p className='text-gray-500 dark:text-gray-400 text-lg'>No sales data yet.</p>
      </div>
    )
  }

  const {
    stats, salesTrend, orderStatus, paymentMethod, paymentStatus,
    categoryRevenue, topProducts, lowStockCount, stockLevels,
  } = analytics

  const activeOrders = stats.totalOrders - stats.deliveredOrders - stats.cancelledOrders

  return (
    <div className='space-y-6'>
      <StatCards stats={stats} activeOrders={activeOrders} lowStockCount={lowStockCount} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <SalesOverview salesTrend={salesTrend} />
        <CategoryDonut data={categoryRevenue} />
      </div>

      {/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <RevenueChart salesTrend={salesTrend} />
        <OrdersChart salesTrend={salesTrend} />
      </div> */}

      {/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'> */}
        {/* <TopProductsChart data={topProducts} /> */}
        {/* <StockChart data={stockLevels} /> */}
      {/* </div> */}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <OrderStatusChart data={orderStatus} />
        {/* <PaymentMethodChart data={paymentMethod} /> */}
        <PaymentStatusChart data={paymentStatus} />
        <TopProductsChart data={topProducts} />
      </div>
    </div>
  )
}

export default Sales