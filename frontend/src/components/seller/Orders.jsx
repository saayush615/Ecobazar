import React, { useState } from 'react'
import { Phone, Mail, Calendar, Timer } from 'lucide-react'
import { createColumnHelper } from '@tanstack/react-table'

import { LoadingOverlay } from '@/components/ui/loading'
import DataTable from './DataTable'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

import STATUS_CONFIG from '@/config/sellerStatus'
import useSeller from '@/hooks/useSeller'

const columnHelper = createColumnHelper()

const orderedDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const orderedTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const Orders = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [actionType, setActionType] = useState('') // next or cancel

  const { orders: products, ordersLoading: loading, handleUpdateOrderStatus, updateOrderStatusPending: actionLoading } = useSeller()

  const handleNextStatus = (order) => {
    const config = STATUS_CONFIG[order.status]
    if (config?.nextStatus) {
      setSelectedOrder(order)
      setActionType('next')
      setDialogOpen(true)
    }
  }

  const handleCancel = (order) => {
    setSelectedOrder(order)
    setActionType('cancel')
    setDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedOrder) return
    try {
      const newStatus = actionType === 'cancel'
        ? 'Cancelled'
        : STATUS_CONFIG[selectedOrder.status].nextStatus
      await handleUpdateOrderStatus(selectedOrder._id, newStatus)
    } catch (error) {
      console.error(error)
    } finally {
      setDialogOpen(false)
      setSelectedOrder(null)
      setActionType('')
    }
  }

  const columns = [
    columnHelper.accessor('_id', {
      id: 'orderId',
      header: 'OrderId',
      enableSorting: false,
      cell: info => (
        <span className='font-medium text-gray-600 dark:text-gray-400'>
          #{info.getValue().toString().slice(-8)}
        </span>
      ),
    }),
    columnHelper.accessor(row => row.user?.name, {
      id: 'customerName',
      header: 'Customer Name',
      cell: info => <span className='font-medium'>{info.getValue() || '-'}</span>,
    }),
    columnHelper.accessor(row => row.user, {
      id: 'contact',
      header: 'Contact details',
      enableSorting: false,
      cell: info => {
        const user = info.getValue() || {}
        return (
          <div className='flex flex-col gap-0.5'>
            <p className='flex flex-row items-center gap-1'>
              <Mail size={15} />: <span>{user.email || '-'}</span>
            </p>
            <p className='flex flex-row items-center gap-1'>
              <Phone size={15} />: <span>{user.phone || '-'}</span>
            </p>
          </div>
        )
      },
    }),
    columnHelper.accessor('carts', {
      header: 'Carts',
      enableSorting: false,
      cell: info => (
        <>
          {info.getValue().map((item, index) => (
            <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2'>
              <div className='w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600'>
                <img
                  src={`${item.product?.image}`}
                  alt={item.product?.name}
                  className='w-full h-full object-cover'
                />
              </div>
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
        </>
      ),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Amount',
      sortFn: 'basic',
      cell: info => (
        <span className={`font-semibold ${info.row.original.paymentStatus === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          ₹{info.getValue()?.toFixed(2)} ({info.row.original.paymentStatus})
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'OrderedAt',
      sortFn: 'datetime',
      cell: info => (
        <div className='flex flex-col gap-0.5'>
          <p className='flex flex-row items-center gap-1'>
            <Calendar size={15} />: <span>{orderedDate(info.getValue())}</span>
          </p>
          <p className='flex flex-row items-center gap-1'>
            <Timer size={15} />: <span>{orderedTime(info.getValue())}</span>
          </p>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original
        const statusConfig = STATUS_CONFIG[product.status]
        const canProgress = statusConfig?.nextStatus !== null
        const canCancel = product.status !== 'Delivered' && product.status !== 'Cancelled'
        return (
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handleNextStatus(product)}
              disabled={!canProgress || actionLoading}
              className={`py-2 px-4 rounded-lg font-medium transition-all
                ${canProgress
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer active:scale-95'
                  : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                }
                ${actionLoading ? 'opacity-50' : ''}
              `}
            >
              {statusConfig?.buttonText || product.status}
            </button>
            {canCancel && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={actionLoading}
                    className='py-2 px-4 rounded-lg bg-gray-300 text-black dark:bg-gray-700 dark:text-gray-200 font-bold active:scale-95 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-50'
                  >
                    ⋮
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleCancel(product)}
                      className='text-red-600 dark:text-red-400 focus:text-red-600 cursor-pointer'
                    >
                      Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      },
    }),
  ]

  return (
    <>
      <LoadingOverlay show={actionLoading} text="Processing..." />

      <DataTable
        tableKey='orders-table'
        columns={columns}
        data={products}
        loading={loading}
        loadingRows={5}
        loadingCols={7}
        caption={`${products.length} active order(s).`}
        pageSize={10}
        emptyMessage='No active orders.'
      />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'cancel'
                ? 'Cancel Order'
                : `Update to ${STATUS_CONFIG[selectedOrder?.status]?.nextStatus}`
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'cancel'
                ? 'Are you sure you want to cancel this order? This action cannot be undone.'
                : `Are you sure you want to update this order to "${STATUS_CONFIG[selectedOrder?.status]?.nextStatus}"?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              No, go back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={actionLoading}
              className={actionType === 'cancel'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
              }
            >
              {actionLoading ? 'Processing...' : 'Yes, confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Orders