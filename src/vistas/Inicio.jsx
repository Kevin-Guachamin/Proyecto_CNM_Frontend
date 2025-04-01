// Inicio.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Modulo from "../components/Modulo"; // O el componente que uses para mostrar los módulos
import { getModulos } from "./getModulos";

const Inicio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      if (!["Profesor", "Vicerrector", "Secretaria"].includes(parsedUser.subRol)) {
        navigate("/");
        return;
      }
      setUsuario(parsedUser);
      // No incluimos "Inicio" porque ya estamos en la vista Inicio
      setModulos(getModulos(parsedUser.subRol, false));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleModuloClick = (modulo) => {
    // Ejemplo de navegación
    navigate(modulo.link);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      <h2 style={{ textAlign: "left", marginLeft: "20px" }}>Módulos</h2>
      <Modulo modulos={modulos} onModuloClick={handleModuloClick} />
    </div>
  );
};

export default Inicio;
