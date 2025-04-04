import React, { useState, useEffect } from "react";
import "./Header.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function Header({ isAuthenticated, usuario }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  const getCurrentDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("es-ES", options);
  };

  // Extraer el primer nombre y el primer apellido
  let displayName = "";
  let displayRole = "";
  
  if (usuario) {
    // Combina los campos para formar el nombre completo
    const primerNombre = usuario.primer_nombre || "";
    const primerApellido = usuario.primer_apellido || "";
    
    // Por ejemplo, tomar el primerNombre + primerApellido
    displayName = `${primerNombre} ${primerApellido}`;
  
    // Si el usuario es docente y tiene subRol, mostrarlo; de lo contrario, mostrar rol
    displayRole = (usuario.rol === "docente" && usuario.subRol) 
      ? usuario.subRol 
      : usuario.rol;
  }
  

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
            {/* Sección de información del usuario */}
            <div className="user-info">
              {usuario.foto ? (
                <img src={usuario.foto} alt="Avatar" className="user-avatar" />
              ) : (
                <AccountCircleIcon className="user-icon" style={{ fontSize: "80px" }} />
              )}
              <div className="user-details">
                {/* Mostrar el primer nombre y primer apellido */}
                <p className="user-name">{displayName}</p>
                {/* Mostrar el rol según el tipo de usuario */}
                <p className="user-role">{displayRole}</p>
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
