import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { CirclePlus , CircleMinus , Trash  } from 'lucide-react';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Products = () => {
  const [loading, setLoading] = useState(true);  // Initial loading
  const [products, setProducts] = useState([]);
  const [deleteDialogue, setDeleteDialogue ] = useState({ open: false, productId: null})
  const [actionLoading, setActionLoading] = useState(false); // For delete and update operation

  useEffect(() => {
    fetchProducts();
  },[]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller/`,
        { withCredentials: true }
      )
      // console.log(response.data?.products)
      setProducts(response.data?.products || [])
    }catch (error){
      console.error('Fetch Data error', error);
      toast.error(error.response?.data?.error || 'Failed to fetch the products');
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    setActionLoading(true);
    try{
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/seller/${productId}`,
        { withCredentials: true }
      )
      setProducts(prev => prev.filter(p => p._id !== productId))
      toast.success('Product deleted successfully!')
      setDeleteDialogue({ open: false, productId: null })
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.error || 'Failed to delete product')
    } finally {
      setActionLoading(false);
    }
  }

  const openDeleteDialoguebox = (productId) => {
    setDeleteDialogue({ open: true, productId: productId})
  }

  const handleStockChange = async (productId, change) => {
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      toast.error('Product not found');
      return;
    }

    const newStock = product.stock + change;
    
    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    const previousProducts = [...products];
    setProducts(prev => 
      prev.map(p => p._id === productId 
        ? { ...p, stock: newStock } 
        : p
      )
    );

    try {
      const updatedProduct = {
        ...product,
        stock: newStock
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/seller/${productId}`,
        updatedProduct,
        { withCredentials: true }
      );

      toast.success(`Stock ${change > 0 ? 'increased' : 'decreased'} successfully!`);
    } catch (error) {
      setProducts(previousProducts);
      console.error('Stock update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update stock');
    }
  }

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  }

  if (loading) {
    return (
      <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <TableSkeleton rows={5} columns={7} />
      </div>
    )
  }

  return (
    <>
      {/* ⭐ Loading overlay for delete/update operations */}
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

      {/* Delete Dialogue box */}
      <AlertDialog 
        open={deleteDialogue.open} 
        onOpenChange={(open) => setDeleteDialogue({ open, productId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteDialogue.productId)}
              className='bg-red-600 hover:bg-red-700 cursor-pointer'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Products