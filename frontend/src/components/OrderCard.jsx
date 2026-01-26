import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const OrderCard = ({ 
  orderId,
  orderDate,
  items = [],
  totalAmount,
  status,
  paymentMethod,
  paymentStatus,
  onCancelSuccess
}) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  

  const statusSteps = [
    { id: 'Pending', label: 'Order Placed', icon: Clock },
    { id: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'Processing', label: 'Processing', icon: Package },
    { id: 'Shipped', label: 'Shipped', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: CheckCircle }
  ]

  const currentStepIndex = statusSteps.findIndex(step => step.id === status)
  const isCancelled = status === 'Cancelled'

  const canCancel = ['Pending', 'Confirmed'].includes(status)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleCancelOrder = async () => {
    setIsLoading(true)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/order/${orderId}`,
        {},
        { withCredentials: true }
      )

      toast.success('Order cancelled successfully')
      setCancelDialogOpen(false)
      onCancelSuccess(orderId)
    } catch (error) {
      console.error('Cancel order error:', error)
      toast.error(error.response?.data?.error || 'Failed to cancel order')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = () => {
    if (isCancelled) return 'text-red-600 dark:text-red-400'
    if (status === 'Delivered') return 'text-green-600 dark:text-green-400'
    return 'text-blue-600 dark:text-blue-400'
  }

  return (
    <>
      <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
        <CardHeader className='bg-linear-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 pb-4'>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className='text-lg mb-2'>
                Order #{orderId.slice(-8).toUpperCase()}
              </CardTitle>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Placed on {formatDate(orderDate)}
              </p>
            </div>
            <div>
              <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                ₹{totalAmount.toFixed(2)}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-4'>
          {/* Order Status Progress */}
          {!isCancelled ? (
            <div className='mb-4'>
              <div className='flex items-center justify-between mb-3 mx-2'>
                <h3 className='font-semibold text-gray-700 dark:text-gray-300'>Order Status</h3>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {status}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className='relative'>
                {/* Background line */}
                <div className='absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700'></div>
                
                {/* Progress line */}
                <div 
                  className='absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500'
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                ></div>

                {/* Status steps */}
                <div className='relative flex justify-between'>
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex

                    return (
                      <div key={step.id} className='flex flex-col items-center'>
                        <div 
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center mb-2
                            transition-all duration-300 border-2
                            ${isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                            }
                            ${isCurrent && 'ring-4 ring-green-100 dark:ring-green-900/30 scale-110'}
                          `}
                        >
                          <Icon className='w-5 h-5' />
                        </div>
                        <p className={`
                          text-xs text-center max-w-[60px]
                          ${isCompleted ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}
                        `}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className='mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <div className='flex items-center gap-2'>
                <XCircle className='w-5 h-5 text-red-600 dark:text-red-400' />
                <p className='font-semibold text-red-600 dark:text-red-400'>Order Cancelled</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className='mb-2'>
            <h3 className='font-semibold text-gray-700 dark:text-gray-300 mb-3'>Items ({items.length})</h3>
            <div className='space-y-2'>
              {items.slice(0, 2).map((item, index) => (
                <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600'>
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${item.product?.image}`} 
                      alt={item.product?.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  {/* flex-1 makes the product name/info section take up all available space between the image and the price. */}
                  <div className='flex-1'>
                    <p className='font-medium text-gray-900 dark:text-white'>{item.product?.name}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Qty: {item.quantity} x ₹{item.product?.discountPrice || item.product?.originalPrice}
                    </p>
                  </div>
                  <p className='font-semibold text-green-600 dark:text-green-400'>
                    ₹{(item.quantity * (item.product?.discountPrice || item.product?.originalPrice)).toFixed(2)}
                  </p>
                </div>
              ))}
              {/* Fix this in future */}
              {items.length > 2 && (
                <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                  +{items.length - 2} more items
                </p>
              )}
            </div>
          </div>

          {/* Payment Status */}
          <div className='mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Payment Status</span>
              <span className={`
                text-sm font-medium px-3 py-1 rounded-full
                ${paymentStatus === 'completed' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : paymentStatus === 'failed'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }
              `}>
                {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Actions */}
          {canCancel && (
            <button
              onClick={() => setCancelDialogOpen(true)}
              className='w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
                       border-2 border-red-200 dark:border-red-800 rounded-lg font-medium
                       hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all'
            >
              Cancel Order
            </button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
              {paymentStatus === 'completed' && (
                <p className='mt-2 text-yellow-600 dark:text-yellow-400 font-medium'>
                  Note: Refund will be processed within 3-5 business days.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isLoading}
              className='bg-red-600 hover:bg-red-700 cursor-pointer'
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default OrderCard