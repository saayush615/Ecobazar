import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar';
import SheetSidebar from './SheetSidebar';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

import Logo from '@/assets/logo.svg'
import { Heart } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Search } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import useDebounce from '@/hooks/useDebounce'

const Header = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [sheetContentType, setSheetContentType] = useState('');

  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { cartQuantity } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const isOnSearchPage = location.pathname === '/search';
  const urlQ = new URLSearchParams(location.search).get('q') ?? '';

  const [searchQuery, setSearchQuery] = useState(urlQ);
  const lastEmittedRef = useRef(urlQ);
  const debouncedSearch = useDebounce(searchQuery, 450);

  useEffect(() => {
    const q = debouncedSearch.trim();
    if (q === lastEmittedRef.current) return;
    lastEmittedRef.current = q;

    if (!q) {
      if (isOnSearchPage) navigate('/search', { replace: true });
      return;
    }

    navigate(`/search?q=${encodeURIComponent(q)}`, { replace: isOnSearchPage });
  }, [debouncedSearch, isOnSearchPage, navigate]);

  useEffect(() => {
    if (!isOnSearchPage) return;
    setSearchQuery(urlQ);
  }, [isOnSearchPage, urlQ]);

  const handleOpenSheet = (type) => {
    setSheetContentType(type);
    setShowSheet(true);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    lastEmittedRef.current = q;
    navigate(`/search?q=${encodeURIComponent(q)}`, { replace: isOnSearchPage });
  };

  return (
    <>
      <div className='py-2 sm:pt-6'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>

            {/* Logo */}
            <div className='shrink-0'>
              <img src={Logo} alt="Logo" className='h-10 w-auto' />
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className='flex items-center flex-1 w-full mx-auto sm:mx-8'>
              <div className='relative w-full'>
                <input
                  type="text"
                  id='Search'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-green-500 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400'
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors cursor-pointer'
                >
                  <Search className='w-5 h-5' />
                </button>
              </div>
            </form>

            {/* Login / Wishlist Icons */}
            {!isAuthenticated ? (
              <div className='flex items-center gap-4'>
                <div className='hidden sm:flex items-center gap-4'>
                  <button
                    className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors active:scale-95 font-medium'
                    onClick={() => navigate('/signup')}
                  >
                    Sign-up
                  </button>
                  <button
                    className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors active:scale-95 font-medium'
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-4'>
                <div className='hidden sm:flex items-center gap-4'>
                  <button
                    className='p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors hover:scale-105 active:scale-95'
                    onClick={() => handleOpenSheet('Wishlist')}
                  >
                    <Heart
                      className='w-6 h-6 text-gray-700 dark:text-gray-100'
                    />
                  </button>
                  <button
                    className='p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors relative hover:scale-105 active:scale-95'
                    onClick={() => handleOpenSheet('Cart')}
                  >
                    <ShoppingCart
                      className='w-6 h-6 text-gray-700 dark:text-gray-100'
                    />
                    { (cartQuantity > 0) &&
                      <span className='absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>{cartQuantity}</span>
                    }
                  </button>
                </div>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className='hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className='w-6 h-6 text-gray-700 dark:text-gray-300' />
              ) : (
                <Moon className='w-6 h-6 text-gray-700 dark:text-gray-300' />
              )}
            </button>
          </div>

        </div>

        <Navbar />
      </div>

      <SheetSidebar
        contentType={sheetContentType}
        open={showSheet}
        onOpenChange={setShowSheet}
      />
    </>
  )
}

export default Header