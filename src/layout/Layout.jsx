import React from 'react';
import Sidebar from '../components/Sidebar';
import './Layout.css';

function Layout({ modules, children, showSidebar = true, onNavigate }) {
  console.log("estos son los módulos",modules)
  return (
    <div className='app-layout'>
      <div className='main-content'>
        {showSidebar && <Sidebar modules={modules} onNavigate={onNavigate}/>}
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;