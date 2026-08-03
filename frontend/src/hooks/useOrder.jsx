import { useCallback } from 'react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createOrder as createOrderApi,
  verifyPayment as verifyPaymentApi,
  paymentFailure as paymentFailureApi,
  createCODOrder as createCODOrderApi,
  fetchMyOrders as fetchMyOrdersApi,
  cancelOrder as cancelOrderApi,
} from '@/lib/api/order'
import { useAuth } from './useAuth'

export const useOrder = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const invalidateOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  }, [queryClient])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrdersApi,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 30,
  })

  const createOrderMutation = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      invalidateOrders()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPaymentApi,
    onSuccess: () => {
      invalidateOrders()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const paymentFailureMutation = useMutation({
    mutationFn: paymentFailureApi,
    onSettled: invalidateOrders,
  })

  const createCODOrderMutation = useMutation({
    mutationFn: createCODOrderApi,
    onSuccess: () => {
      invalidateOrders()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrderApi,
    onSuccess: () => {
      toast.success('Order Cancelled', { duration: 3000 })
      invalidateOrders()
    },
    onError: (error) => {
      toast.error('Failed to cancel order', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
    },
  })

  const handleCreateOrder = useCallback(async () => {
    try {
      const result = await createOrderMutation.mutateAsync()
      return result
    } catch (error) {
      toast.error('Failed to create order', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [createOrderMutation])

  const handleVerifyPayment = useCallback(async (data) => {
    try {
      const result = await verifyPaymentMutation.mutateAsync(data)
      toast.success('Payment Successful', { duration: 3000 })
      return result
    } catch (error) {
      toast.error('Payment verification failed', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [verifyPaymentMutation])

  const handlePaymentFailure = useCallback(async (checkoutSessionId) => {
    try {
      const result = await paymentFailureMutation.mutateAsync(checkoutSessionId)
      return result
    } catch (error) {
      toast.error('Payment Failed', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [paymentFailureMutation])

  const handleCreateCODOrder = useCallback(async () => {
    try {
      const result = await createCODOrderMutation.mutateAsync()
      toast.success('Order Placed', {
        description: 'Cash on Delivery', duration: 3000,
      })
      return result
    } catch (error) {
      toast.error('Failed to place order', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [createCODOrderMutation])

  const handleCancelOrder = useCallback(async (id) => {
    return await cancelOrderMutation.mutateAsync(id)
  }, [cancelOrderMutation])

  return {
    checkouts: data?.checkouts ?? {},
    loading: isLoading,
    refetchOrders: refetch,
    createOrderPending: createOrderMutation.isPending,
    verifyPending: verifyPaymentMutation.isPending,
    paymentFailurePending: paymentFailureMutation.isPending,
    codPending: createCODOrderMutation.isPending,
    cancelPending: cancelOrderMutation.isPending,
    handleCreateOrder,
    handleVerifyPayment,
    handlePaymentFailure,
    handleCreateCODOrder,
    handleCancelOrder,
  }
}

export default useOrder
