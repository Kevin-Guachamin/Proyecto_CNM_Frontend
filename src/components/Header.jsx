import React, { useState, useEffect } from "react";
import "./Header.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function Header({ isAuthenticated, usuario }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegar

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    document.body.classList.toggle("menu-open", !isDropdownOpen);
  };

  const closeDropdown = (e) => {
    if (isDropdownOpen && !e.target.closest(".menu-container")) {
      setDropdownOpen(false);
      document.body.classList.remove("menu-open");
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    // Lógica de cierre de sesión
    console.log("Cerrando sesión...");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const getCurrentDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("es-ES", options);
  };

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

  return (
    <>
      <header className="header-container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">SISTEMA DE GESTIÓN ESTUDIANTIL</h1>
          </div>

          <div className="header-right">
            <p className="header-version">SGE v. 1.0.0</p>
            <p className="header-date">{getCurrentDate()}</p>

            <div className="menu-container">
              <button className="menu-button" onClick={toggleDropdown}>
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay y menú desplegable */}
      {isDropdownOpen && (
        <>
          <div className={`overlay ${isDropdownOpen ? "show" : ""}`}></div>
          <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
            {/* Sección del usuario con icono o imagen */}
            <div className="user-info">
              {usuario.foto ? (
                <img src={usuario.foto} alt="Avatar" className="user-avatar" />
              ) : (
                <AccountCircleIcon className="user-icon" style={{ fontSize: "80px" }} />
              )}
              <div className="user-details">
                <p className="user-name">{usuario.nombre}</p>
                <p className="user-role">{usuario.rol}</p>
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <div className="logout-container">
              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;
