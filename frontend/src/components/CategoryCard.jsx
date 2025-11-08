import React from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CategoryCard = ({ title, source}) => {
  return (
        <Card className={`cursor-pointer rounded-xl transition-all duration-300 ease-in-out hover:border-green-500 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:scale-[1.02] hover:text-green-500`}>

            <CardHeader className='p-2 sm:p-3 md:p-4 space-y-1'>
                <img src={source} alt="Category" className='w-full h-20 sm:h-24 md:h-28 object-contain' />
                <CardTitle className='text-xs sm:text-sm md:text-base text-center truncate pt-1'>{title}</CardTitle>
            </CardHeader>
        </Card>
  )
}

export default CategoryCard