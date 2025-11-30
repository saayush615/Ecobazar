import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from "sonner"
import AddProducts from '@/components/seller/AddProducts'

// Icons
import { Package } from 'lucide-react'
import { ShoppingCart } from 'lucide-react'
import { History } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { Menu } from 'lucide-react'
import { X } from 'lucide-react'
import { Plus } from 'lucide-react';

import Products from '@/components/seller/Products'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [addProduct, setAddProduct] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Success notification
  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success('Logged in Successfully!');
      // Clear state to prevent showing toast on page refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [])
  

  const handleLogout = async () => {
    await logout()
  }

  const navigationItems = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'history', label: 'Order History', icon: History },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products />
      case 'orders':
        return <div className='text-gray-600 dark:text-gray-300'>Orders content will go here</div>
      case 'history':
        return <div className='text-gray-600 dark:text-gray-300'>Order History content will go here</div>
      case 'sales':
        return <div className='text-gray-600 dark:text-gray-300'>Sales content will go here</div>
      default:
        return null
    }
  }

  return (
    <div className='h-screen w-screen overflow-hidden flex bg-gray-50 dark:bg-gray-900'>
      
      {/* Sidebar - Desktop */}
      <aside className='hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg'>
        {/* Logo Section */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-2xl font-bold text-green-600 dark:text-green-500'>Ecobazar</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Seller Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span className='font-medium'>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-3 px-2'>
            <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold'>
              {user?.shopName?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                {user?.shopName || 'Seller'}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {user?.email || 'seller@ecobazar.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span className='font-medium'>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-xl font-bold text-green-600 dark:text-green-500'>Ecobazar</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
          >
            <X className='w-5 h-5 text-gray-600 dark:text-gray-300' />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span className='font-medium'>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Mobile User Section */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-3 px-2'>
            <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold'>
              {user?.shopName?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                {user?.shopName || 'Seller'}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {user?.email || 'seller@ecobazar.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span className='font-medium'>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Header */}
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm'>
          <div className='flex items-center justify-between'>

            <div className='flex items-center gap-2'>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              >
                <Menu className='w-6 h-6 text-gray-600 dark:text-gray-300' />
              </button>

              {/* Page Title */}
              <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
                {navigationItems.find((item) => item.id === activeTab)?.label}
              </h2>
            </div>

            <button 
              className='p-2 rounded-full bg-green-500 shadow-md cursor-pointer hover:bg-green-400 active:scale-95'
              onClick={() => setAddProduct(true)}
            >
              <Plus />
            </button>

          </div>
        </header>

        {/* Content Area */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-7xl mx-auto'>
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Add product */}
      <AddProducts open={addProduct} onOpenChange={setAddProduct} />
    </div>
  )
}

export default Dashboard
