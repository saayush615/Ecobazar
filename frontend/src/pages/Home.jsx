import React, {useEffect} from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { toast } from "sonner"

// Popular category
import fruitCategory from '@/assets/Category/fruitCategory.svg'
import vegeCategory from '@/assets/Category/vegeCategory.svg'
import meatCategory from '@/assets/Category/meatCategory.svg'
import snackCategory from '@/assets/Category/snackCategory.svg'
import bevrageCategory from '@/assets/Category/bevrageCategory.svg'
import breadCategory from '@/assets/Category/breadCategory.svg'
import needsCategory from '@/assets/Category/needsCategory.svg'
import cookCategory from '@/assets/Category/cookCategory.svg'
import beauty from '@/assets/Category/beauty.svg'
import oils from '@/assets/Category/oils.svg'
import diabitic from '@/assets/Category/diabitic.svg'
import dishwash from '@/assets/Category/dishwash.svg'

// Popular Products
import g_apple from '@/assets/Products/g_apple.svg'
import malta from '@/assets/Products/malta.svg'
import cabbage from '@/assets/Products/cabbage.svg'
import lattice from '@/assets/Products/lattice.svg'
import brinjal from '@/assets/Products/brinjal.svg'
import potato from '@/assets/Products/potato.svg'
import corn from '@/assets/Products/corn.svg'
import cauliflower from '@/assets/Products/cauliflower.svg'
import capsicum from '@/assets/Products/capsicum.svg'
import chilli from '@/assets/Products/chilli.svg'

// Instagram posts
import Post1 from '@/assets/InstaPost/Post1.svg'
import Post2 from '@/assets/InstaPost/Post2.svg'
import Post3 from '@/assets/InstaPost/Post3.svg'
import Post4 from '@/assets/InstaPost/Post4.svg'
import Post5 from '@/assets/InstaPost/Post5.svg'

import HeroBanner from '@/assets/herobanner.svg'
import discountbanner from '@/assets/discountbanner.svg'
import logo from '@/assets/logo.svg'
import { Instagram } from 'lucide-react';

// Sales
import sale1 from '@/assets/Sales/sale1.svg'
import sale2 from '@/assets/Sales/sale2.svg'
import sale3 from '@/assets/Sales/sale3.svg'

import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import SaleCard from '@/components/SaleCard'
import TestimonySlider from '@/components/TestimonySlider'
import Footer from '@/components/Footer'

const Home = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams()

  // useEffect(() => {
  //   if (location.state?.loginSuccess) {
  //     toast.success('Logged in Successfully!');
  //     // Clear state to prevent showing toast on page refresh
  //     navigate(location.pathname, { replace: true, state: {} })
  //   }
  // }, [])

  useEffect(() => {
    const authStatus = searchParams.get('auth')
    
    if (authStatus === 'loginSuccess') {
      toast.success('Logged in Successfully!');
      setSearchParams({})
    }
  }, [searchParams])
  

  const Categoies = [
    { id: 1, title: 'Fresh Fruits', source: fruitCategory},
    { id: 2, title: 'Fresh Vegetables', source: vegeCategory},
    { id: 3, title: 'Meat & Fish', source: meatCategory},
    { id: 4, title: 'Snacks', source: snackCategory},
    { id: 5, title: 'Beverages', source: bevrageCategory},
    { id: 6, title: 'Bread Bakery', source: breadCategory},
    { id: 7, title: 'Baking Needs', source: needsCategory},
    { id: 8, title: 'Cooking', source: cookCategory},
    { id: 9, title: 'Beauty & Health', source: beauty},
    { id: 10, title: 'Oils', source: oils},
    { id: 11, title: 'Diabitic Food', source: diabitic},
    { id: 12, title: 'Dishwash', source: dishwash},
  ]

  const Products = [
    { id: 1, name: 'Green Apple', source: g_apple, originalPrice: 150, discountedPrice: 120 },
    { id: 2, name: 'Malta', source: malta, originalPrice: 100, discountedPrice: 100 },
    { id: 3, name: 'Cabbage', source: cabbage, originalPrice: 60, discountedPrice: 45 },
    { id: 4, name: 'Lattice', source: lattice, originalPrice: 50, discountedPrice: 35 },
    { id: 5, name: 'Brinjal', source: brinjal, originalPrice: 65, discountedPrice: 50 },
    { id: 6, name: 'Potato', source: potato, originalPrice: 40, discountedPrice: 30 },
    { id: 7, name: 'Corn', source: corn, originalPrice: 80, discountedPrice: 80 },
    { id: 8, name: 'Cauliflower', source: cauliflower, originalPrice: 70, discountedPrice: 55 },
    { id: 9, name: 'Capsicum', source: capsicum, originalPrice: 90, discountedPrice: 70 },
    { id: 10, name: 'Chilli', source: chilli, originalPrice: 55, discountedPrice: 55 },
  ]

  const Sales = [
    {id: 1, name:'Best Deal', title:'Sale of Month', desc:'Few Hours Left!', source: sale1},
    {id: 2, name:'85% Fat Free', title:'Low-Fat Meat', desc:'Starting at ₹80', source: sale2},
    {id: 3, name:'Summer Sale', title:'100% Fresh Fruit', desc:'upto 64% OFF', source: sale3},
  ]

  return (
    <div className='dark:bg-gray-900 dark:text-white min-h-screen'>
      <div>
        <Header />
      </div>
      <div className='container mx-auto xl:max-w-mainComponent'>

        {/* Hero component */}
        <div>
          <HeroSlider />
          <img src={HeroBanner} alt="HeroBanner" />
        </div>

        {/* Popular category */}
        <div className='mt-4'>
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0 dark:text-white'>Popular Category</h3>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 px-2 md:px-0'>
            {Categoies.map((category) => {
              return <CategoryCard 
                key={category.id}
                title={category.title}
                source={category.source}
              />
            })}
          </div>
        </div>

        {/* Popular Product */}
        <div className='mt-4'>
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0 dark:text-white'>Popular Products</h3>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-0 '>
            {Products.map((product) => {
              return <ProductCard 
                key={product.id}
                name={product.name}
                source={product.source}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
              />
            })}
          </div>
        </div>

        {/* Sales */}
        <div className='mt-4'>
          <div className='grid grid-cols-3 gap-0 '>
            {Sales.map((sale) => {
              return <SaleCard 
                key={sale.id}
                name={sale.name}
                title={sale.title}
                desc={sale.desc}
                source={sale.source}
              />
            })}
          </div>
        </div>        
      </div>

      {/* Client testimoney */}
      <div className='bg-gray-300 py-3 dark:bg-gray-600'>
        <TestimonySlider />
      </div>

      {/* Sales and Instragram Banners */}
      <div className='container mx-auto xl:max-w-mainComponent'>
        <img src={discountbanner} alt="discount banner" className='my-2' />
        <div className='mb-1'>
          <h3 className='text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0 dark:text-white'>Follow us on Instagram</h3>
          <div className='flex flex-row justify-evenly items-center'>

            {[Post1, Post2, Post3, Post4, Post5].map((post, index) => (
              <a
                key={index}
                href="https://www.instagram.com/yourprofile" // Replace with your Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden"
              >
                {/* 
                  rel="noopener noreferrer" - Security & Privacy
                  - noopener: Prevents new tab from accessing window.opener (stops reverse tabnabbing attacks)
                  - noreferrer: Hides referrer info from destination site
                  - Always use with target="_blank"
                */}

                <img src={post} alt={`Post${index + 1}`} className="block" />
                {/* Overlay with light green background */}
                <div className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                {/* Instagram logo - only visible on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Instagram className='text-white size-10' />
                </div>
              </a>
            ))}

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
