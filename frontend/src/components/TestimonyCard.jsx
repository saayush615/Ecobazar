import React from 'react'

import { User } from 'lucide-react';
import { Quote } from 'lucide-react';

const TestimonyCard = ({ username }) => {
  return (
    <div className='bg-white text-black dark:bg-black dark:text-white rounded-xl p-2 sm:p-4'>
        <Quote className='text-green-600 fill-green-600'/>
        <p className='text-sm my-1 sm:my-2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident adipisci, nihil hic consequuntur voluptate velit delectus earum architecto amet aperiam incidunt libero asperiores voluptas nesciunt.</p>
        <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row items-center gap-2'>
                <User />
                <div className='flex flex-col gap-0.5'>
                    {username}
                    <p className='text-xs text-gray-500'>Customer</p>
                </div>
            </div>
            <p>⭐⭐⭐⭐⭐</p>
        </div>
    
    </div>
  )
}

export default TestimonyCard
