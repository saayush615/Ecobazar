import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { toast } from 'sonner'

import { TableSkeleton, LoadingOverlay } from '@/components/ui/loading'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OrderHistory = () => {
    const [loading, setLoading] = useState(true); 
    const [products, setProducts] = useState([]);

    if (loading) {
        return (
          <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <TableSkeleton rows={5} columns={7} />
          </div>
        )
      }

  return (
    <>
      <LoadingOverlay show={actionLoading} text="Processing..." />

      <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <Table>
        <TableCaption className='py-4'>{products.length} products in your inventory.</TableCaption>
        <TableHeader>
            <TableRow>
              <TableHead className="w-20 font-semibold">No.</TableHead>
              <TableHead className='font-semibold'>Image</TableHead>
              <TableHead className='font-semibold'>Product Name</TableHead>
              <TableHead className='font-semibold'>Category</TableHead>
              <TableHead className='font-semibold'>Price</TableHead>
              <TableHead className='font-semibold'>Discount Price</TableHead>
              <TableHead className='font-semibold'>Stock</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product,index) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                {index + 1}
              </TableCell>
              <TableCell>
                {product.image ? (
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
                  />
                ) : (
                  <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                    <span className='text-xs text-gray-400'>No image</span>
                  </div>
                )}
              </TableCell>
              <TableCell className='font-medium'>
                {product.name}
              </TableCell>
              <TableCell className='px-2 py-1 rounded-full text-xs font-medium text-green-800'>
                {product.category}
              </TableCell>
              <TableCell className='font-semibold text-green-600 dark:text-green-400'>
                ₹{product.originalPrice?.toFixed(2)}
              </TableCell>
              <TableCell className='font-semibold text-green-600 dark:text-green-400'>
                ₹{ product.discountPrice ? product.discountPrice?.toFixed(2) : 'No Discount'}
              </TableCell>
              <TableCell className='font-medium'>
                <div className='flex flex-row items-center gap-1'>
                  <button
                    onClick={() => handleStockChange(product._id, -1)}
                    className="active:scale-95 text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                    aria-label="Decrease stock"
                    disabled={product.stock === 0}
                  >
                    <CircleMinus className='h-4 w-4' />
                  </button>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {product.stock} units
                  </span>
                  <button
                    onClick={() => handleStockChange(product._id, 1)}
                    className="active:scale-95 text-green-500 hover:text-green-400 cursor-pointer"
                    aria-label="Increase stock"
                  >
                    <CirclePlus className='h-4 w-4' />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <button
                  className='hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 cursor-pointer active:scale-95'
                  onClick={() => openDeleteDialoguebox(product._id)}
                >
                  <Trash className='w-4 h-4' />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </>
  )
}

export default OrderHistory
