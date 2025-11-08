import React from 'react'

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

import HeroBanner from '@/assets/herobanner.svg'

import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'

const Home = () => {

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

  return (
    <div>
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
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0'>Popular Category</h3>
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
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0'>Popular Products</h3>
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

        
      </div>
    </div>
  )
}

export default Home
