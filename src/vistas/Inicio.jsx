import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modulo from "../components/Modulo";
import Header from "../components/Header";
import Loading from "../components/Loading";

const Inicio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [modulos] = useState([
    { id: 1, titulo: "Información Estudiantil", icono: "📄", link: "/informacion" },
    { id: 2, titulo: "Matriculación", icono: "✏️", link: "/matriculacion" },
    { id: 3, titulo: "Calificaciones", icono: "📊", link: "/panelcursos"},
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.rol !== "docente") {
        navigate("/");
        return;
      }

      setUsuario(parsedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Manejo del click en módulos con loader
  const handleModuloClick = (link) => {
    setLoading(true);
    setTimeout(() => {
      navigate(link);
    }, 800); // Ajusta el tiempo según prefieras
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
