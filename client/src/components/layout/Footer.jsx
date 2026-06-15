import React from 'react';
import useMenuStore from '../../store/useMenuStore';

const Footer = () => {
  const { setCurrentView } = useMenuStore();

  const handleAdminLink = () => {
    window.location.hash = '#/silvertip-admin';
    setCurrentView('admin');
  };

  const handleNavClick = (view, hash) => {
    window.location.hash = hash;
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black/80 border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start mb-8">
        {/* Brand Info */}
        <div className="flex flex-col gap-3 max-w-sm">
          <span className="text-lg font-bold tracking-widest text-white">
            SILVERTIP <span className="text-amber-brand">CAFE</span>
          </span>
          <p className="text-sm text-[#8A8070] leading-relaxed">
            Crafting premium brews and unforgettable culinary experiences in Coonoor and Coimbatore. Every cup tells a story.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-[#F5F0E8] font-semibold mb-2">Explore</h4>
          <button
            onClick={() => handleNavClick('home', '#/')}
            className="text-left text-sm text-[#8A8070] hover:text-[#F5F0E8] transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu', '#/menu')}
            className="text-left text-sm text-[#8A8070] hover:text-[#F5F0E8] transition-colors"
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('contact', '#/contact')}
            className="text-left text-sm text-[#8A8070] hover:text-[#F5F0E8] transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-[#F5F0E8] font-semibold mb-2">📍 Visit Us</h4>
          <p className="text-sm text-[#8A8070]">12 Roast Lane, Coimbatore</p>
          <p className="text-sm text-[#8A8070]">Phone: +91 98765 43210</p>
          <p className="text-sm text-[#8A8070]">Email: hello@silvertipcafe.com</p>
        </div>

        {/* Timings */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-[#F5F0E8] font-semibold mb-2">🕒 Timings</h4>
          <p className="text-sm text-[#8A8070]">Mon - Sat: 8:00 AM - 10:00 PM</p>
          <p className="text-sm text-[#8A8070]">Sunday: 9:00 AM - 8:00 PM</p>
        </div>
      </div>

      <hr className="border-white/5 my-6" />

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8A8070]">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[#F5F0E8] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#F5F0E8] transition-colors">Twitter / X</a>
          <a href="#" className="hover:text-[#F5F0E8] transition-colors">Google Maps 📍</a>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-[#8A8070] mb-1 font-medium">All prices are exclusive of GST.</p>
          <p className="mb-2">&copy; {new Date().getFullYear()} Silvertip Cafe. All rights reserved.</p>
          <button
            onClick={handleAdminLink}
            className="text-[10px] text-white/20 hover:text-white/40 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
          >
            Staff Login
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
