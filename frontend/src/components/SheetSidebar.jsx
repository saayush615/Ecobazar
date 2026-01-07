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
import axios from 'axios'
import { toast } from 'sonner'

import { useWishlist } from '@/hooks/useWishlist'

const SheetSidebar = ({ contentType, open, onOpenChange, setCartQuantity }) => {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);

  const { wishlistItems, loading: wishlistLoading, removeFromWishlist, wishlistCount } = useWishlist();

  useEffect(() => {
    switch(contentType){
      case 'Cart':
        getCart();
      case 'Wishlist':
        break;
    }
  }, [open, contentType])

  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, { withCredentials: true })
      // console.log(response);
      setCartData(response.data?.cartItems);
      setCartQuantity(response.data?.cartItems.length);
      setTotal(response.data?.total);
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong!', {description: 'Retry!', duration: 3000 });
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromCart = async (Itemid) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove/${Itemid}`, { withCredentials: true });
      toast.success('Cart Removed');

      const removedItem = response.data?.cartItem;
      setCartData(prev => prev.filter(item => item._id !== Itemid));
      setCartQuantity(prev => prev - 1 );
      setTotal(prev => prev - (removedItem.quantity * removedItem.product?.discountPrice));
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!', { description: 'Try Again!', duration: 3000 })
    } finally {
      setLoading(false);
    }
  }

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

  // Razorpay Payment Handler
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create order on backend
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/create-order`,
        {},
        { withCredentials: true }
      );

      const { order, orderId, key } = orderResponse.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Ecobazar",
        description: "Product Purchase",
        order_id: order.id,
        
        // Success handler
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/order/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              setCartData([]);
              setCartQuantity(0);
              setTotal(0);
              onOpenChange(false);
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Verification error:', error);
          }
        },

        // Prefill user details
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },

        // Theme customization
        theme: {
          color: "#22c55e" // Green color matching your theme
        },

        // Modal settings
        modal: {
          ondismiss: async function() {
            // Handle payment cancellation
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/order/payment-failure`,
                { orderId: orderId },
                { withCredentials: true }
              );
              toast.error('Payment cancelled');
            } catch (error) {
              console.error('Error recording cancellation:', error);
            }
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };
  

  return (
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
                    onClick={handlePayment}
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
  )
}

export default SheetSidebar
