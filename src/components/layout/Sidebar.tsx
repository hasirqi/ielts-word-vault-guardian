
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, BookOpen, Book, Clock, BarChart2, Settings } from 'lucide-react';

const Sidebar: React.FC<{ isMobile: boolean; isOpen: boolean; toggleSidebar: () => void }> = ({ 
  isMobile, 
  isOpen, 
  toggleSidebar 
}) => {
  const { t } = useLanguage();
  
  const navItems = [
    { label: t('nav.home'), icon: Home, path: '/' },
    { label: t('nav.learn'), icon: BookOpen, path: '/learn' },
    { label: t('nav.vocabulary'), icon: Book, path: '/vocabulary' },
    { label: t('nav.review'), icon: Clock, path: '/review' },
    { label: t('nav.stats'), icon: BarChart2, path: '/stats' },
    { label: t('nav.settings'), icon: Settings, path: '/settings' },
  ];

  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed top-0 left-0 z-40 h-screen transition-transform 
      ${isMobile ? 'w-64 shadow-lg' : 'w-16 sm:w-64'} 
      bg-sidebar text-sidebar-foreground
      flex flex-col border-r border-sidebar-border`}>
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <h1 className={`text-xl font-bold text-sidebar-primary ${!isMobile && !isOpen ? 'hidden sm:block' : ''}`}>
          <span className="hidden sm:inline">IELTS</span> 
          <span className="sm:hidden">I</span>
          <span className="text-sidebar-foreground"> Vocab</span>
        </h1>
      </div>
      <nav className="flex flex-col flex-1 pt-5">
        {navItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.path}
            onClick={isMobile ? toggleSidebar : undefined}
            className={({ isActive }) => `
              flex items-center px-4 py-3
              ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}
              ${!isMobile && !isOpen ? 'justify-center sm:justify-start' : ''}
            `}
          >
            <item.icon size={20} className="min-w-[20px]" />
            <span className={`ml-3 ${!isMobile && !isOpen ? 'hidden sm:inline' : ''}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
