/**
 * DashboardLayout Component
 * Main layout wrapper with sidebar and content area
 */
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

const DashboardLayout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>
        <TopNavbar title={title} collapsed={sidebarCollapsed} />

        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
