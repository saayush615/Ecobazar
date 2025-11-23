import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io";

import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
      setLoading(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, data, {
          withCredentials: true // CRITICAL: Send cookies with request
        });

        setSuccessMsg('Login successfully');
        setErrorMsg('');
        login({ userData: response.data?.user });
        reset();


        if (response.data?.user?.role === 'buyer') navigate('/');
        if (response.data?.user?.role === 'seller') navigate('/dashbord');


      } catch (error) {
        console.log(error);
        setErrorMsg(error.response?.data?.error || 'Login failed. Please try again.');
        setSuccessMsg('');
      } finally {
        setLoading(false);
      }
    }

  const handleGoogleOauth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth/google`
  }

  const handleFacebookOauth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth/facebook`
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <div className='grow flex items-center justify-center py-8 px-4'>
        <Card className='w-full max-w-lg mx-auto px-4 py-8 bg-white shadow-xl rounded-lg md:border md:border-gray-200 dark:bg-gray-900'>
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login as customer or seller</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>

              {/* Email */}
                <input type='email'
                  placeholder='Email' 
                  {...register("email", {
                    required: {value: true, message: 'Email is a required'}
                  })} 
                  className='border-2 active:border-green-500 px-4 py-2 my-2'
                />
                {errors.email && (
                  <p className="text-red-500 text-sm m-1">{errors.email.message}</p>
                )}

              {/* Password */}
                <input type='password'
                  placeholder='Password' 
                  {...register("password", {
                    required: {value: true, message: 'Email is a required'}
                  })} 
                  className='border-2 active:border-green-500 px-4 py-2 my-2'
                />
                {errors.password && (
                  <p className="text-red-500 text-sm m-1">{errors.password.message}</p>
                )}

                <button
                  type='submit'
                  className='px-4 py-2 my-2 rounded-xl bg-green-600 hover:bg-green-500 cursor-pointer text-white active:scale-95'
                  disabled={loading}
                >
                  {loading ? 'loading...' : 'Login'}
                </button>
            </form>
        </CardContent>
        <CardFooter className='border-t-2 border-t-gray-300 text-center'>
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-sm text-gray-500 py-3'>or login with</p>
            <div className='flex flex-row gap-1 sm:gap-5'>
              <button
                type='button'
                className='flex items-center gap-2 px-4 sm:px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-all'
                onClick={handleGoogleOauth}
              >
                <FcGoogle className='h-6 w-6' />
                <span className='font-medium text-gray-700'>Google</span>
              </button>
              <button
                type='button'
                className='flex items-center gap-2 px-4 sm:px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-all'
                onClick={handleFacebookOauth}
              >
                <IoLogoFacebook className='h-6 w-6 text-blue-600' />
                <span className='font-medium text-gray-700'>Facebook</span>
              </button>
            </div>
          </div>
        </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default Login
