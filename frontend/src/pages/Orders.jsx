import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LoadingOverlay } from '@/components/ui/loading'
import OrderCard from '@/components/OrderCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, ShoppingBag, Filter } from 'lucide-react'
import { useOrder } from '@/hooks/useOrder'

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const { checkouts, loading, handleCancelOrder } = useOrder();

  const orders = useMemo(() =>
    Object.values(checkouts)
      .flatMap(eachOrder => eachOrder.orders)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [checkouts]
  )

  // Filter orders based on status
  const filterOptions = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  
  const filteredOrders = activeFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === activeFilter)

  if (loading) {
    return <LoadingOverlay show={loading} text="Loading your orders..." fullPage />
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-900'>
      <Header />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-3 bg-green-100 dark:bg-green-900/30 rounded-lg'>
              <Package className='w-6 h-6 text-green-600 dark:text-green-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                My Orders
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                Track and manage your orders
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        {orders.length > 0 && (
          <div className='mb-6 overflow-x-auto'>
            <div className='flex items-center gap-2 pb-2'>
              <Filter className='w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0' />
              {filterOptions.map((filter) => {
                const count = filter === 'All' 
                  ? orders.length 
                  : orders.filter(order => order.status === filter).length
                
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      whitespace-nowrap
                      ${activeFilter === filter
                        ? 'bg-green-600 text-white shadow-md'
                        : count > 0
                          ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed'
                      }
                    `}
                    disabled={count === 0}
                  >
                    {filter} {count > 0 && `(${count})`}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 px-4'>
            <div className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6'>
              <ShoppingBag className='w-12 h-12 text-gray-400 dark:text-gray-600' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              {activeFilter === 'All' ? 'No orders yet' : `No ${activeFilter.toLowerCase()} orders`}
            </h2>
            <p className='text-gray-600 dark:text-gray-400 text-center max-w-md mb-6'>
              {activeFilter === 'All' 
                ? 'Start shopping and your orders will appear here'
                : `You don't have any ${activeFilter.toLowerCase()} orders at the moment`
              }
            </p>
            <Link
              to='/'
              className='px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:scale-95 transition-all'
            >
              Start Shopping
            </Link>
          </div>
          ) : (
          <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
            {filteredOrders.map(order => (
              <OrderCard
                key={order._id}
                orderId={order._id}
                orderDate={order.createdAt}
                sellerShopName={order.sellerShopName}
                items={order.carts}
                totalAmount={order.totalAmount}
                status={order.status}
                paymentMethod={order.paymentMethod}
                paymentStatus={order.paymentStatus}
              />
            ))}
          </div>
        )}
        
      </main>
      
      <Footer />
    </div>
  )
}

export default Orders