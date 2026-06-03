import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black/40 border-t border-white/5 mt-auto py-8 px-6 text-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-semibold text-white/50">📍 Location</p>
          <p>Silvertip Cafe, Club Road, Coonoor, Tamil Nadu 643101</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold text-white/50">🕒 Opening Hours</p>
          <p>Monday - Sunday: 11:00 AM - 10:30 PM</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-amber-brand/80 font-medium">All prices are exclusive of GST.</p>
          <p>&copy; {new Date().getFullYear()} Silvertip Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
