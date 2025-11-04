import React from 'react'

import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import HeroBanner from '@/assets/herobanner.svg'

const Home = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className='container mx-auto xl:max-w-mainComponent'>

        {/* Hero component */}
        <div>
          <HeroSlider />
          <img src={HeroBanner} alt="HeroBanner" />
        </div>

        {/* Product */}
        <div>
          <h3>Popular Category</h3>
        </div>
      </div>
    </div>
  )
}

export default Home
