import React from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CartCard from '@/components/CartCard';
import { useCart } from '@/hooks/useCart';

const Cart = () => {
    const { cartData } = useCart();

  return (
    <div className='flex flex-col justify-between gap-1 min-h-screen dark:bg-gray-900'>
      <div>
        <Header />
        <div className='container mx-auto px-4'>
            {cartData.map((item) => 
                (<CartCard key={item._id} 
                    id={item._id}
                    Pname={item.product?.name} 
                    source={`${import.meta.env.VITE_API_URL}${item.product?.image}`} 
                    category={item.product?.category} 
                    stock={item.product?.stock} 
                    discountPrice={item.product?.discountPrice} 
                    originalPrice={item.product?.originalPrice}
                    quantity={item.quantity}
            />))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Cart
