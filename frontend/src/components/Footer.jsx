import React from 'react'

import logo from '@/assets/logo.svg'

// Social media logos
import { Facebook } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-white dark:bg-black'>
            {/* main footer */}
            <div className='container mx-auto xl:max-w-mainComponent px-4 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {/* About Section */}
                    <div>
                        <img src={logo} alt="Logo" width='130px' />
                        <p className='text-gray-400 text-sm leading-relaxed mb-4'>
                            Your trusted online grocery store for fresh, organic products delivered to your doorstep.
                        </p>
                        <div className='flex gap-3'>
                            <a href="#" className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700'>
                                <Facebook />
                            </a>
                            <a href="#" className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700'>
                                <Instagram />
                            </a>
                            <a href="#" className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700'>
                                <Twitter />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
                        <ul className='space-y-2 text-gray-400 text-sm'>
                            <li><a href="#" className='hover:text-green-500'>About Us</a></li>
                            <li><a href="#" className='hover:text-green-500'>Shop</a></li>
                            <li><a href="#" className='hover:text-green-500'>Contact</a></li>
                            <li><a href="#" className='hover:text-green-500'>Blog</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className='text-lg font-semibold mb-4'>Categories</h4>
                        <ul className='space-y-2 text-gray-400 text-sm'>
                            <li><a href="#" className='hover:text-green-500'>Fresh Fruits</a></li>
                            <li><a href="#" className='hover:text-green-500'>Vegetables</a></li>
                            <li><a href="#" className='hover:text-green-500'>Meat & Fish</a></li>
                            <li><a href="#" className='hover:text-green-500'>Beverages</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className='text-lg font-semibold mb-4'>Contact Us</h4>
                        <ul className='space-y-3 text-gray-400 text-sm'>
                            <li className='flex items-start gap-2'>
                                <span>📍</span>
                                <span>123 Street, City, Country</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <span>📧</span>
                                <span>info@ecobazar.com</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <span>📞</span>
                                <span>+1 234 567 890</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* copyright section */}
            <div className='border-t border-gray-800'>
                <div className='container mx-auto xl:max-w-mainComponent px-4 py-4'>
                    <p className='text-center text-gray-400 text-sm'>
                        © {new Date().getFullYear()} Ecobazar. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
