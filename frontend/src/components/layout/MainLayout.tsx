import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Chatbot from '../common/Chatbot';
import './MainLayout.css'; 

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="main-layout">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="layout-container">
        {sidebarOpen && <Sidebar />}
        <main className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MainLayout;
