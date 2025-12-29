import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import CartCard from './CartCard'
import axios from 'axios'
import { toast } from 'sonner'

const SheetSidebar = ({ contentType, open, onOpenChange, setCartQuantity }) => {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    switch(contentType){
      case 'Cart':
        getCart();
      case 'Wishlist':
    }
  }, [open, contentType])

  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, { withCredentials: true })
      // console.log(response);
      setCartData(response.data?.cartItems);
      setCartQuantity(response.data?.cartItems.length);
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove/${Itemid}`, { withCredentials: true });
      toast.success('Cart Removed');
      setCartData(prev => prev.filter(item => item._id !== Itemid));
      setCartQuantity(response.data?.cartItems.length);
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
      await axios.put(`${import.meta.env.VITE_API_URL}/cart/update/${itemId}`, { quantity: newQuantity}, { withCredentials: true });
      setCartData(prev => 
        prev.map(item => 
          item._id === itemId ? {...item, quantity: newQuantity} : item
        )
      )
    } catch(error){
      console.error(error);
      toast.error('Something went wrong!', { description: 'Try Again!', duration: 2000 })
    } finally{
      setLoading(false);
    }
  }
  

  return (
      <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent>
              <SheetHeader>
              <SheetTitle>Your {contentType}</SheetTitle>
              <SheetDescription>
                  This is your {contentType}
              </SheetDescription>
              </SheetHeader>
              {cartData.map((item) => <CartCard key={item._id} 
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
                />)
              }
          </SheetContent>
      </Sheet>
  )
}

export default SheetSidebar
