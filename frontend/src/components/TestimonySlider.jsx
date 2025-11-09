import React, { useRef } from 'react'

import { CircleArrowLeft } from 'lucide-react';
import { CircleArrowRight } from 'lucide-react';

import TestimonyCard from './TestimonyCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '@/App.css';

// import required modules
import { Autoplay } from 'swiper/modules';

const TestimonySlider = () => {
    const swiperRef = useRef(null);

  return (
    <div className='container mx-auto xl:max-w-mainComponent'>
        <div className='flex flex-row justify-between items-center'>
            <h3 className='text-lg text-black dark:text-white sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 px-4 md:px-0'>Client Testimony</h3>
            <div className='flex flex-row justify-between items-center gap-4'>
                <CircleArrowLeft 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className='text-black fill-green-400 hover:fill-green-200 hover:scale-105 active:scale-95' />
                <CircleArrowRight 
                    onClick={() => swiperRef.current?.slideNext()}
                    className='text-black fill-green-400 hover:fill-green-200 hover:scale-105 active:scale-95' />
            </div>
        </div>
        <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            breakpoints={{
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                },
            }}
            modules={[Autoplay]}
            className="mySwiper min-h-[200px] lg:min-h-[230px]"
        >
            <SwiperSlide><TestimonyCard username={`Ram`} /></SwiperSlide>
            <SwiperSlide><TestimonyCard username={`Shyam`} /></SwiperSlide>
            <SwiperSlide><TestimonyCard username={`Hari`} /></SwiperSlide>
            <SwiperSlide><TestimonyCard username={`Gita`} /></SwiperSlide>
            <SwiperSlide><TestimonyCard username={`Sita`} /></SwiperSlide>
        </Swiper>
    </div>
  )
}

export default TestimonySlider
