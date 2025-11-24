import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

import Home from '@/pages/Home'
import About from '@/pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashbord' 

import { SellerOnly, RequireAuth } from '@/components/ProtectedRoute'

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/about' element={ <About /> } />
        <Route path='/signup' element={ <Signup /> } />
        <Route path='/login' element={ <Login /> } />
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
            <div className='flex flex-col items-center justify-center min-h-screen'>
              <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>404</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>Page not found</p>
              <a href='/' className='mt-4 text-green-600 hover:underline'>Go Home</a>
            </div>
          } 
        />
      </Routes>
    </>
  )
}

export default App
