import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io";

import { useForm } from "react-hook-form"
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
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => console.log(data)

  return (
    <div className='flex flex-col min-h-screen justify-between'>
      <Header />

      <div className='flex items-center justify-center'>
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
            <p>or</p>
            <div className='flex flex-row gap-5'>
              <FcGoogle className='h-10 w-10 bg-gray-300 rounded-lg hover:bg-gray-200 active:scale-95 cursor-pointer' />
              <IoLogoFacebook className='h-10 w-10 text-blue-600 bg-gray-300 rounded-lg hover:bg-gray-200 active:scale-95 cursor-pointer' />
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
