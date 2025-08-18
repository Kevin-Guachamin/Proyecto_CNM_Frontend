import React from 'react';
import Sidebar from '../components/Sidebar';
import './Layout.css';

function Layout({ modules, children, showSidebar = true, onNavigate, activeModule }) {

  return (
    <div className='app-layout'>
      <div className='main-content'>
        {showSidebar && <Sidebar modules={modules} onNavigate={onNavigate} activeModule={activeModule}/>}
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;