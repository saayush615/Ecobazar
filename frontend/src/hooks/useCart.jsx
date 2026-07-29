import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import {
  fetchCart as fetchCartThunk,
  addToCart,
  removeCart,
  updateCartQuantity,
  setCartData as setCartDataAction,
  setCartQuantity as setCartQuantityAction,
  setTotal as setTotalAction,
} from '@/store/slices/cartSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const { cartData, total, cartQuantity, loading, error } = useSelector(
    (state) => state.cart
  )

  const fetchCart = useCallback(() => {
    return dispatch(fetchCartThunk())
  }, [dispatch])

  const setCartData = useCallback(
    (value) => {
      dispatch(setCartDataAction(value))
    },
    [dispatch]
  )

  const setCartQuantity = useCallback(
    (value) => {
      dispatch(setCartQuantityAction(value))
    },
    [dispatch]
  )

  const setTotal = useCallback(
    (value) => {
      dispatch(setTotalAction(value))
    },
    [dispatch]
  )

  const handleAddToCart = useCallback(
    async (prodId) => {
      try {
        const result = await dispatch(addToCart(prodId))

        if (addToCart.fulfilled.match(result)) {
          toast.success('Product Added to Cart', {
            description: 'Continue Shopping',
            duration: 3000,
          })
        } else {
          toast.error('Failed to add product to Cart', {
            description: result.payload || 'Try Again!',
            duration: 3000,
          })
        }

        return result
      } catch (error) {
        toast.error('Failed to add product to Cart', {
          description: 'Try Again!',
          duration: 3000,
        })
        throw error
      }
    },
    [dispatch]
  )

  const handleRemoveFromCart = useCallback(
    async (itemId) => {
      try {
        const result = await dispatch(removeCart(itemId))

        if (removeCart.fulfilled.match(result)) {
          toast.success('Cart Removed', { duration: 3000 })
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

  const handleUpdateQuantity = useCallback(
    async (itemId, newQuantity) => {
      try {
        const result = await dispatch(
          updateCartQuantity({ itemId, newQuantity })
        )

        if (!updateCartQuantity.fulfilled.match(result)) {
          toast.error('Something went wrong!', {
            description: result.payload || 'Try Again!',
            duration: 2000,
          })
        }

        return result
      } catch (error) {
        toast.error('Something went wrong!', {
          description: 'Try Again!',
          duration: 2000,
        })
        throw error
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return {
    cartData,
    total,
    cartQuantity,
    loading,
    error,
    setCartData,
    setCartQuantity,
    setTotal,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    fetchCart,
  }
}

export default useCart