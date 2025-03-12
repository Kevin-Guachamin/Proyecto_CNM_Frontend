import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Asegúrate de importar el archivo CSS

function Sidebar({ modules }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Al cargar el componente, verifica si hay un módulo activo guardado en localStorage
    const savedModule = localStorage.getItem("activeModule");
    if (savedModule) {
      setActiveModule(parseInt(savedModule));
    }
  }, []);

  const handleNavigation = (index, path) => {
    setActiveModule(index);
    localStorage.setItem("activeModule", index); // Guardar el módulo activo en localStorage
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

export default Sidebar;
