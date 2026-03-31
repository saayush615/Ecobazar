import React from 'react'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useCart } from '@/hooks/useCart'
import { HandHelping, Heart, ShoppingBag } from 'lucide-react'

const FavCard = ({ id, productId, name, source, category, discountPrice, originalPrice, stock, onRemove }) => {

  const { handleAddToCart } = useCart()

  return (
    <Card>
      <CardContent className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 relative">
        <div className='pt-6 px-2'>
          <div className='flex flex-row items-center gap-2 mb-3'>
            <div className='w-20 h-20 shrink-0 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-700 overflow-hidden'>
              <img 
                src={source} 
                alt={name} 
                className='w-full h-full rounded-lg hover:scale-105 object-cover'
              />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{name}</h3>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>{category}</p>
              <div className='flex flex-row items-center gap-2'>
                <p className='font-bold text-lg text-green-600'>₹{discountPrice}</p>
                <span className='text-sm text-gray-400 line-through'>₹{originalPrice}</span>
              </div>
              <div className='mt-1'>
                {stock > 5 && (
                  <span className='inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full'>
                    <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>
                    In Stock
                  </span>
                )}
                {stock > 0 && stock <= 5 && (
                  <span className='inline-flex items-center gap-1 text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full'>
                    <span className='w-1.5 h-1.5 bg-orange-500 rounded-full'></span>
                    Only {stock} left
                  </span>
                )}
                {stock === 0 && (
                  <span className='inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full'>
                    <span className='w-1.5 h-1.5 bg-red-500 rounded-full'></span>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleAddToCart(productId)}
            className='w-full flex flex-row items-center justify-center gap-1 rounded-lg bg-green-700 hover:bg-green-600 active:scale-95 transition-all duration-200 cursor-pointer py-2 px-1'
            aria-label='Add to Cart'
          >
            <ShoppingBag className='w-4 h-4' /> 
            <span>Add to cart</span>
          </button>
          <div>
            <button
              onClick={() => onRemove(id)}
              className='p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 rounded-lg transition-colors active:scale-95 absolute top-4 right-4 cursor-pointer'
              aria-label='Remove from wishlist'
            >
              <Heart className='w-4 h-4  fill-current' />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FavCard