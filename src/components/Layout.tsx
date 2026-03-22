import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home as HomeIcon, Shirt, Settings as SettingsIcon, Menu as MenuIcon, User } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/closet', icon: Shirt, label: 'Closet' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-cyan-50/40 backdrop-blur-xl flex justify-between items-center px-8 h-16">
        <button className="text-primary">
          <MenuIcon size={24} />
        </button>
        <h1 className="text-primary font-black tracking-tighter text-xl">WARDROBE</h1>
        <button className="text-primary">
          <User size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32 max-w-md mx-auto w-full px-8">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-8 pt-4 bg-white/70 backdrop-blur-2xl z-50 rounded-t-[2rem] shadow-ambient">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-primary-container/50 text-primary scale-105' : 'text-on-surface-variant/60 hover:text-primary'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] uppercase tracking-widest font-bold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
