import React, { useState } from 'react'
import { toast } from 'sonner'
import { CirclePlus, CircleMinus, Trash } from 'lucide-react'
import { createColumnHelper } from '@tanstack/react-table'

import { LoadingOverlay } from '@/components/ui/loading'
import { useSeller } from '@/hooks/useSeller'
import DataTable from './DataTable'

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

const columnHelper = createColumnHelper()

const Products = () => {
  const [deleteDialogue, setDeleteDialogue] = useState({ open: false, productId: null })

  const { products, productsLoading: loading, handleDeleteProduct, handleUpdateProduct, deleteProductPending, updateProductPending } = useSeller()
  const actionLoading = deleteProductPending || updateProductPending

  const handleDelete = async (productId) => {
    try {
      await handleDeleteProduct(productId)
      setDeleteDialogue({ open: false, productId: null })
    } catch (error) {
      // error already toasted by the hook; keep dialog open
    }
  }

  const openDeleteDialoguebox = (productId) => {
    setDeleteDialogue({ open: true, productId })
  }

  const handleStockChange = async (productId, change) => {
    const product = products.find(p => p._id === productId)
    if (!product) { toast.error('Product not found'); return }
    const newStock = product.stock + change
    if (newStock < 0) { toast.error('Stock cannot be negative'); return }
    try {
      await handleUpdateProduct(productId, {
        name: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        category: product.category,
        stock: newStock,
      })
    } catch (error) { /* hook toasts */ }
  }

  const columns = [
    // display() = used for column that doesn't directly correspond to one property in your data
    columnHelper.display({
      id: 'no',
      header: 'No.',
      cell: ({ row, table }) => {
        const idx = table.getPrePaginatedRowModel().rows.findIndex(r => r.original._id === row.original._id)
        return idx + 1
      },
    }),
    // accessor() = Used when the column is connected to a property in your row data.
    columnHelper.accessor('image', {
      header: 'Image',
      enableSorting: false,
      cell: ({ getValue, row }) => (
        getValue() ? (
          <img
            src={getValue()}
            alt={row.original.name}
            className='w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
          />
        ) : (
          <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
            <span className='text-xs text-gray-400'>No image</span>
          </div>
        )
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Product Name',
      cell: info => <span className='font-medium'>{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <span className='px-2 py-1 rounded-full text-xs font-medium text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900'>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('originalPrice', {
      header: 'Price',
      sortFn: 'basic',
      cell: info => (
        <span className='font-semibold text-green-600 dark:text-green-400'>
          ₹{info.getValue()?.toFixed(2)}
        </span>
      ),
    }),
    columnHelper.accessor('discountPrice', {
      header: 'Discount Price',
      sortFn: 'basic',
      cell: info => {
        const val = info.getValue()
        return (
          <span className='font-semibold text-green-600 dark:text-green-400'>
            {val ? `₹${val.toFixed(2)}` : 'No Discount'}
          </span>
        )
      },
    }),
    columnHelper.accessor('stock', {
      header: 'Stock',
      sortFn: 'basic',
      cell: ({ getValue, row }) => {
        const stock = getValue()
        return (
          <div className='flex flex-row items-center gap-1'>
            <button
              onClick={() => handleStockChange(row.original._id, -1)}
              className="active:scale-95 text-red-500 hover:text-red-400 cursor-pointer transition-colors"
              aria-label="Decrease stock"
              disabled={stock === 0}
            >
              <CircleMinus className='h-4 w-4' />
            </button>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              stock > 10
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : stock > 0
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {stock} units
            </span>
            <button
              onClick={() => handleStockChange(row.original._id, 1)}
              className="active:scale-95 text-green-500 hover:text-green-400 cursor-pointer"
              aria-label="Increase stock"
            >
              <CirclePlus className='h-4 w-4' />
            </button>
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <button
          className='hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 cursor-pointer active:scale-95'
          onClick={() => openDeleteDialoguebox(row.original._id)}
        >
          <Trash className='w-4 h-4' />
        </button>
      ),
    }),
  ]

  return (
    <>
      <LoadingOverlay show={actionLoading} text="Processing..." />

      <DataTable
        tableKey='products-table'
        columns={columns}
        data={products}
        loading={loading}
        loadingRows={5}
        loadingCols={8}
        caption={`${products.length} products in your inventory.`}
        pageSize={10}
        emptyMessage='No products found.'
      />

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