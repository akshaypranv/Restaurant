import React, { useEffect } from 'react';
import useMenuStore from './store/useMenuStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ChatBotWidget from './components/chat/ChatBotWidget';

function App() {
  const { currentView, setCurrentView } = useMenuStore();

  // Custom Hash Router to manage routing without react-router-dom in offline env
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      if (hash === '#/menu') {
        setCurrentView('menu');
      } else if (hash === '#/contact') {
        setCurrentView('contact');
      } else if (hash === '#/silvertip-admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setCurrentView]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-radial-hero text-white/90 flex flex-col justify-between overflow-x-hidden relative">
      {/* Header / Navigation bar */}
      <Navbar />

      {/* Main content scaffold */}
      <main className="flex-1 flex flex-col items-center w-full pt-20 px-4 md:px-0">
        {renderView()}
      </main>

      {/* Floating Chatbot Widget on all pages */}
      <ChatBotWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
