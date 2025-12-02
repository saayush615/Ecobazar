import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Pencil, Trash  } from 'lucide-react';

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [deleteDialogue, setDeleteDialogue ] = useState({ open: false, productId: null})

  useEffect(() => {
    fetchProducts();
  },[]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller/getProduct`,
        { withCredentials: true }
      )

      // console.log(response.data?.products);
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
    setLoading(true);
    try{
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/seller/remove/${productId}`,
        { withCredentials: true }
      )
      setProducts(prev => prev.filter(p => p._id !== productId))
      toast.success('Product deleted successfully!')
      setDeleteDialogue({ open: false, productId: null })
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.error || 'Failed to delete product')
    } finally {
      setLoading(false);
    }
  }

  const openDeleteDialoguebox = (productId) => {
    setDeleteDialogue({ open: true, productId: productId})
  }

  return (
    <>
      <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <Table>
        <TableCaption className='py-4'>{products.length} products in your inventory.</TableCaption>
        <TableHeader>
            <TableRow>
              <TableHead className="w-20 font-semibold">No.</TableHead>
              <TableHead className='font-semibold'>Product Name</TableHead>
              <TableHead className='font-semibold'>Category</TableHead>
              <TableHead className='font-semibold'>Price</TableHead>
              <TableHead className='font-semibold'>Stock</TableHead>
              <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product,index) => (
            <TableRow
              key={product._id}
            >
              <TableCell className="font-medium text-gray-600 dark:text-gray-400">
                {index + 1}
              </TableCell>
              <TableCell className='font-medium'>
                {product.name}
              </TableCell>
              <TableCell className='px-2 py-1 rounded-full text-xs font-medium text-green-800'>
                {product.category}
              </TableCell>
              <TableCell className='font-semibold text-green-600 dark:text-green-400'>
                ₹{product.price.toFixed(2)}
              </TableCell>
              <TableCell className='font-medium'>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.stock} units
                </span>
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-center gap-2'>
                  <button
                    className='p-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 cursor-pointer active:scale-95'
                    // onClick={}
                  >
                    <Pencil className='w-4 h-4'  />
                  </button>

                  <button
                    className='p-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 cursor-pointer active:scale-95'
                    onClick={() => openDeleteDialoguebox(product._id)}
                  >
                    <Trash className='w-4 h-4' />
                  </button>
                </div>
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
