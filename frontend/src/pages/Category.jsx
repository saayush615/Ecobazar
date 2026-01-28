import React, {useState, useEffect} from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'

import Vegetable_Banner from '@/assets/Category_banner/vegetable_category_banner.jpg'

const Category = () => {
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([])
  
    async function getAllProdct() {
      setLoading(true);
      try {
        const prod = await axios.get(`${import.meta.env.VITE_API_URL}/product/all`);
        console.log(prod.data?.products)
        setAllProducts(prod.data?.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      getAllProdct()
    }, [])

  return (
    <div className='flex flex-col justify-between gap-1 min-h-screen dark:bg-gray-900'>
      <div>
        <Header />
        <div className='container mx-auto px-4'>
          <div className='w-full h-20 overflow-hidden relative'>
            <img src={Vegetable_Banner} alt="Vegetable_Banner" className='w-full h-full object-cover blur-xs brightness-50 rounded-2xl' />
            <h3 className='text-4xl font-semibold text-white shadow-md absolute top-1/4 left-1/12'>Category</h3>
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
                />
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Category
