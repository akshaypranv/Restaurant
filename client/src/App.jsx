import React from 'react';
import useMenuStore from './store/useMenuStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';

function App() {
  const { currentView } = useMenuStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-radial-hero text-white/90 flex flex-col justify-between overflow-x-hidden">
      {/* Header / Navigation bar */}
      <Navbar />

      {/* Main content scaffold */}
      <main className="flex-1 flex flex-col items-center w-full px-4 md:px-0">
        {currentView === 'menu' ? <MenuPage /> : <AdminPage />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
