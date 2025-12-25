import React, { useState } from 'react'

import { ShoppingBag } from 'lucide-react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios';

const ProductCard = ({ prodId, name, source, originalPrice, discountedPrice}) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAddToCart = async () => {
        if (isLoading) return;

        setIsLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/cart/${prodId}`, {}, { withCredentials: true });
            // console.log(response);
            
            if (response.status === 201) {
                toast.success('Product Added to Cart',{ description: 'Continue Shopping', duration: 3000 })
            }
        } catch (error) {
            console.log(error);
            toast.error( 'Failed to add product to Cart', { description: `${error.response?.data?.error}` , duration: 3000 })
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <div>
        <Card className={`cursor-pointer transition-all duration-300 ease-in-out hover:border-green-700 group`}>

            <CardHeader className='relative'>
                <img src={`${import.meta.env.VITE_API_URL}${source}`} alt="Category" className='w-full h-20 sm:h-24 md:h-28 object-contain' />

                {/* Favourite */}
                <div className='absolute top-2 right-2'>
                    <Heart 
                        className='size-8 p-1.5 bg-white dark:bg-gray-900 rounded-2xl transition-all duration-300 hover:fill-red-500 hover:text-red-500 hover:scale-110 active:scale-90' 
                    />
                </div>

                {/* save */}
                {originalPrice !== discountedPrice && (
                    <div className='absolute top-2 left-2'>
                        <div className='bg-red-500 py-1 px-2 rounded-lg text-xs'>
                            {`Save ₹${Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}%`}
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className={`px-2`}>
                <p className='text-sm transition-colors duration-300 group-hover:text-green-700'>{name}</p>

                <div className='flex flex-row justify-between items-center'>
                    <div>
                        <span className='font-semibold text-gray-900 dark:text-white'>{`₹${discountedPrice}`}</span>
                        {originalPrice !== discountedPrice && (
                            <span className='text-xs text-gray-500 line-through p-2'>{`₹${originalPrice}`}</span>
                        )}
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        className='size-9 p-2 bg-gray-200 dark:text-black transition-colors duration-300 cursor-pointer hover:bg-green-500 rounded-2xl hover:scale-105 active:scale-95'
                        aria-label="Add to cart"
                    >
                        <ShoppingBag className='w-full h-full' />
                    </button>
                </div>

            </CardContent>

            <CardFooter>
                <p className='text-xs p-1'>⭐⭐⭐⭐⭐</p>
            </CardFooter>

        </Card>
    </div>
  )
}

export default ProductCard