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

import STATUS_CONFIG from '@/config/sellerStatus';

const Orders = () => {
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false); 
    const [products, setProducts] = useState([]);
    

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionType, setActionType] = useState(''); // next or cancel

    useEffect(() => {
      fetchOrders();
    },[])

    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/seller/orders/`, {withCredentials: true});
        const orders = response.data?.orders;
        if (orders.length === 0){
          return;
        }

        setProducts(orders);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }


    const handleNextStatus = (order) => {
      const config = STATUS_CONFIG[order.status];
      if (config?.nextStatus) {
        setSelectedOrder(order);
        setActionType('next');
        setDialogOpen(true);
      }
    };

    
    const handleCancel = (order) => {
      setSelectedOrder(order);
      setActionType('cancel');
      setDialogOpen(true);
    };

    
    const confirmAction = async () => {
      if (!selectedOrder) return;

      setActionLoading(true);
      try {
        const newStatus = actionType === 'cancel' 
          ? 'Cancelled' 
          : STATUS_CONFIG[selectedOrder.status].nextStatus;
        
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/seller/orderStatus/${selectedOrder._id}`,
          { changedStatus: newStatus },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Update local state
          setProducts(products.map(p => 
            p._id === selectedOrder._id 
              ? { ...p, status: newStatus }
              : p
          ));
          
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to update order');
      } finally {
        setActionLoading(false);
        setDialogOpen(false);
        setSelectedOrder(null);
        setActionType('');
      }
    };

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

    if (products.length === 0 && !loading) {
      return <div className='text-gray-600 dark:text-gray-300'>No active orders</div>
    }
    
    if (loading) {
        return (
          <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <TableSkeleton rows={5} columns={7} />
          </div>
        )
    }

  return (
    <>
      <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <Table>
        <TableCaption className='py-4'>{products.length} active order(s).</TableCaption>
        <TableHeader>
            <TableRow>
              <TableHead className="w-20 font-semibold">OrderId</TableHead>
              <TableHead className='font-semibold'>Customer Name</TableHead>
              <TableHead className='font-semibold'>Contact details</TableHead>
              <TableHead className='font-semibold'>Carts</TableHead>
              <TableHead className='font-semibold'>Amount</TableHead>
              <TableHead className='font-semibold'>OrderedAt</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const statusConfig = STATUS_CONFIG[product.status];
            const canProgress = statusConfig?.nextStatus !== null;
            const canCancel = product.status !== 'Delivered' && product.status !== 'Cancelled';
            
            return (
              <TableRow key={product._id}>
                <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                  #{product._id.toString().slice(-8)}
                </TableCell>
                <TableCell className='font-medium'>
                  {product.user?.name}
                </TableCell>
                <TableCell className='font-medium'>
                  <div className='flex flex-col gap-0.5'>
                    <p className='flex flex-row items-center gap-1'>
                      <Mail size={15} />: <span>{product.user?.email || '-'}</span>
                    </p>
                    <p className='flex flex-row items-center gap-1'>
                      <Phone size={15} />: <span>{product.user?.phone || '-'}</span>
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {product.carts.map((item, index) => (
                    <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2'>
                      <div className='w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600'>
                        <img 
                          src={`${import.meta.env.VITE_API_URL}${item.product?.image}`} 
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
                </TableCell>
                <TableCell className={`font-semibold ${product.paymentStatus === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₹{product.totalAmount?.toFixed(2)} ({product.paymentStatus})
                </TableCell>
                <TableCell>
                  <div className='flex flex-col gap-0.5'>
                    <p className='flex flex-row items-center gap-1'>
                      <Calendar size={15} />: <span>{orderedDate(product.createdAt)}</span>
                    </p>
                    <p className='flex flex-row items-center gap-1'>
                      <Timer size={15} />: <span>{orderedTime(product.createdAt)}</span>
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {/* Main Status Button */}
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
                    
                    {/* Dropdown Menu - Only Cancel */}
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
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        </Table>
      </div>

      
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