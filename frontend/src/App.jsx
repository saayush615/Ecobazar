import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Home from '@/pages/Home'
import About from '@/pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashbord' 

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/about' element={ <About /> } />
        <Route path='/signup' element={ <Signup /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/dashbord' element={ <Dashboard /> } />
      </Routes>
    </>
  )
}

export default App
