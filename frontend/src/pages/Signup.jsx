import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from '@/schemas/auth.schema';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Signup = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('buyer'); // 'buyer' or 'seller'
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
      resolver: zodResolver(registerSchema),
      defaultValues: {
      role: "buyer",
      terms: false,
    },
    });

  // keep role synced for zod validation
  useEffect(() => {
    setValue("role", accountType, { shouldValidate: true });
  }, [accountType, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, terms, ...submitData } = data;

      await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, {
        role: accountType,
        ...submitData
      });

      // Add success handling
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setErrorMsg('');
      reset();

      navigate('/login')

    } catch (error) {
      console.log(error);
      setErrorMsg(error.response?.data?.error || 'Signup failed. Please try again.');
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  }

  // called when zod validation fails
  const onInvalid = (formErrors) => {
    console.log("❌ Zod/RHF validation errors:", formErrors);
    console.log("📝 Current form values:", getValues());
  };

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
        <Card className='w-full max-w-2xl bg-white shadow-xl rounded-lg border border-gray-200 p-4 dark:bg-gray-900'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>Create Account</CardTitle>
            <CardDescription className='text-center'>Join us as a buyer or seller</CardDescription>
          </CardHeader>

          {/* Role Selection Tabs */}
          <div className='flex gap-2 px-6 mb-4'>
            <button
              type='button'
              onClick={() => setAccountType('buyer')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                accountType === 'buyer'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
               Buyer
            </button>
            <button
              type='button'
              onClick={() => setAccountType('seller')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                accountType === 'seller'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
               Seller
            </button>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit,onInvalid)} className='flex flex-col gap-4'>

              <input type="hidden" {...register("role")} />
              
              {/* Common Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Full Name */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    placeholder='John Doe'
                    {...register("name")}
                    className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    placeholder='john@example.com'
                    {...register("email")}
                    className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Seller-Specific Fields */}
              {accountType === 'seller' && (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Shop Name */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Shop Name <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        placeholder='My Organic Store'
                        {...register("shopName")}
                        className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                      />
                      {errors.shopName && (
                        <p className="text-red-500 text-xs mt-1">{errors.shopName.message}</p>
                      )}
                    </div>

                    {/* Business Registration Number */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Business Registration No. <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        placeholder='REG123456'
                        {...register("businessRegNo")}
                        className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                      />
                      {errors.businessRegNo && (
                        <p className="text-red-500 text-xs mt-1">{errors.businessRegNo.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Business Address */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Business Address <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      placeholder='123 Main St, City, State, ZIP'
                      rows={2}
                      {...register("businessAddress")}
                      className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors resize-none'
                    />
                    {errors.businessAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.businessAddress.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Buyer-Specific Fields */}
              {accountType === 'buyer' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Phone Number */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      placeholder='+1 (555) 123-4567'
                      {...register("phone")}
                      className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Delivery Address
                    </label>
                    <input
                      type='text'
                      placeholder='Street, City, State, ZIP'
                      {...register("address")}
                      className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                    />
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Password <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    {...register("password")}
                    className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Confirm Password <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    {...register("confirmPassword")}
                    className='w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors'
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className='flex items-start gap-2'>
                <input
                  type='checkbox'
                  id='terms'
                  {...register("terms")}
                  className='mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
                />
                <label htmlFor='terms' className='text-sm text-gray-600 dark:text-gray-400'>
                  I agree to the <span className='text-green-600 hover:underline cursor-pointer'>Terms & Conditions</span> and <span className='text-green-600 hover:underline cursor-pointer'>Privacy Policy</span>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs -mt-2">{errors.terms.message}</p>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full px-4 py-3 mt-2 rounded-lg bg-green-600 hover:bg-green-500 cursor-pointer text-white font-semibold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={loading}
              >
                {loading ? 'Creating Account...' : `Create ${accountType === 'buyer' ? 'Buyer' : 'Seller'} Account`}
              </button>
            </form>
          </CardContent>

          {/* OAuth Options - Only for Buyers */}
          {accountType === 'buyer' && (
            <CardFooter className='border-t-2 border-t-gray-200 pt-6'>
              <div className='flex flex-col gap-4 items-center w-full'>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>or sign up with</p>
                <div className='flex flex-row gap-1 sm:gap-4'>
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
          )}

          {/* Login Link */}
          <div className='text-center pb-6 px-6'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Already have an account? <a href='/login' className='text-green-600 font-semibold hover:underline'>Login</a>
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default Signup