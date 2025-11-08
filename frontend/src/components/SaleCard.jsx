import React from 'react'

import { ArrowRight } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
} from "@/components/ui/card"

const SaleCard = ({ name, title, source, desc }) => {
  return (
    <Card>
      <CardContent className="relative flex justify-center text-white p-0 overflow-hidden">
        <img src={source} alt="source" className="w-full h-auto object-cover" />
        <div className='absolute top-0 flex flex-col items-center gap-2 sm:gap-3 w-full px-4 sm:px-0'>
          <p className='text-[10px] sm:text-xs pt-1 sm:pt-2'>{name}</p>
          <p className='text-xl sm:text-2xl md:text-3xl font-bold text-center'>{title}</p>
          <p className='text-xs hidden sm:block sm:text-sm md:text-md bg-black rounded-2xl text-red-500 p-1.5 sm:p-2 text-center'>{desc}</p>
          <button 
            className='p-1.5 sm:p-2 cursor-pointer text-[10px] sm:text-xs rounded-xl text-green-800 bg-gray-100 hover:bg-gray-300 transition-all duration-300 flex items-center gap-1 hover:scale-105 active:scale-95'
          >
            Shop Now 
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SaleCard
