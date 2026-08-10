import { Phone, Mail, Calendar, Timer } from 'lucide-react'
import { createColumnHelper } from '@tanstack/react-table'

import DataTable from './DataTable'
import { useSeller } from '@/hooks/useSeller'

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

const OrderHistory = () => {
  const { orderHistory: products, orderHistoryLoading: loading } = useSeller()

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
      header: 'Cart',
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
              <p className={`font-semibold ${info.row.original.status === 'Delivered' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
      cell: info => {
        const delivered = info.row.original.status === 'Delivered'
        return (
          <span className={`font-semibold ${delivered ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ₹{info.getValue()?.toFixed(2)}
          </span>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'CreatedAt',
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
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: info => (
        <span className={`font-semibold ${info.getValue() === 'Delivered' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {info.getValue()}
        </span>
      ),
    }),
  ]

  return (
    <DataTable
      tableKey='order-history-table'
      columns={columns}
      data={products}
      loading={loading}
      loadingRows={5}
      loadingCols={7}
      caption={`${products.length} order(s) in history.`}
      pageSize={10}
      emptyMessage='No order history.'
    />
  )
}

export default OrderHistory