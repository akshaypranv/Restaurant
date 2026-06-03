import { create } from 'zustand';

const useMenuStore = create((set) => ({
  activeCategory: 'all',
  searchQuery: '',
  vegFilter: false,
  adminToken: null,
  currentView: 'menu',

  setActiveCategory: (category) => set({ 
    activeCategory: category, 
    searchQuery: '' // Reset search when category changes as per security/UI specs
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setVegFilter: (veg) => set({ vegFilter: veg }),

  setAdminToken: (token) => set({ adminToken: token }),

  setCurrentView: (view) => set({ currentView: view }),

  logout: () => set({ adminToken: null, currentView: 'menu' })
}));

export default useMenuStore;
