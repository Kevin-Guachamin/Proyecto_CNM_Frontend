import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ modules }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 📌 Para obtener la URL actual

  // 📌 Actualiza el módulo activo basado en la URL actual
  useEffect(() => {
    const currentIndex = modules.findIndex((mod) => mod.path === location.pathname);
    setActiveModule(currentIndex);
  }, [location.pathname, modules]); // Se ejecuta cuando cambia la URL

  const handleNavigation = (index, path) => {
    setActiveModule(index);
    navigate(path);
  };

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
            onClick={() => handleNavigation(index, mod.path)}
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
export default Sidebar
