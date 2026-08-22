import React, {useState, useEffect} from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { useParams } from 'react-router-dom'
import { getCategoryBySlug } from '@/config/categories'
import { useProductsByCategory } from '@/hooks/useProduct'
import { LoadingOverlay } from '@/components/ui/loading'

const Category = () => {
    const [title, setTitle] = useState('');
    const [banner, setBanner] = useState(null);
    const [pageNotFound, setPageNotFound] = useState(false);
    const { categoryslug } = useParams();

    const isReady = !pageNotFound && !!categoryslug;
    const { products: allProducts, loading } = useProductsByCategory(isReady ? categoryslug : null);
  
    useEffect(() => {
      const data = getCategoryBySlug(categoryslug);
      if (!data) {
        setPageNotFound(true);
        return;
      }
      setTitle(data.title);
      setBanner(data.banner);
    }, [categoryslug])

    if (pageNotFound) {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>404</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>Page not found</p>
          <a href='/' className='mt-4 text-green-600 hover:underline'>Go Home</a>
        </div>
      )
    }

  return (
    <>
    <LoadingOverlay show={loading} text="Loading..." />
    <div className='flex flex-col justify-between gap-1 min-h-screen dark:bg-gray-900'>
      <div>
        <Header />
        <div className='container mx-auto px-4'>
          <div className='w-full h-20 overflow-hidden relative'>
            <img src={banner} alt="Banner" className='w-full h-full object-cover blur-xs brightness-50 rounded-2xl' />
            <h3 className='text-4xl font-semibold text-white shadow-md absolute top-1/4 left-1/12'>{title}</h3>
          </div>

          <div className='mt-4'>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-0 '>
              {allProducts.map((product) => {
                return <ProductCard 
                  key={product._id}
                  prodId={product._id}
                  name={product.name}
                  source={product.image}
                  originalPrice={product.originalPrice}
                  discountedPrice={product.discountPrice}
                  averageRating={product.averageRating}
                  reviewCount={product.reviewCount}
                />
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  )
}

export default Category
