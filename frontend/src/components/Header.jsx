import React from 'react'
import Navbar from './Navbar';

import Logo from '@/assets/logo.svg'
import { Heart } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <div className='py-4 sm:py-6'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          
          {/* Logo */}
          <div className='shrink-0'> {/*controlling how flex items shrink.*/}
            <img src={Logo} alt="Logo" className='h-10 w-auto' />
          </div>

          {/* Search Bar */}
          <div className='flex items-center flex-1 max-w-xl mx-auto sm:mx-8'>
            <div className='relative w-full'>
              <input 
                type="text" 
                id='Search' 
                placeholder='Search products...'
                className='w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-green-500 transition-colors' 
              />
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            </div>
          </div>

          {/* Icons */}
          <div className='flex items-center gap-4'>
            <div className='hidden sm:flex items-center gap-4'>
              <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                <Heart className='w-6 h-6 text-gray-700' />
              </button>
              <button className='p-2 hover:bg-gray-100 rounded-full transition-colors relative'>
                <ShoppingCart className='w-6 h-6 text-gray-700' />
                <span className='absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>0</span>
              </button>
            </div>
            <button className='hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors'>
              <Sun className='w-6 h-6 text-gray-700' />
            </button>
          </div>

        </div>
      </div>

      <Navbar />
    </div>
  )
}

export default Header
