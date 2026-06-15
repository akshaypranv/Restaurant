import React from 'react';
import useMenuStore from '../../store/useMenuStore';

const HeroSection = () => {
  const { setCurrentView } = useMenuStore();

  const handleExploreMenu = () => {
    window.location.hash = '#/menu';
    setCurrentView('menu');
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-[#292F36]">
      {/* Cinematic Parallax Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-70 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80')" }}
      />

      {/* Dark gradient overlay from bottom (text legibility) */}
      <div className="hero-overlay" />

      {/* Morning-light sweep animation (replaces gold shimmer) */}
      <div className="hero-light-sweep" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF5F1] leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Where Every Cup <br />
          <span className="text-brand-red">Tells a Story</span>
        </h1>

        <p className="text-base md:text-xl text-[#FAF5F1]/80 mb-10 max-w-2xl leading-relaxed">
          Indulge in carefully sourced single-origin coffee and artisanal dining in a warm, light-café-inspired ambiance. Coimbatore’s finest destination for deep aromas and slow moments.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleExploreMenu}
          className="btn-primary"
        >
          Explore Our Menu
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
