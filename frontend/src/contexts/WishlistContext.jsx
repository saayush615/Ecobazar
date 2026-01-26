import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);

    const fetchWishlist = async () => {
        setLoading(true)
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/fav/`, { withCredentials: true });
            // console.log(response);
            setWishlistItems(response.data?.data || []);
        } catch(error) {
            // console.error('Failed to fetch wishlist:',error);
            setWishlistItems([]);
        } finally {
            setLoading(false)
        }
    }

    const addToWishlist = async (productId) => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/fav/`, { productId }, { withCredentials: true });
            // console.log(response);
            if (response.status === 201) {
                setWishlistItems(prev => [...prev, response.data.favcard]);
                return { success: true };
            }
        } catch(error) {
            console.error(error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add to Wishlist'
            }
        }
    }

    const removeFromWishlist = async (favoriteId) => {
        try{
            await axios.delete(`${import.meta.env.VITE_API_URL}/fav/${favoriteId}`,{ withCredentials: true });

            setWishlistItems(prev => prev.filter(item => item._id !== favoriteId));
            return { success: true };
        } catch(error){
            console.error('Failed to remove from wishlist:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to remove from wishlist'
            };
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product?._id === productId);
    }

    const getWishlistItem = (productId) => {
        return wishlistItems.find(item => item.product._id === productId);
    }

    useEffect(() => {
        fetchWishlist();
    },[]);

    const value = {
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistItem,
        wishlistCount: wishlistItems.length
    }
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistContext
