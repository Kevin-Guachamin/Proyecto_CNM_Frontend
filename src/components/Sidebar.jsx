import React, { useState } from "react";
import { Home, Users, Settings, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import "./Sidebar.css"; // Asegúrate de importar el archivo CSS

function Sidebar({ modules }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="header">
        <button onClick={() => setCollapsed(!collapsed)} className="toggle-btn">
          {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

      </div>

      <ul className="menu">
        {modules.map((mod, index) => (
          <li
            key={index}
            onClick={() => setActiveModule(index)}
            className={`menu-item ${activeModule === index ? "active" : ""}`}
          >
            {mod.icon}
            {!collapsed && <span>{mod.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;