import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchWishlist as fetchWishlistApi,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
} from '@/lib/api/wishlist'
import { useAuth } from './useAuth'

export const useWishlist = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['wishlist'],
        queryFn: fetchWishlistApi,
        enabled: isAuthenticated,
        retry: false,
        staleTime: 1000 * 30,
    })

    const addToWishlistMutation = useMutation({
        mutationFn: addToWishlistApi,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['wishlist'] })
            const previousWishlist = queryClient.getQueryData(['wishlist'])
            return { previousWishlist }
        },
        onError: (err, productId, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(['wishlist'], context.previousWishlist)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
    })

    const removeFromWishlistMutation = useMutation({
        mutationFn: removeFromWishlistApi,
        onMutate: async (favoriteId) => {
            await queryClient.cancelQueries({ queryKey: ['wishlist'] })
            const previousWishlist = queryClient.getQueryData(['wishlist'])
            if (previousWishlist) {
                queryClient.setQueryData(['wishlist'], {
                    data: previousWishlist.data?.filter(item => item._id !== favoriteId) || [],
                    count: Math.max(0, (previousWishlist.count || 0) - 1),
                })
            }
            return { previousWishlist }
        },
        onError: (err, favoriteId, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(['wishlist'], context.previousWishlist)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
    })

    const addToWishlist = useCallback(async (prodId) => {
        try {
            const result = await addToWishlistMutation.mutateAsync(prodId)
            toast.success('Product Added to Wishlist', {
                description: 'Continue Shopping', duration: 3000,
            })
            return result
        } catch (error) {
            toast.error('Failed to add product to wishlist', {
                description: error?.response?.data?.error || 'Try Again!', duration: 3000,
            })
            throw error
        }
    }, [addToWishlistMutation])

    const removeFromWishlist = useCallback(async (itemId) => {
        try {
            const result = await removeFromWishlistMutation.mutateAsync(itemId)
            toast.success('Wishlist Removed', { duration: 3000 })
            return result
        } catch (error) {
            toast.error('Something went wrong!', {
                description: error?.response?.data?.error || 'Try Again!', duration: 3000,
            })
            throw error
        }
    }, [removeFromWishlistMutation])

    const wishlistItems = data?.data ?? []

    const isInWishlist = (productId) => {
        return wishlistItems?.some(item => item.product?._id === productId)
    }

    const getWishlistItem = (productId) => {
        return wishlistItems?.find(item => item.product?._id === productId)
    }

  return {
    wishlistItems,
    loading: isLoading,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist: refetch,
    isInWishlist,
    getWishlistItem,
    wishlistCount: wishlistItems?.length ?? 0
  }
}

export default useWishlist