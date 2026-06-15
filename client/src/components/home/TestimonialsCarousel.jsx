import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../ui/GlassCard';

const testimonials = [
  {
    "name": "Meera Krishnamurthy",
    "avatar": "https://i.pravatar.cc/80?img=47",
    "rating": 5,
    "quote": "The filter coffee here is unlike anything I've had in the city. I came for a quick breakfast before a meeting and ended up staying two hours. The cold brew mushroom toast was unreal."
  },
  {
    "name": "Arjun Selvam",
    "avatar": "https://i.pravatar.cc/80?img=12",
    "rating": 5,
    "quote": "Silvertip is my work-from-cafe spot every Friday. The WiFi is solid, the staff remember my usual order (Cortado, extra shot), and the playlist never gets old."
  },
  {
    "name": "Priya Anand",
    "avatar": "https://i.pravatar.cc/80?img=32",
    "rating": 4,
    "quote": "Came here on a recommendation from a friend and I'm so glad I did. The cardamom latte and the hazelnut brownie are a combination I think about at least once a week."
  },
  {
    "name": "Vikram Nair",
    "avatar": "https://i.pravatar.cc/80?img=68",
    "rating": 5,
    "quote": "We hosted a small team celebration here and the staff went above and beyond — arranged a little cake surprise and everything. The food was excellent but it's the warmth of the place that made it special."
  },
  {
    "name": "Divya Raghunathan",
    "avatar": "https://i.pravatar.cc/80?img=56",
    "rating": 5,
    "quote": "I'm extremely picky about espresso. Silvertip pulls the best shot in Coimbatore, no question. The single origin pour-over on weekends is worth planning your day around."
  }
];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-16 px-6 bg-transparent">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-amber-brand uppercase mb-2 block">
            Reviews
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Loved by Coffee Enthusiasts
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Customer Testimonials Slider. Use Left and Right arrow keys to navigate."
          className="w-full relative focus:outline-none focus:ring-1 focus:ring-amber-brand/35 rounded-2xl cursor-default"
        >
          {/* Slide Content */}
          <GlassCard className="p-8 md:p-12 min-h-[260px] flex flex-col justify-between items-center text-center transition-all duration-300 transform">
            <div className="flex flex-col items-center">
              {/* Star Rating */}
              <div 
                className="flex gap-1 mb-6 text-amber-400 text-sm" 
                role="img" 
                aria-label={`${testimonials[activeIndex].rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < testimonials[activeIndex].rating ? '★' : '☆'}
                  </span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl font-medium text-[#F5F0E8] italic max-w-2xl leading-relaxed mb-8">
                &ldquo;{testimonials[activeIndex].quote}&rdquo;
              </blockquote>
            </div>

            {/* User Details */}
            <div className="flex items-center gap-4">
              <img
                src={testimonials[activeIndex].avatar}
                alt={`${testimonials[activeIndex].name} Avatar`}
                className="w-12 h-12 rounded-full border border-amber-brand/20 object-cover"
                loading="lazy"
              />
              <div className="text-left">
                <cite className="not-italic text-sm font-semibold text-white/90 block">
                  {testimonials[activeIndex].name}
                </cite>
                <span className="text-xs text-[#8A8070]">Verified Customer</span>
              </div>
            </div>
          </GlassCard>

          {/* Left Arrow Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/10 bg-black/40 hover:bg-black/80 hover:border-amber-brand/40 text-white hover:text-amber-brand transition-all z-20"
            aria-label="Previous slide"
          >
            ←
          </button>

          {/* Right Arrow Controls */}
          <button
            onClick={nextSlide}
            className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/10 bg-black/40 hover:bg-black/80 hover:border-amber-brand/40 text-white hover:text-amber-brand transition-all z-20"
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex gap-2.5 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-amber-brand w-6' : 'bg-white/20'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
