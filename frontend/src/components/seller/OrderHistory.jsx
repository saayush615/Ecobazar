import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Phone , Mail, Calendar, Timer } from 'lucide-react';

import { TableSkeleton, LoadingOverlay } from '@/components/ui/loading'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OrderHistory = () => {
    const [loading, setLoading] = useState(true); 
    const [products, setProducts] = useState([]);

    useEffect(() => {
      fetchOrders();
    },[]);

    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/seller/order-history/`, {withCredentials: true});
        const orders = response.data?.orders;
        if (orders.length === 0){
          return;
        }

        setProducts(orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (products.length === 0) {
      return <div className='text-gray-600 dark:text-gray-300'>No order history</div>
    };

    if (loading) {
        return (
          <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <TableSkeleton rows={5} columns={7} />
          </div>
        )
      }

    const orderedDate = (dateSting) => {
      return new Date(dateSting).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    const orderedTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

  return (
    <>

      <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <Table>
        <TableCaption className='py-4'>{products.length} active order.</TableCaption>
        <TableHeader>
            <TableRow>
              <TableHead className="w-20 font-semibold">OrderId</TableHead>
              <TableHead className='font-semibold'>Customer Name</TableHead>
              <TableHead className='font-semibold'>Contact details</TableHead>
              <TableHead className='font-semibold'>Cart</TableHead>
              <TableHead className='font-semibold'>Amount</TableHead>
              <TableHead className='font-semibold'>CreatedAt</TableHead>
              <TableHead className="font-semibold">status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product,index) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                #{product._id.toString().slice(-8)}
              </TableCell>
              <TableCell className='font-medium'>
                {product.user?.name}
              </TableCell>
              <TableCell className='font-medium'>
                <div className='flex flex-col gap-0.5'>
                  <p className='flex flex-row items-center gap-1'><Mail size={15} />: <span>{product.user?.email ? product.user?.email : '-'}</span></p>
                  <p className='flex flex-row items-center gap-1'><Phone size={15} />: <span>{product.user?.phone ? product.user?.phone : '-'}</span></p>
                </div>
              </TableCell>
              <TableCell>
                {product.carts.map((item, index) => (
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
                    <p className={`font-semibold ${product.status === 'Delivered' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }`}>
                      ₹{(item.quantity * (item.product?.discountPrice || item.product?.originalPrice)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </TableCell>
              <TableCell className={`font-semibold ${product.status === 'Delivered' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }`}>
                ₹{product.totalAmount?.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className='flex flex-col gap-0.5'>
                  <p className='flex flex-row items-center gap-1'><Calendar size={15} />: <span>{orderedDate(product.createdAt)}</span></p>
                  <p className='flex flex-row items-center gap-1'><Timer size={15} />: <span>{orderedTime(product.createdAt)}</span></p>
                </div>
              </TableCell>
              <TableCell className={`font-semibold ${product.status === 'Delivered' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }`}>
                {product.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </>
  )
}

export default OrderHistory
