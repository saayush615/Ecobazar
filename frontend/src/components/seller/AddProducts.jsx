import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const AddProducts = ({ open, onOpenChange, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/seller/product`,
        data,
        { withCredentials: true }
      )
      toast.success('Product added successfully!');

      reset();
      // Call the callback to trigger refresh
      if (onProductAdded) {
        onProductAdded() // This triggers the refresh
      } else {
        onOpenChange(false) // Fallback if callback not provided
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.error || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

            {/* Product Name */}
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Product Name <span className='text-red-500'>*</span>
              </label>
              <input 
                type='text'
                placeholder='e.g., Fresh Organic Apple'
                {...register('name',{
                  required: { value: true, message: 'Product name is required'}
                })}
                className='border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
              />
              {errors.name && (
                <p className='text-xs text-red-500 mt-1'>{errors.name.message}</p>
              )}
            </div>

            {/* Price */}
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Price (₹) <span className='text-red-500'>*</span>
              </label>
              <input 
                type='number'
                step='0.01'
                placeholder='e.g., 99.99'
                {...register('price',{
                  required: { value: true, message: 'Price is required'},
                  min: { value: 0.01, message: 'Price must be greater than 0'},
                  valueAsNumber: true
                })}
                className='border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
              />
              {errors.price && (
                <p className='text-xs text-red-500 mt-1'>{errors.price.message}</p>
              )}
            </div>

            {/* Category */}
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Category
              </label>
              <select
                {...register('category')}
                className='border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors bg-white dark:bg-gray-800'
              >
                <option value="">Select Category</option>
                <option value="Fresh Fruits">Fresh Fruits</option>
                <option value="Fresh Vegetables">Fresh Vegetables</option>
                <option value="Meat & Fish">Meat & Fish</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Bread Bakery">Bread Bakery</option>
                <option value="Baking Needs">Baking Needs</option>
                <option value="Cooking">Cooking</option>
                <option value="Beauty & Health">Beauty & Health</option>
                <option value="Oils">Oils</option>
                <option value="Diabetic Food">Diabetic Food</option>
                <option value="Dishwash">Dishwash</option>
              </select>
              {errors.category && (
                <p className='text-xs text-red-500 mt-1'>{errors.category.message}</p>
              )}
            </div>

            {/* Stock */}
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Stock Quantity <span className='text-red-500'>*</span>
              </label>
              <input 
                type="number"
                placeholder="100"
                {...register("stock", {
                  required: { value: true, message: 'Stock quantity is required' },
                  min: { value: 0, message: 'Stock cannot be negative' },
                  valueAsNumber: true
                })}
                className='border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
              />
              {errors.stock && (
                <p className='text-red-500 text-xs mt-1'>{errors.stock.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className='flex gap-3 justify-end pt-4'>
              <button
                type='button'
                onClick={() => {
                  reset()
                  onOpenChange(false)
                }}
                className='px-6 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm cursor-pointer'
                disabled={loading}
              >
                Add Product
              </button>
            </div>
          </form>
        </DialogContent>
    </Dialog>
  )
}

export default AddProducts
