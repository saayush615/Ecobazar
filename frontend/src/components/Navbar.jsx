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
} from "@/components/ui/sheet"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className='bg-gray-800 text-white mt-0 sm:mt-2'>
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
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          <div className='flex flex-col gap-2 mt-6'>
            {/* Home Link */}
            <a 
              href="/" 
              className='px-4 py-3 hover:bg-gray-100 rounded-md transition-colors font-medium'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>

            {/* Category Section */}
            <div className='px-4 py-3'>
              <h3 className='font-semibold text-gray-900 mb-2'>Category</h3>
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
              <h3 className='font-semibold text-gray-900 mb-2'>My Account</h3>
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
              className='px-4 py-3 hover:bg-gray-100 rounded-md transition-colors font-medium'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>

            {/* Contact Link */}
            <a 
              href="/contact" 
              className='px-4 py-3 hover:bg-gray-100 rounded-md transition-colors font-medium'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Navbar