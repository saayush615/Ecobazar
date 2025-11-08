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
import discountbanner from '@/assets/discountbanner.svg'

// Sales
import sale1 from '@/assets/Sales/sale1.svg'
import sale2 from '@/assets/Sales/sale2.svg'
import sale3 from '@/assets/Sales/sale3.svg'

import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import SaleCard from '@/components/SaleCard'

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

  const Sales = [
    {id: 1, name:'Best Deal', title:'Sale of Month', desc:'Few Hours Left!', source: sale1},
    {id: 2, name:'85% Fat Free', title:'Low-Fat Meat', desc:'Starting at ₹80', source: sale2},
    {id: 3, name:'Summer Sale', title:'100% Fresh Fruit', desc:'upto 64% OFF', source: sale3},
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

        {/* Client testimoney */}
        <div className='bg-gray-300 text-black'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex iste corporis ducimus debitis id facilis, cum repellendus nisi quo, omnis perferendis adipisci earum sapiente, a voluptates quod exercitationem distinctio tenetur corrupti soluta est doloribus molestias facere! Perferendis ex pariatur, recusandae minus similique laudantium quaerat nobis, maiores cum accusamus ipsa corrupti!
        </div>

        <img src={discountbanner} alt="discount banner" className='my-2' />        
      </div>

      {/* Footer */}
      <footer className='bg-gray-900 text-white'>
        {/* main footer */}
        <div className='container mx-auto xl:max-w-mainComponent px-4 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* About Section */}
            <div>
              <h3 className='text-xl font-bold mb-4'>Ecobazar</h3>
              <p className='text-gray-400 text-sm leading-relaxed mb-4'>
                Your trusted online grocery store for fresh, organic products delivered to your doorstep.
              </p>
              <div className='flex gap-3'>
                <a href="#" className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700'>
                  <i className='fab fa-facebook-f'></i>
                </a>
                <a href="#" className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700'>
                  <i className='fab fa-twitter'></i>
                </a>
                <a href="#" className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700'>
                  <i className='fab fa-instagram'></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li><a href="#" className='hover:text-green-500'>About Us</a></li>
                <li><a href="#" className='hover:text-green-500'>Shop</a></li>
                <li><a href="#" className='hover:text-green-500'>Contact</a></li>
                <li><a href="#" className='hover:text-green-500'>Blog</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Categories</h4>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li><a href="#" className='hover:text-green-500'>Fresh Fruits</a></li>
                <li><a href="#" className='hover:text-green-500'>Vegetables</a></li>
                <li><a href="#" className='hover:text-green-500'>Meat & Fish</a></li>
                <li><a href="#" className='hover:text-green-500'>Beverages</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Contact Us</h4>
              <ul className='space-y-3 text-gray-400 text-sm'>
                <li className='flex items-start gap-2'>
                  <span>📍</span>
                  <span>123 Street, City, Country</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span>📧</span>
                  <span>info@ecobazar.com</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span>📞</span>
                  <span>+1 234 567 890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* copyright section */}
        <div className='border-t border-gray-800'>
          <div className='container mx-auto xl:max-w-mainComponent px-4 py-4'>
            <p className='text-center text-gray-400 text-sm'>
              © {new Date().getFullYear()} Ecobazar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
