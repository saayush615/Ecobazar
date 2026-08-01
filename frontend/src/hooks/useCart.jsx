import { useCallback } from 'react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchCart as fetchCartApi, 
  addToCart as addToCartApi, 
  removeFromCart as removeFromCartApi, 
  updateCartQuantity as updateCartQuantityApi 
} from '@/lib/api/cart'
import { useAuth } from './useAuth'

export const useCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  //  Query & Mutations
  
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCartApi,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 30,
  })

  const addToCartMutation = useMutation({
    mutationFn: addToCartApi,
    onMutate: async () => {  // Runs BEFORE the API request starts.
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previousCart = queryClient.getQueryData(['cart'])
      return { previousCart } // becomes context
    },
    onError: (err, prodId, context) => { // Runs only if API fails.
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
    },
    onSettled: () => { // whether API succeeds or fail
      queryClient.invalidateQueries({ queryKey: ['cart'] }) // This cached data is old: Mark cached data as stale and trigger a refetch if the query is active
    },
  })


  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCartApi,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previousCart = queryClient.getQueryData(['cart'])
      if (previousCart) {
        const removedItem = previousCart.cartItems?.find(item => item._id === itemId)
        const itemTotal = removedItem
          ? (removedItem.product?.discountPrice || 0) * removedItem.quantity
          : 0
        queryClient.setQueryData(['cart'], {
          ...previousCart,
          cartItems: previousCart.cartItems?.filter(item => item._id !== itemId) || [],
          itemCount: Math.max(0, (previousCart.itemCount || 0) - 1),
          total: Math.max(0, (previousCart.total || 0) - itemTotal),
        })
      }
      return { previousCart }
    },
    onError: (err, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })


  const updateCartQuantityMutation = useMutation({
    mutationFn: ({ itemId, newQuantity }) => updateCartQuantityApi(itemId, newQuantity),
    onMutate: async ({ itemId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previousCart = queryClient.getQueryData(['cart'])
      if (previousCart) {
        const updatedItems = previousCart.cartItems?.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        ) || []
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.product?.discountPrice || 0) * item.quantity,
          0
        )
        queryClient.setQueryData(['cart'], {
          ...previousCart,
          cartItems: updatedItems,
          total: newTotal,
        })
      }
      return { previousCart }
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Hooks

  const handleAddToCart = useCallback(async (prodId) => {
    try {
      const result = await addToCartMutation.mutateAsync(prodId)
      toast.success('Product Added to Cart', {
        description: 'Continue Shopping', duration: 3000,
      })
      return result
    } catch (error) {
      toast.error('Failed to add product to Cart', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [addToCartMutation])

  const handleRemoveFromCart = useCallback(async (itemId) => {
    try {
      const result = await removeFromCartMutation.mutateAsync(itemId)
      toast.success('Cart Removed', { duration: 3000 })
      return result
    } catch (error) {
      toast.error('Something went wrong!', {
        description: error?.response?.data?.error || 'Try Again!', duration: 3000,
      })
      throw error
    }
  }, [removeFromCartMutation])

  const handleUpdateQuantity = useCallback(async (itemId, newQuantity) => {
    try {
      const result = await updateCartQuantityMutation.mutateAsync({ itemId, newQuantity })
      return result
    } catch (error) {
      toast.error('Something went wrong!', {
        description: error?.response?.data?.error || 'Try Again!', duration: 2000,
      })
      throw error
    }
  }, [updateCartQuantityMutation])

  const clearCartCache = useCallback(() => {
    queryClient.setQueryData(['cart'], { cartItems: [], total: 0, itemCount: 0 })
  }, [queryClient])


  return {
    cartData: data?.cartItems ?? [],
    total: data?.total ?? 0,
    cartQuantity: data?.itemCount ?? 0,
    loading: isLoading,
    clearCartCache,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
  }
}

export default useCart