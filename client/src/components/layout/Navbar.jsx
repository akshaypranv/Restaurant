import React, { useState, useEffect } from 'react';
import useMenuStore from '../../store/useMenuStore';

const Navbar = () => {
  const { currentView, setCurrentView } = useMenuStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll to toggle navbar solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view, hash) => {
    window.location.hash = hash;
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || currentView !== 'home' ? 'navbar-solid py-3' : 'navbar-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => handleNavClick('home', '#/')}
        >
          <span className={`text-xl font-bold tracking-widest transition-colors duration-200 ${
            isScrolled || currentView !== 'home' ? 'text-text-dark' : 'text-[#FAF5F1]'
          }`}>
            SILVERTIP <span className="text-brand-red">CAFE</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('home', '#/')}
            className={`text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
              currentView === 'home'
                ? 'text-brand-red font-semibold border-b border-brand-red pb-0.5'
                : isScrolled || currentView !== 'home'
                  ? 'text-accent-taupe hover:text-text-dark'
                  : 'text-[#E0DBD8] hover:text-[#FAF5F1]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu', '#/menu')}
            className={`text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
              currentView === 'menu'
                ? 'text-brand-red font-semibold border-b border-brand-red pb-0.5'
                : isScrolled || currentView !== 'home'
                  ? 'text-accent-taupe hover:text-text-dark'
                  : 'text-[#E0DBD8] hover:text-[#FAF5F1]'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('contact', '#/contact')}
            className={`text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
              currentView === 'contact'
                ? 'text-brand-red font-semibold border-b border-brand-red pb-0.5'
                : isScrolled || currentView !== 'home'
                  ? 'text-accent-taupe hover:text-text-dark'
                  : 'text-[#E0DBD8] hover:text-[#FAF5F1]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`focus:outline-none p-1.5 rounded-lg border transition-all ${
              isScrolled || currentView !== 'home'
                ? 'text-text-dark border-surface-gray bg-surface-gray/50 hover:text-brand-red'
                : 'text-[#FAF5F1] border-[#FAF5F1]/10 bg-[#FAF5F1]/5 hover:text-brand-red'
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-surface-white border-b border-surface-gray absolute top-full left-0 transition-all duration-300 py-6 px-6 shadow-xl flex flex-col gap-4">
          <button
            onClick={() => handleNavClick('home', '#/')}
            className={`text-left text-base font-medium uppercase py-2 tracking-wider ${
              currentView === 'home' ? 'text-brand-red' : 'text-text-dark/60 hover:text-text-dark'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu', '#/menu')}
            className={`text-left text-base font-medium uppercase py-2 tracking-wider ${
              currentView === 'menu' ? 'text-brand-red' : 'text-text-dark/60 hover:text-text-dark'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('contact', '#/contact')}
            className={`text-left text-base font-medium uppercase py-2 tracking-wider ${
              currentView === 'contact' ? 'text-brand-red' : 'text-text-dark/60 hover:text-text-dark'
            }`}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
