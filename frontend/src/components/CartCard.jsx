import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const CartCard = ({ id, Pname, source, category, stock, discountPrice, originalPrice, quantity, onDelete, onUpdate}) => {
  const handleDeleteCart = () => {
    onDelete(id)
  }

  const handleDecreaseQuantity = () => {
    const newQuantity = quantity - 1;
    if(newQuantity >= 1){
      onUpdate(id, newQuantity);
    } else{
      toast.error('Quantity should be 1 or more', {duration: 2000})
    }
  }

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    if(newQuantity <= stock){
      onUpdate(id, newQuantity);
    } else{
      toast.error(`${stock} Product are in stock!`, {duration: 2000})
    }
  }

  return (
    <Card>
      <CardContent className='shadow-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow duration-200 relative'>
        <div className='pt-6 px-2 flex flex-row items-center gap-6'>
          <div className='w-20 h-20 shrink-0 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-700 overflow-hidden'>
            <img 
              src={source} 
              alt={Pname} 
              className='w-full h-full object-cover rounded-lg hover:scale-105' 
            />
          </div>
          <div>
            <div>
              <p className='font-semibold text-base text-gray-900 dark:text-gray-100 leading-tight'>{Pname} </p>
              <p className='text-xs text-muted-foreground dark:text-gray-400'>{category}</p>
              <div className='flex flex-row items-center gap-2'>
                <p className='font-bold text-lg text-green-600'>₹{discountPrice}</p>
                <p className='text-sm text-gray-400 line-through'>₹{originalPrice}</p>
              </div>
            </div>
            <div className='flex flex-row items-center mt-2'>
              <button 
                className="text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-500 p-1 rounded-md hover:shadow-sm transition-all duration-150 cursor-pointer"
                onClick={handleDecreaseQuantity}
              >
                <Minus size={20} />
              </button>
              <p className='bg-gray-200 dark:bg-gray-700 dark:text-gray-100 px-3 py-1 font-semibold'>{quantity}</p>
              <button 
                className="text-gray-400 hover:text-green-500 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 p-1 rounded-md hover:shadow-sm transition-all duration-150 cursor-pointer"
                onClick={handleIncreaseQuantity}
              > 
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
        <div 
          className="absolute top-4 right-4 text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 p-2 rounded-full transition-all duration-200 cursor-pointer active:scale-90 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 dark:hover:text-red-300"
          onClick={handleDeleteCart}
        >
          <Trash2 size={20} />
        </div>
      </CardContent>
    </Card>
  )
}

export default CartCard