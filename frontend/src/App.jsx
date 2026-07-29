import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashbord' 
import Orders from './pages/Orders'
import Category from './pages/Category'
import Settings from './pages/Settings'

import { SellerOnly, RequireAuth, BuyerOrPublicRoute } from '@/components/ProtectedRoute'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import useWishlist from './hooks/useWishlist'

function App() {
  const {checkAuth} = useAuth()
  const { fetchWishlist } = useWishlist()

  useEffect(() => {
    checkAuth();
  },[])

  useEffect(() => { 
    fetchWishlist() 
  }, [])

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path='/' element={ 
          <BuyerOrPublicRoute>
            <Home /> 
          </BuyerOrPublicRoute>
        } />

        <Route path='/about' element={ 
          <BuyerOrPublicRoute>
            <About /> 
          </BuyerOrPublicRoute>
        } />

        <Route path='/contact' element={ 
          <BuyerOrPublicRoute>
            <Contact /> 
          </BuyerOrPublicRoute>
        } />

        <Route path='/category/:categoryslug' element={ 
          <BuyerOrPublicRoute>
            <Category /> 
          </BuyerOrPublicRoute>
        } />

        <Route path='/signup' element={ <Signup /> } />
        <Route path='/login' element={ <Login /> } />

        <Route 
          path='/orders' 
          element={ 
            <RequireAuth>
              <BuyerOrPublicRoute>
                <Orders /> 
              </BuyerOrPublicRoute>
            </RequireAuth>
          } 
        />

        <Route 
          path='/wishlist' 
          element={ 
            <RequireAuth>
              <BuyerOrPublicRoute>
                <Wishlist /> 
              </BuyerOrPublicRoute>
            </RequireAuth>
          } 
        />

        <Route 
          path='/cart' 
          element={ 
            <RequireAuth>
              <BuyerOrPublicRoute>
                <Cart /> 
              </BuyerOrPublicRoute>
            </RequireAuth>
          } 
        />

        <Route 
          path='/settings' 
          element={ 
            <RequireAuth>
              <BuyerOrPublicRoute>
                <Settings /> 
              </BuyerOrPublicRoute>
            </RequireAuth>
          } 
        />

        <Route 
          path='/dashbord' 
          element={ 
            <SellerOnly>
              <Dashboard /> 
            </SellerOnly>
          } 
        />

        {/* 404 Not Found */}
        <Route 
          path='*' 
          element={
            <BuyerOrPublicRoute>
              <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>404</h1>
                <p className='text-gray-600 dark:text-gray-400 mt-2'>Page not found</p>
                <a href='/' className='mt-4 text-green-600 hover:underline'>Go Home</a>
              </div>
            </BuyerOrPublicRoute>
          } 
        />
      </Routes>
    </>
  )
}

export default App
