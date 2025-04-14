import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Modulo from "../../../components/Modulo";
import Loading from "../../../components/Loading";
import { Users, UserRoundCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getModulos, transformModulesForLayout } from "../../getModulos";

function InformacionEstudiantil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    // 🔐 Verifica si hay usuario y token
    if (!storedUser || !storedToken) {
      navigate("/");
      return;
    }

    // ✅ Guarda usuario e inicializa módulos del sidebar
    const parsedUser = JSON.parse(storedUser);
    setUsuario(parsedUser);

    const modulosBase = getModulos(parsedUser.subRol, true);
    setModules(transformModulesForLayout(modulosBase));
  }, [navigate]);

  // 🔁 Redirección al hacer clic en un módulo
  const handleModuloClick = (modulo) => {
    navigate(modulo.link, { state: modulo });
  };

  // 🧭 Navegación desde el sidebar
  const handleSidebarNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  // 📦 Datos estáticos para módulos
  const modulosData = [
    {
      id: "representante",
      titulo: (
        <>
          <i className="bi bi-person-badge-fill me-2"></i>Representante
        </>
      ),
      descripcion: "Gestión de representantes legales",
      link: "/secretaria/informacion/representantes",
      icono: <UserRoundCheck size={40} />,
    },
    {
      id: "estudiantes",
      titulo: (
        <>
          <i className="bi bi-person-lines-fill me-2"></i>Estudiantes
        </>
      ),
      descripcion: "Gestión de datos estudiantiles",
      link: "/secretaria/informacion/estudiantes",
      icono: <Users size={40} />,
    },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules} onNavigate={handleSidebarNavigation}>
        <div className="content-container">
          <h2 className="mb-4">Gestión de Información Estudiantil</h2>
          <Modulo modulos={modulosData} onClick={handleModuloClick} />
        </div>
      </Layout>
    </>
  );
}

export default InformacionEstudiantil;