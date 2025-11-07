import React from 'react'

import Heroslide1 from '@/assets/Slider/heroslide1.svg'
import Heroslide2 from '@/assets/Slider/heroslide2.svg'
import Heroslide3 from '@/assets/Slider/heroslide3.svg'
import Heroslide4 from '@/assets/Slider/heroslide4.svg'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '@/App.css';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

const HeroSlider = () => {
  return (
    <div className='container mx-auto'>
      <Swiper 
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination]} 
        className="mySwiper rounded-lg overflow-hidden"
      >
        <SwiperSlide>
          <img src={Heroslide1} alt="Hero slide 1"/>
        </SwiperSlide>
        <SwiperSlide>
          <img src={Heroslide2} alt="Hero slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Heroslide3} alt="Hero slide 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Heroslide4} alt="Hero slide 4" />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default HeroSlider