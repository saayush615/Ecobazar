import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className='bg-gray-800 dark:bg-gray-900 text-white mt-0 sm:mt-2'>
        <div className='container mx-auto'>
          
          {/* Mobile Menu Button - Shows below 520px */}
          <div className='block min-[520px]:hidden'>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className='p-4 hover:bg-gray-700 transition-colors w-full flex items-center gap-2'
            >
              <Menu className='w-5 h-5' />
              <span className='font-medium'>Menu</span>
            </button>
          </div>

          {/* Desktop Menu - Shows above 520px */}
          <div className='hidden min-[520px]:block'>
            <NavigationMenu>
              <NavigationMenuList>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to = '/' className=" p-4 font-medium text-[16px] text-white hover:text-gray-100 hover:bg-gray-700 transition-colors">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className=" p-4 font-medium text-white hover:text-gray-100 hover:bg-gray-700 transition-colors">
                    Category
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className='flex flex-col p-2 min-w-[200px]'>
                      <NavigationMenuLink asChild>
                        <Link to = '/category/vegetable' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Vegetable
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to = '/category/fruits' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Fruits
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to = '/category/dairy' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Dairy
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to = '/category/meat-eggs' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Meat & Eggs
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="p-4 font-medium text-white hover:text-gray-100 hover:bg-gray-700 transition-colors">
                    My Account
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className='flex flex-col p-2 min-w-[200px]'>
                      <NavigationMenuLink asChild>
                        <Link to = '/orders' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Orders
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to = '/cart' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Cart
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to = '/whishlist' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Whishlist
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to = '/settings' className='px-4 py-2 hover:bg-gray-200 rounded'>
                          Settings
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to = '/about' className=" p-4 font-medium text-[16px] text-white hover:text-gray-100 hover:bg-gray-700 transition-colors">
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to = '/contact' className=" p-4 font-medium text-[16px] text-white hover:text-gray-100 hover:bg-gray-700 transition-colors">
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] dark:bg-gray-900 dark:text-white flex flex-col overflow-hidden" aria-describedby={undefined}>
          <SheetHeader className='shrink-0'>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          {/* Scrollable Content Area */}
          <div className='flex-1 overflow-y-auto px-1'>
            <div className='flex flex-col gap-2'>
              {/* Home Link */}
              <Link
                to="/" 
                className='px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Category Section */}
              <div className='px-4 py-3'>
                <h3 className='font-semibold text-gray-900 mb-2 dark:text-white'>Category</h3>
                <div className='flex flex-col gap-1 ml-4'>
                  <Link 
                    to="/category/vegetable" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vegetable
                  </Link>
                  <Link 
                    to="/category/fruits" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Fruits
                  </Link>
                  <Link 
                    to="/category/dairy" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dairy
                  </Link>
                  <Link 
                    to="/category/meat-eggs" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Meat & Eggs
                  </Link>
                </div>
              </div>

              {/* My Account Section */}
              <div className='px-4 py-3'>
                <h3 className='font-semibold text-gray-900 mb-2 dark:text-white'>My Account</h3>
                <div className='flex flex-col gap-1 ml-4'>
                  <Link 
                    to="/orders" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link 
                    to="/cart" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link 
                    to="/settings" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
              </div>

              {/* About Link */}
              <Link 
                to="/about" 
                className='px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Contact Link */}
              <Link 
                to="/contact" 
                className='px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>

          <SheetFooter className="shrink-0 border-t dark:border-gray-700 pt-3">
            <div className='w-full space-y-3'>
              {/* Theme Toggle */}
              <div className='flex items-center justify-center gap-2'>
                <Sun className='w-4 h-4 text-yellow-500' />
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <Moon className='w-4 h-4 text-blue-500' />
              </div>

              {/* Auth Buttons */}
              {!isAuthenticated && (
                <div className='flex flex-col gap-2 w-full'>
                  <button className='w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors active:scale-95 font-medium'>
                    Login
                  </button>
                  <button className='w-full px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors active:scale-95 font-medium'>
                    Sign-up
                  </button>
                </div>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </>
  )
}

export default Navbar