import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedItems from '../components/home/FeaturedItems';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero banner with cinematic candle shimmer background */}
      <HeroSection />

      {/* 2. Restaurant heritage description */}
      <AboutSection />

      {/* 3. Teaser of signature menu dishes */}
      <FeaturedItems />

      {/* 4. Keyboard accessible user review carousel */}
      <TestimonialsCarousel />
    </div>
  );
};

export default HomePage;
