import React from 'react';
import GlassCard from '../ui/GlassCard';

const AboutSection = () => {
  return (
    <section className="w-full py-20 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <GlassCard className="p-8 md:p-12 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image Column */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none z-10" />
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80"
                alt="Silvertip Cafe Atmosphere"
                className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <span className="text-xs font-semibold tracking-widest text-amber-brand uppercase mb-2">
                Our Story
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Crafting Slow Moments Since 2026
              </h2>
              <div className="text-sm md:text-base text-[#8A8070] space-y-4 leading-relaxed">
                <p>
                  Silvertip Cafe started with a simple belief: that coffee is more than just a drink—it’s a connection. Tucked away under a canopy of green in Coimbatore, our space is designed as a quiet sanctuary from the urban rush.
                </p>
                <p>
                  We source our single-origin estate beans directly from family-run plantations in the Western Ghats. Every batch is roasted micro-lotte style to unlock the deep chocolatey, nutty, and fruity notes unique to our regional terroir.
                </p>
                <p>
                  Beyond coffee, our kitchen works in harmony with local organic growers. From hand-stretched pizzas to fresh starters and pastries, we craft each dish with the same patience and precision that we pour into our cups.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default AboutSection;
