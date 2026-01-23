import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Leaf, Users, ShieldCheck, Truck } from 'lucide-react'

const About = () => {
  const features = [
    {
      id: 1,
      icon: Leaf,
      title: '100% Organic',
      description: 'We provide only fresh and organic products directly from local farms to your doorstep.'
    },
    {
      id: 2,
      icon: Users,
      title: 'Support Local Sellers',
      description: 'Connect with local farmers and sellers, supporting your community while getting the best quality.'
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: 'Quality Assured',
      description: 'Every product goes through strict quality checks to ensure you receive only the best.'
    },
    {
      id: 4,
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service to ensure your groceries arrive fresh and on time.'
    }
  ]

  const stats = [
    { id: 1, number: '10K+', label: 'Happy Customers' },
    { id: 2, number: '500+', label: 'Local Sellers' },
    { id: 3, number: '50K+', label: 'Products Sold' },
    { id: 4, number: '100+', label: 'Organic Products' }
  ]

  return (
    <div className='flex flex-col min-h-screen dark:bg-gray-900'>
      <Header />

      <div className='flex-1'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 py-16'>
          <div className='container mx-auto xl:max-w-mainComponent px-4'>
            <div className='text-center'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
                About Ecobazar
              </h1>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
                Your trusted marketplace for fresh, organic groceries and daily essentials. 
                Connecting local farmers and sellers with conscious consumers.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className='container mx-auto xl:max-w-mainComponent px-4 py-16'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Our Story
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Ecobazar was founded with a simple mission: to make fresh, organic produce 
                accessible to everyone while supporting local farmers and sellers. We believe 
                in sustainable living and the power of community-driven commerce.
              </p>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Our platform connects you directly with local sellers, eliminating middlemen 
                and ensuring that you get the freshest products at fair prices. Every purchase 
                you make supports local businesses and promotes sustainable farming practices.
              </p>
              <p className='text-gray-600 dark:text-gray-300'>
                Join us in creating a healthier, more sustainable future—one grocery at a time.
              </p>
            </div>
            <div className='relative'>
              <div className='aspect-square bg-green-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center'>
                <Leaf className='w-32 h-32 text-green-600 dark:text-green-400' />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='bg-gray-50 dark:bg-gray-800 py-16'>
          <div className='container mx-auto xl:max-w-mainComponent px-4'>
            <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-12'>
              Why Choose Us
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={feature.id} 
                    className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'
                  >
                    <div className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4'>
                      <Icon className='w-8 h-8 text-green-600 dark:text-green-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className='container mx-auto xl:max-w-mainComponent px-4 py-16'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat) => (
              <div key={stat.id} className='text-center'>
                <h3 className='text-4xl font-bold text-green-600 dark:text-green-400 mb-2'>
                  {stat.number}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 font-medium'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className='bg-green-600 dark:bg-green-700 py-16'>
          <div className='container mx-auto xl:max-w-mainComponent px-4 text-center'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Our Mission
            </h2>
            <p className='text-white/90 text-lg max-w-3xl mx-auto'>
              To revolutionize the way people shop for groceries by creating a sustainable, 
              community-driven marketplace that benefits both consumers and local sellers. 
              We're committed to quality, transparency, and environmental responsibility.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className='container mx-auto xl:max-w-mainComponent px-4 py-16'>
          <div className='bg-linear-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 text-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Ready to Start Shopping?
            </h2>
            <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
              Explore our wide range of fresh, organic products and join thousands of happy customers.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a 
                href='/' 
                className='px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors active:scale-95 transform'
              >
                Browse Products
              </a>
              <a 
                href='/signup' 
                className='px-8 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-green-600 dark:text-green-400 font-semibold rounded-lg border-2 border-green-600 dark:border-green-400 transition-colors active:scale-95 transform'
              >
                Become a Seller
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About