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
    <footer className="w-full bg-surface-white border-t border-surface-gray py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-start mb-8">
        {/* Brand Info */}
        <div className="flex flex-col gap-3 max-w-sm">
          <span className="text-lg font-bold tracking-widest text-text-dark">
            SILVERTIP <span className="text-brand-red">CAFE</span>
          </span>
          <p className="text-sm text-accent-taupe leading-relaxed">
            Crafting premium brews and unforgettable culinary experiences in Coonoor and Coimbatore. Every cup tells a story.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-text-dark font-semibold mb-2">Explore</h4>
          <button
            onClick={() => handleNavClick('home', '#/')}
            className="text-left text-sm text-accent-taupe hover:text-brand-red transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu', '#/menu')}
            className="text-left text-sm text-accent-taupe hover:text-brand-red transition-colors"
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('contact', '#/contact')}
            className="text-left text-sm text-accent-taupe hover:text-brand-red transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-text-dark font-semibold mb-2">📍 Visit Us</h4>
          <p className="text-sm text-accent-taupe">12 Roast Lane, Coimbatore</p>
          <p className="text-sm text-accent-taupe">Phone: +91 98765 43210</p>
          <p className="text-sm text-accent-taupe">Email: hello@silvertipcafe.com</p>
        </div>

        {/* Timings */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-wider text-text-dark font-semibold mb-2">🕒 Timings</h4>
          <p className="text-sm text-accent-taupe">Mon - Sat: 8:00 AM - 10:00 PM</p>
          <p className="text-sm text-accent-taupe">Sunday: 9:00 AM - 8:00 PM</p>
        </div>
      </div>

      <hr className="border-surface-gray my-6" />

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-accent-taupe">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-brand-red transition-colors">Instagram</a>
          <a href="#" className="hover:text-brand-red transition-colors">Twitter / X</a>
          <a href="#" className="hover:text-brand-red transition-colors">Google Maps 📍</a>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-accent-taupe mb-1 font-medium">All prices are exclusive of GST.</p>
          <p className="mb-2">&copy; {new Date().getFullYear()} Silvertip Cafe. All rights reserved.</p>
          <button
            onClick={handleAdminLink}
            className="text-[10px] text-accent-taupe/40 hover:text-accent-taupe/80 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
          >
            Staff Login
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
