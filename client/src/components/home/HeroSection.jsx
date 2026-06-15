import React from 'react';
import useMenuStore from '../../store/useMenuStore';

const HeroSection = () => {
  const { setCurrentView } = useMenuStore();

  const handleExploreMenu = () => {
    window.location.hash = '#/menu';
    setCurrentView('menu');
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes candleShimmer {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.02); }
        }
        @keyframes floatBokeh1 {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-150px) translateX(50px) scale(1.5); opacity: 0; }
        }
        @keyframes floatBokeh2 {
          0% { transform: translateY(0) scale(1.2); opacity: 0; }
          30% { opacity: 0.3; }
          70% { opacity: 0.3; }
          100% { transform: translateY(-200px) translateX(-60px) scale(0.8); opacity: 0; }
        }
        .candle-shimmer {
          animation: candleShimmer 10s ease-in-out infinite;
        }
        .bokeh-dot-1 {
          animation: floatBokeh1 15s infinite linear;
        }
        .bokeh-dot-2 {
          animation: floatBokeh2 20s infinite linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .candle-shimmer, .bokeh-dot-1, .bokeh-dot-2 {
            animation: none !important;
            transform: none !important;
          }
        }
      `}} />

      {/* Cinematic Parallax Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80')" }}
      />

      {/* Golden Shimmer Pulse Overlay */}
      <div className="absolute inset-0 bg-radial-hero candle-shimmer pointer-events-none" />

      {/* Radial Darkening Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

      {/* Floating Bokeh Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute bottom-10 left-[15%] w-12 h-12 rounded-full bg-amber-brand/20 filter blur-xl bokeh-dot-1" />
        <div className="absolute bottom-24 right-[20%] w-16 h-16 rounded-full bg-purple-700/10 filter blur-2xl bokeh-dot-2" />
        <div className="absolute bottom-40 left-[45%] w-8 h-8 rounded-full bg-amber-500/10 filter blur-xl bokeh-dot-1" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-5 right-[40%] w-14 h-14 rounded-full bg-purple-500/15 filter blur-2xl bokeh-dot-2" style={{ animationDelay: '7s' }} />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Playfair Display font applied locally via inline CSS font-family to avoid default browser serifs */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F0E8] leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Where Every Cup <br />
          <span className="text-amber-brand">Tells a Story</span>
        </h1>

        <p className="text-base md:text-xl text-[#8A8070] mb-10 max-w-2xl leading-relaxed">
          Indulge in carefully sourced single-origin coffee and artisanal dining in a warm, candlelight-inspired ambiance. Coimbatore’s finest destination for deep aromas and slow moments.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleExploreMenu}
          className="px-8 py-4 rounded-xl text-sm font-semibold tracking-widest uppercase text-black bg-amber-brand hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-brand/20 hover:shadow-amber-brand/40 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Explore Our Menu
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
