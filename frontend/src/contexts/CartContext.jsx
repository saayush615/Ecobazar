import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [cartQuantity, setCartQuantity] = useState(0);

    const fetchCart  = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, { withCredentials: true });
            console.log(response.data);
            setCartData(response.data?.cartItems);
            setCartQuantity(response.data?.itemCount);
        } catch (error) {
            console.error('Failed to fetch cartData', error);
            setCartData([]);
            setCartQuantity(0);
        } finally {
            setLoading(false);
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
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!', { description: 'Try Again!', duration: 3000 })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      fetchCart()
    }, [])
    
    const value ={

    }
    return(
        <CartContext.Provider value={value}>
            { children }
        </CartContext.Provider>
    )
}

export default CartContext
