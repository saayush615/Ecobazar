import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet"

import CartCard from './CartCard'
import FavCard from './FavCard';
import PaymentMethodDialog from './PaymentMethodDialog';
import axios from 'axios'
import { toast } from 'sonner'

import { useWishlist } from '@/hooks/useWishlist'

const SheetSidebar = ({ contentType, open, onOpenChange }) => {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const { wishlistItems, loading: wishlistLoading, removeFromWishlist, wishlistCount } = useWishlist();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setLoading(true);
    try{
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/cart/update/${itemId}`, { quantity: newQuantity}, { withCredentials: true });
      // console.log(response)
      const updatedItem = response.data?.newcart;

      const oldItem = cartData.find(item => item._id === itemId);
      const oldPrice = oldItem.quantity * oldItem.product?.discountPrice;

      setCartData(prev => 
        prev.map(item => 
          item._id === itemId ? updatedItem : item
        )
      );

      const newPrice = updatedItem.quantity * updatedItem.product?.discountPrice;

      setTotal(prev => prev - oldPrice + newPrice);
    } catch(error){
      console.error(error);
      toast.error('Something went wrong!', { description: 'Try Again!', duration: 2000 })
    } finally{
      setLoading(false);
    }
  }

    const handleRemoveFromWishlist = async (favoriteId) => {
    const result = await removeFromWishlist(favoriteId);
    
    if (result.success) {
      toast.success('Removed from Wishlist');
    } else {
      toast.error(result.error || 'Failed to remove');
    }
  }

  const handleProceedToPay = () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setPaymentDialogOpen(true);
    setLoading(true);
  }
  

  return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent>
              <SheetHeader>
              <SheetTitle>Your {contentType}</SheetTitle>
              <SheetDescription>
                  This is your {contentType}
              </SheetDescription>
              </SheetHeader>
              { contentType === 'Cart' && (
                cartData.map((item) => 
                  (<CartCard key={item._id} 
                    id={item._id}
                    Pname={item.product?.name} 
                    source={`${import.meta.env.VITE_API_URL}${item.product?.image}`} 
                    category={item.product?.category} 
                    stock={item.product?.stock} 
                    discountPrice={item.product?.discountPrice} 
                    originalPrice={item.product?.originalPrice}
                    quantity={item.quantity}
                    onDelete={handleRemoveFromCart}
                    onUpdate={handleUpdateQuantity}
                  />))
              )}

              { contentType === 'Wishlist' && (
                wishlistItems.map((item) => (
                <FavCard 
                  key={item._id}
                  id={item._id}
                  productId={item.product?._id}
                  name={item.product?.name}
                  source={`${import.meta.env.VITE_API_URL}${item.product?.image}`}
                  category={item.product?.category}
                  discountPrice={item.product?.discountPrice}
                  originalPrice={item.product?.originalPrice}
                  stock={item.product?.stock}
                  onRemove={handleRemoveFromWishlist}
                />))
              )}

            <SheetFooter>
              { contentType === 'Cart' && (
                <div className='w-full space-y-3'>
                  <div className='flex justify-between items-center border-t pt-3'>
                    <p className='text-lg font-semibold'>Total:</p>
                    <p className='text-2xl font-bold text-green-600'>₹{total?.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={handleProceedToPay}
                    disabled={loading}
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-2 rounded-lg transition-colors'
                  >
                    {loading ? 'Processing...' : 'Proceed to Pay'}
                  </button>
                </div>
              )}
            </SheetFooter>
          </SheetContent>
      </Sheet>

      <PaymentMethodDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        sheetLoading={setLoading}
        setCartData={setCartData}
        setTotal={setTotal}
      />
    </>
  )
}

export default SheetSidebar
