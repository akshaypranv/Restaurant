import React from 'react';
import useMenuStore from '../../store/useMenuStore';

const Navbar = () => {
  const { currentView, setCurrentView, adminToken, logout } = useMenuStore();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/30 border-b border-white/5 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('menu')}>
          <span className="text-xl font-black tracking-wider text-white select-none">
            SILVERTIP <span className="text-amber-brand">CAFE</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {currentView === 'admin' ? (
            <button
              onClick={() => setCurrentView('menu')}
              className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
            >
              ← Digital Menu
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('admin')}
              className="text-xs font-semibold uppercase tracking-wider text-amber-brand/80 hover:text-amber-brand px-3 py-1.5 rounded-lg border border-amber-brand/20 hover:bg-amber-brand/5 transition-all"
            >
              {adminToken ? 'Admin Dashboard' : 'Admin Login'}
            </button>
          )}

          {adminToken && (
            <button
              onClick={logout}
              className="text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/5 transition-all"
            >
              Logout
            </button>
          )}

          <div 
            className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" 
            title="Digital Menu Online" 
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
