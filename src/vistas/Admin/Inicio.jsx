import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modulo from "../../components/Modulo";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { Settings, Clipboard } from "lucide-react";

const Inicio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [modulos] = useState([
    { id: 1, titulo: "Configuración", icono: <Settings size={32} className="text-gray-700" />, link: "/admin/periodos" },
    { id: 2, titulo: "Matriculación", icono: "✏️", link: "/matriculacion" },
    { id: 3, titulo: "Calificaciones", icono: <Clipboard size={20}/>, path:"/admin/calificaciones", link: "/panelcursos"},
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.subRol !== "Administrador") {
        navigate("/");
        return;
      }

      setUsuario(parsedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleModuloClick = (modulo) => {
    setLoading(true);
    setTimeout(() => {
      navigate(modulo.link); // accedes a la propiedad link del objeto
    }, 800);
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
