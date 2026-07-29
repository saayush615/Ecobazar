import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import {
  fetchWishlist as fetchWishlistThunk,
  addToWishlist as addWishlistThunk,
  removeFromWishlist as removeWishlistThunk,
} from '@/store/slices/wishlistSlice'

export const useWishlist = () => {
    const dispatch = useDispatch()
    const { wishlistItems, loading, error } = useSelector(
        (state) => state.wishlist
    )

    const fetchWishlist = useCallback(() => {
        return dispatch(fetchWishlistThunk())
    }, [dispatch])

    const addToWishlist = useCallback(
        async (prodId) => {
        try {
            const result = await dispatch(addWishlistThunk(prodId))

            if (addWishlistThunk.fulfilled.match(result)) {
            toast.success('Product Added to Wishlist', {
                description: 'Continue Shopping',
                duration: 3000,
            })
            } else {
            toast.error('Failed to add product to wishlist', {
                description: result.payload || 'Try Again!',
                duration: 3000,
            })
            }

            return result
        } catch (error) {
            toast.error('Failed to add product to wishlist', {
            description: 'Try Again!',
            duration: 3000,
            })
            throw error
        }
        },
        [dispatch]
    )

    const removeFromWishlist = useCallback(
        async (itemId) => {
        try {
            const result = await dispatch(removeWishlistThunk(itemId))

            if (removeWishlistThunk.fulfilled.match(result)) {
            toast.success('Wishlist Removed', { duration: 3000 })
            } else {
            toast.error('Something went wrong!', {
                description: result.payload || 'Try Again!',
                duration: 3000,
            })
            }

            return result
        } catch (error) {
            toast.error('Something went wrong!', {
            description: 'Try Again!',
            duration: 3000,
            })
            throw error
        }
        },
        [dispatch]
    )

    const isInWishlist = (productId) => {
        return wishlistItems?.some(item => item.product?._id === productId);
    }

    const getWishlistItem = (productId) => {
        return wishlistItems?.find(item => item.product._id === productId);
    }

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    isInWishlist,
    getWishlistItem,
    wishlistCount: wishlistItems?.length ?? 0
  }
}

export default useWishlist