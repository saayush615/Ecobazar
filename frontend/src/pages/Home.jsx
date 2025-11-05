import React from 'react'

import fruitCategory from '@/assets/fruitCategory.svg'
import vegeCategory from '@/assets/vegeCategory.svg'
import meatCategory from '@/assets/meatCategory.svg'
import snackCategory from '@/assets/snackCategory.svg'
import bevrageCategory from '@/assets/bevrageCategory.svg'
import breadCategory from '@/assets/breadCategory.svg'
import needsCategory from '@/assets/needsCategory.svg'
import cookCategory from '@/assets/cookCategory.svg'

import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import HeroBanner from '@/assets/herobanner.svg'
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

        {/* Product */}
        <div className='mt-4'>
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0'>Popular Category</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-2 md:px-0'>
            {Categoies.map((category) => {
              return <ProductCard 
                key={category.id}
                title={category.title}
                source={category.source}
                category={true}  
              />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
