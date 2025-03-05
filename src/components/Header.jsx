import React, { useState } from "react";
import "./Header.css";

function Header({ isAuthenticated, usuario }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Aquí agregas la lógica real para cerrar sesión
  };

  const getCurrentDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("es-ES", options);
  };

  // **Header Simple (Para el Login)**
  if (!isAuthenticated) {
    return (
      <header className="header-container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">SISTEMA DE GESTIÓN ESTUDIANTIL</h1>
          </div>
          <div className="header-right">
            <p className="header-version">SGE v. 1.0.0</p>
            <p className="header-date">{getCurrentDate()}</p>
          </div>
        </div>
      </header>
    );
  }

  // **Header con Dropdown (Para usuarios autenticados)**
  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo y Título */}
        <div className="header-left">
          <h1 className="header-title">SISTEMA DE GESTIÓN ESTUDIANTIL</h1>
        </div>

        {/* Versión, Fecha y Menú */}
        <div className="header-right">
          <p className="header-version">SGE v. 1.0.0</p>
          <p className="header-date">{getCurrentDate()}</p>

          {/* Icono de Menú */}
          <div className="menu-container">
            <button className="menu-button" onClick={toggleDropdown}>
              ☰
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <p className="user-name">{usuario.nombre}</p>
                <p className="user-role">{usuario.rol}</p>
                <button className="logout-button" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
