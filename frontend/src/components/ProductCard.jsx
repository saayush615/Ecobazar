import React from 'react'

import { ShoppingBag } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ProductCard = ({ name, source, originalPrice, discountedPrice}) => {
  return (
    <div>
        <Card className={`cursor-pointer transition-all duration-300 ease-in-out hover:border-green-700 group`}>

            <CardHeader>
                <img src={source} alt="Category" className='w-full h-20 sm:h-24 md:h-28 object-contain' />
            </CardHeader>

            <CardContent className={`px-2`}>
                <p className='text-sm transition-colors duration-300 group-hover:text-green-700'>{name}</p>

                <div className='flex flex-row justify-between items-center'>
                    <div>
                        <span className='font-semibold text-gray-900'>{discountedPrice}</span>
                        {originalPrice !== discountedPrice && (
                            <span className='text-xs text-gray-500 line-through p-2'>{originalPrice}</span>
                        )}
                    </div>

                    <ShoppingBag className='size-9 p-2 hover:bg-green-500 rounded-2xl' />
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