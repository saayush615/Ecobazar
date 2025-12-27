import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Minus, Plus, Trash2 } from 'lucide-react'

const CartCard = ({ Pname, source, category, discountPrice, originalPrice, quantity}) => {

  return (
    <Card>
      <CardContent className='shadow-sm border border-gray-200 bg-white rounded-xl hover:shadow-md transition-shadow duration-200 relative'>
        <div className='pt-6 px-2 flex flex-row items-center gap-6'>
          <div className='w-20 h-20 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden'>
            <img 
              src={source} 
              alt={Pname} 
              className='w-full h-full object-cover rounded-lg hover:scale-105' 
            />
          </div>
          <div>
            <div>
              <p className='font-semibold text-base text-gray-900 leading-tight'>{Pname} </p>
              <p className='text-xs text-muted-foreground'>{category}</p>
              <div className='flex flex-row items-center gap-2'>
                <p className='font-bold text-lg text-green-600'>₹{discountPrice}</p>
                <p className='text-sm text-gray-400 line-through'>₹{originalPrice}</p>
              </div>
            </div>
            <div className='flex flex-row items-center mt-2'>
              <button className="text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 p-1 rounded-md hover:shadow-sm transition-all duration-150 cursor-pointer"><Minus size={20} /></button>
              <p className='bg-gray-200 px-3 py-1 font-semibold'>{quantity}</p>
              <button className="text-gray-400 hover:text-green-500 border border-gray-200 hover:border-green-300 p-1 rounded-md hover:shadow-sm transition-all duration-150 cursor-pointer"> <Plus size={20} /></button>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 p-2 rounded-full transition-all duration-200 cursor-pointer active:scale-90">
          <Trash2 size={20} />
        </div>
      </CardContent>
    </Card>
  )
}

export default CartCard