import React, { useState } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CartCard from '@/components/CartCard';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import PaymentMethodDialog from '@/components/PaymentMethodDialog';

const Cart = () => {
    const { cartData, total } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleProceedToOrder = () => {
    if (cartData.length === 0) {
      toast.error('Cart is Empty!');
      return;
    }
    setPaymentDialogOpen(true);
    setLoading(true);
  }

  return (
    <>
      <div className='flex flex-col justify-between gap-1 min-h-screen dark:bg-gray-900'>
        <div>
          <Header />
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 items-start'>
              <div>
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
              <div className='p-5 m-2 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md rounded-xl transition-shadow duration-200'>
                <h3 className='text-2xl font-bold'>Cart Total:</h3>
                <div className='flex flex-row items-center justify-between my-4'>
                  <p className='text-lg'>Sub Total:</p>
                  <span className='text-2xl font-bold text-green-600'>₹{total?.toFixed(2)}</span>
                </div>
                <div>
                  <div className='border-t-2 m-1 p-1 border-gray-700 dark:border-gray-200'></div>
                  <button 
                      onClick={handleProceedToOrder}
                      disabled={loading}
                      className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-2 rounded-lg transition-colors cursor-pointer'
                    >
                      {loading ? 'Processing...' : 'Proceed to Order'}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <PaymentMethodDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        sheetLoading={setLoading}
      />
    </>
  )
}

export default Cart
