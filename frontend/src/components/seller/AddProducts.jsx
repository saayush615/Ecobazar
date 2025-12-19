import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const AddProducts = ({ open, onOpenChange, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store actual file
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPEG, PNG, GIF, WebP) are allowed');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create FormData to send file + text data
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('stock', data.stock);
      
      // Append image if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/seller/product`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Product added successfully!');
      reset();
      removeImage();
      
      if (onProductAdded) {
        onProductAdded();
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    removeImage();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

          {/* Product Image Upload */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Product Image
            </label>
            
            {!imagePreview ? (
              <label 
                htmlFor="image-upload"
                className='border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-green-500 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800'
              >
                <Upload className='w-8 h-8 text-gray-400' />
                <span className='text-sm text-gray-500'>Click to upload image</span>
                <span className='text-xs text-gray-400'>PNG, JPG, GIF, WebP up to 5MB</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className='hidden'
                />
              </label>
            ) : (
              <div className='relative rounded-lg overflow-hidden border-2 border-gray-300'>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className='w-full h-64 object-contain bg-gray-100 dark:bg-gray-800'
                />
                <button
                  type='button'
                  onClick={removeImage}
                  className='absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            )}
          </div>

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

          {/* Price and Stock in Grid */}
          <div className='grid grid-cols-2 gap-4'>
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

            {/* Stock */}
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Stock <span className='text-red-500'>*</span>
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
          </div>

          {/* Action buttons */}
          <div className='flex gap-3 justify-end pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='px-6 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" variant="secondary" text="Adding..." /> : 'Add Product'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProducts