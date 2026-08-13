import { useCallback } from 'react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSellerProducts as fetchSellerProductsApi,
  createSellerProduct as createSellerProductApi,
  updateSellerProduct as updateSellerProductApi,
  deleteSellerProduct as deleteSellerProductApi,
  fetchSellerOrders as fetchSellerOrdersApi,
  fetchSellerOrderHistory as fetchSellerOrderHistoryApi,
  updateOrderStatus as updateOrderStatusApi,
  fetchSellerAnalytics as fetchSellerAnalyticsApi,
} from '@/lib/api/seller'
import { useAuth } from './useAuth'

export const useSeller = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Queries
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['seller-products'],
    queryFn: fetchSellerProductsApi,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 30,
  })

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: fetchSellerOrdersApi,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 30,
  })

  const { data: orderHistoryData, isLoading: orderHistoryLoading, refetch: refetchOrderHistory } = useQuery({
    queryKey: ['seller-order-history'],
    queryFn: fetchSellerOrderHistoryApi,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 30,
  })

  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['seller-analytics'],
    queryFn: fetchSellerAnalyticsApi,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 30,
  })

  // Invalidate functions
  const invalidateProducts = useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] }) // marks cached data as stale & if that query is currently being used by a component, it will usually refetch it in the background.
      queryClient.invalidateQueries({ queryKey: ['seller-analytics'] }) // stock/category changed → charts must refresh
    }, [queryClient])

  const invalidateOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
    queryClient.invalidateQueries({ queryKey: ['seller-order-history'] })
    queryClient.invalidateQueries({ queryKey: ['seller-analytics'] })
  }, [queryClient])

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: createSellerProductApi,
    onSuccess: () => {
      toast.success('Product Added', { duration: 3000 })
      invalidateProducts()
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, formData }) => updateSellerProductApi(id, formData),
    onSuccess: () => {
      toast.success('Product Updated', { duration: 3000 })
      invalidateProducts()
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: deleteSellerProductApi,
    onSuccess: () => {
      toast.success('Product Deleted', { duration: 3000 })
      invalidateProducts()
    },
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, changedStatus }) => updateOrderStatusApi(orderId, changedStatus),
    onSuccess: () => {
      toast.success('Order Status Updated', { duration: 3000 })
      invalidateOrders()
    },
  })

  // Hooks
  const handleCreateProduct = useCallback(async (formData) => {
    try {
      const result = await createProductMutation.mutateAsync(formData)
      return result
    } catch (error) {
      toast.error('Failed to add product', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [createProductMutation])

  const handleUpdateProduct = useCallback(async (id, formData) => {
    try {
      // .mutate let you pass 1 param. so if you want to handle more than one param > wrap it in obj and unpack it in mutationFn.
      const result = await updateProductMutation.mutateAsync({ id, formData })
      return result
    } catch (error) {
      toast.error('Failed to update product', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [updateProductMutation])

  const handleDeleteProduct = useCallback(async (id) => {
    try {
      const result = await deleteProductMutation.mutateAsync(id)
      return result
    } catch (error) {
      toast.error('Failed to delete product', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [deleteProductMutation])

  const handleUpdateOrderStatus = useCallback(async (orderId, changedStatus) => {
    try {
      const result = await updateOrderStatusMutation.mutateAsync({ orderId, changedStatus })
      return result
    } catch (error) {
      toast.error('Failed to update order status', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [updateOrderStatusMutation])

  return {
    products: productsData?.products ?? [],
    orders: ordersData?.orders ?? [],
    activeOrdersCount: ordersData?.count ?? 0,
    orderHistory: orderHistoryData?.orders ?? [],
    productsLoading,
    ordersLoading,
    orderHistoryLoading,
    analytics: analyticsData?.analytics ?? null,
    analyticsLoading,
    refetchProducts,
    refetchOrders,
    refetchOrderHistory,
    refetchAnalytics,
    createProductPending: createProductMutation.isPending,
    updateProductPending: updateProductMutation.isPending,
    deleteProductPending: deleteProductMutation.isPending,
    updateOrderStatusPending: updateOrderStatusMutation.isPending,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleUpdateOrderStatus,
  }
}

export default useSeller
