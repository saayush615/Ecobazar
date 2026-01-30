import React from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { toast } from 'sonner'
import { useWishlist } from '@/hooks/useWishlist'
import FavCard from '@/components/FavCard'

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    const handleRemoveFromWishlist = async (favoriteId) => {
        const result = await removeFromWishlist(favoriteId);
        
        if (result.success) {
        toast.success('Removed from Wishlist');
        } else {
        toast.error(result.error || 'Failed to remove');
        }
    }
    
  return (
    <div className='flex flex-col justify-between gap-1 min-h-screen dark:bg-gray-900'>
      <div>
        <Header />
        <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              {wishlistItems.map((item) => (
                  <FavCard 
                    key={item._id}
                    id={item._id}
                    productId={item.product?._id}
                    name={item.product?.name}
                    source={`${import.meta.env.VITE_API_URL}${item.product?.image}`}
                    category={item.product?.category}
                    discountPrice={item.product?.discountPrice}
                    originalPrice={item.product?.originalPrice}
                    stock={item.product?.stock}
                    onRemove={handleRemoveFromWishlist}
                  />
              ))
              }
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Wishlist
