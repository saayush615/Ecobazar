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

const SheetSidebar = ({ contentType, open, onOpenChange }) => {
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    switch(contentType){
      case 'Cart':
        getCart();
    }
  }, [open, contentType])

  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, { withCredentials: true })
      console.log(response);
      setCartData(response.data?.cartItems);
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong!', {description: 'Retry!', duration: 3000 });
    } finally {
      setLoading(false)
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
                  Pname={item.product?.name} 
                  source={`${import.meta.env.VITE_API_URL}${item.product?.image}`} 
                  category={item.product?.category} 
                  discountPrice={item.product?.discountPrice} 
                  originalPrice={item.product?.originalPrice}
                  quantity={item.product?.stock}
                />)
              }
          </SheetContent>
      </Sheet>
  )
}

export default SheetSidebar
