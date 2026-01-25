import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { toast } from "sonner"

import { useForm } from "react-hook-form"

const Contact = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => console.log(data)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      id: 1,
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Street', 'City, Country']
    },
    {
      id: 2,
      icon: Phone,
      title: 'Call Us',
      details: ['+1 234 567 890', '+1 098 765 432']
    },
    {
      id: 3,
      icon: Mail,
      title: 'Email Us',
      details: ['support@ecobazar.com', 'info@ecobazar.com']
    },
    {
      id: 4,
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM']
    }
  ]



  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)
  //   setSubmitStatus(null)

  //   // Simulate API call
  //   try {
  //     await new Promise(resolve => setTimeout(resolve, 1500))
      
  //     // Here you would typically make an API call to your backend
  //     // await axios.post('/api/contact', formData)
      
  //     setSubmitStatus('success')
  //     setFormData({
  //       name: '',
  //       email: '',
  //       subject: '',
  //       message: ''
  //     })
  //   } catch (error) {
  //     setSubmitStatus('error')
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  return (
    <div className='flex flex-col min-h-screen dark:bg-gray-900'>
      <Header />

      <div className='flex-1'>
        {/* Hero Section */}
        <div className='bg-linear-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 py-16'>
          <div className='container mx-auto px-4'>

              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center'>
                Contact Us
              </h1>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center'>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

          </div>
        </div>

        {/* Contact Info Cards */}
        <div className='container mx-auto px-4 py-16'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <div 
                  key={info.id}
                  className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700'
                >
                  <div className='w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4'>
                    <Icon className='w-7 h-7 text-green-600 dark:text-green-400' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                    {info.title}
                  </h3>
                  {info.details.map((detail, index) => (
                    <p 
                      key={index}
                      className='text-gray-600 dark:text-gray-300 text-sm mb-1'
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Contact Form & Map Section */}
          <div className='grid lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div className='bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div>
                  <label 
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  >
                    Your Name *
                  </label>
                  <input
                    type='text'
                    id='name'
                    placeholder='eg. Ram kumar'
                    {...register("name", {
                      required: { value: true, message: 'Full name is required' },
                      minLength: { value: 3, message: 'Name must be at least 3 characters' }
                    })}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all'
                  />
                  {errors.name && 
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  }
                </div>

                <div>
                  <label 
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  >
                    Email Address *
                  </label>
                  <input
                    type='email'
                    id='email'
                    placeholder='eg. ram123@gmail.com'
                    {...register("email", {
                      required: { value: true, message: 'Email is required' },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all'
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor='subject'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  >
                    Subject *
                  </label>
                  <input
                    type='text'
                    id='subject'
                    placeholder='eg. Inquiry about organic products'
                    {...register("subject", {
                      required: { value: true, message: 'Subject is required' },
                      maxLength: { value: 50, message: 'Subject must not exceed 50 characters'}
                    })}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all'
                  />
                </div>

                <div>
                  <label 
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  >
                    Message *
                  </label>
                  <textarea
                    id='message'
                    placeholder='Write your message here...'
                    {...register("message", {
                      required: { value: true, message: 'Message is required' }
                    })}
                    rows='5'
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none'
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 transform'
                >
                  {isSubmitting ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className='w-5 h-5' />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div>
              
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='bg-gray-50 dark:bg-gray-800 py-16'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Frequently Asked Questions
              </h2>
              <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                Quick answers to common questions. Can't find what you're looking for? Contact us directly.
              </p>
            </div>
            
            <div className='grid md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  What are your delivery areas?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                  We currently deliver to all major cities and surrounding areas. Check your location during checkout.
                </p>
              </div>
              
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  How can I become a seller?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                  Visit our signup page and select "Become a Seller" option. Our team will guide you through the process.
                </p>
              </div>
              
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  What is your return policy?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                  We offer a 7-day return policy for fresh products. Contact us within 24 hours of delivery for any issues.
                </p>
              </div>
              
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  Are all products organic?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                  Yes! All our products are certified organic and sourced directly from verified local farmers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact