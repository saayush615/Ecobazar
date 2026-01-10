import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner'

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchCart  = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, { withCredentials: true });
            // console.log(response.data);

            const getCartItems = response.data?.cartItems;
            setCartData(getCartItems);
            setCartQuantity(response.data?.itemCount);
            setTotal(response.data?.total)
        } catch (error) {
            console.error('Failed to fetch cartData', error);
            setCartData([]);
            setCartQuantity(0);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = async (prodId) => {
        if (loading) return;

        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/cart/${prodId}`, {}, { withCredentials: true });
            // console.log(response.data);

            const newItem = response.data?.updatedCart;
            setCartData(newItem);
            setCartQuantity(newItem.length);
            setTotal(response.data?.total);
            toast.success('Product Added to Cart',{ description: 'Continue Shopping', duration: 3000 })
        } catch (error) {
            console.log(error);
            toast.error( 'Failed to add product to Cart', { description: `${error.response?.data?.error}` , duration: 3000 })
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

    useEffect(() => {
      fetchCart()
    }, [])
    
    const value ={
        cartData,
        total,
        cartQuantity,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateQuantity
    }
    return(
        <CartContext.Provider value={value}>
            { children }
        </CartContext.Provider>
    )
}

export default CartContext
