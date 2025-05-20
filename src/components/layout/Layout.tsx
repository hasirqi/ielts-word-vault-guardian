
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isMobile={isMobile} isOpen={isMobile ? sidebarOpen : true} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col ${isMobile ? 'w-full' : 'ml-16 sm:ml-64'}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
