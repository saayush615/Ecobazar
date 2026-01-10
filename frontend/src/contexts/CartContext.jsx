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
