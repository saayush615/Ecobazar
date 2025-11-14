import React, { useState } from 'react'
import { Menu } from 'lucide-react'
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

                <NavigationMenuItem className='hover:bg-gray-700 p-4 transition-colors'>
                  <NavigationMenuLink 
                    href="/" 
                    className="text-white hover:text-gray-100 font-medium"
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className='hover:bg-gray-700 p-4 transition-colors'>
                  <NavigationMenuTrigger className="text-white hover:text-gray-100 font-medium">
                    Category
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className='flex flex-col p-2 min-w-[200px]'>
                      <NavigationMenuLink 
                        href="/category/vegetable"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Vegetable
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        href="/category/fruits"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Fruits
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        href="/category/dairy"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Dairy
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        href="/category/meat-eggs"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Meat & Eggs
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className='hover:bg-gray-700 p-4 transition-colors'>
                  <NavigationMenuTrigger className="text-white hover:text-gray-100 font-medium">
                    My Account
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className='flex flex-col p-2 min-w-[200px]'>
                      <NavigationMenuLink 
                        href="/account/orders"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Orders
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        href="/account/wishlist"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Wishlist
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        href="/account/profile"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Edit Profile
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        href="/account/settings"
                        className='px-4 py-2 hover:bg-gray-200 rounded'
                      >
                        Settings
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className='hover:bg-gray-700 p-4 transition-colors'>
                  <NavigationMenuLink 
                    href="/about" 
                    className="text-white hover:text-gray-100 font-medium"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className='hover:bg-gray-700 p-4 transition-colors'>
                  <NavigationMenuLink 
                    href="/contact" 
                    className="text-white hover:text-gray-100 font-medium"
                  >
                    Contact
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
              <a 
                href="/" 
                className='px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>

              {/* Category Section */}
              <div className='px-4 py-3'>
                <h3 className='font-semibold text-gray-900 mb-2 dark:text-white'>Category</h3>
                <div className='flex flex-col gap-1 ml-4'>
                  <a 
                    href="/category/vegetable" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vegetable
                  </a>
                  <a 
                    href="/category/fruits" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Fruits
                  </a>
                  <a 
                    href="/category/dairy" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dairy
                  </a>
                  <a 
                    href="/category/meat-eggs" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Meat & Eggs
                  </a>
                </div>
              </div>

              {/* My Account Section */}
              <div className='px-4 py-3'>
                <h3 className='font-semibold text-gray-900 mb-2 dark:text-white'>My Account</h3>
                <div className='flex flex-col gap-1 ml-4'>
                  <a 
                    href="/account/orders" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </a>
                  <a 
                    href="/account/wishlist" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wishlist
                  </a>
                  <a 
                    href="/account/profile" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Edit Profile
                  </a>
                  <a 
                    href="/account/settings" 
                    className='py-2 hover:text-green-600 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </a>
                </div>
              </div>

              {/* About Link */}
              <a 
                href="/about" 
                className='px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>

              {/* Contact Link */}
              <a 
                href="/contact" 
                className='px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors font-medium'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
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