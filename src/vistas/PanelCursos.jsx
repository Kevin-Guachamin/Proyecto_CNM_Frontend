import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Layout from "../layout/Layout";
import Modulo from "../components/Modulo";
import Loading from "../components/Loading";
import { Home, Users, Settings, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../Utils/ErrorMesaje";

function PanelCursos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  const modules = [
    { name: "Inicio", icon: <Home size={20} />, path: "/inicio" },
    { name: "Usuarios", icon: <Users size={20} />, path: "/usuarios" },
    { name: "Configuración", icon: <Settings size={20} />, path: "/configuracion" },
  ];

  function formatearHorario(horario) {
    // Reemplaza cualquier ocurrencia de "HH:MM:SS" por "HH:MM"
    return horario.replace(/(\d{2}:\d{2}):\d{2}/g, "$1");
  }
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");
  
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
  
      axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/docente/${parsedUser.nroCedula}`)
        .then((response) => {
          const data = response.data;
  
          if (Array.isArray(data) && data.length > 0) {
            const cursosData = data.map((curso) => ({
              id: curso.ID,
              titulo: `Curso: ${curso.materia}`,
              descripcion: `Paralelo: ${curso.paralelo}\n Horario: ${formatearHorario(curso.horario)}`,
              link: "/calificaciones"
            }));
            setCursos(cursosData);
          } else {
            setCursos([]);
          }
        })
        .catch((error) => {
          ErrorMessage(error);
          setCursos([]);
        });
    } else {
      navigate("/");
    }
  }, [navigate]);
  
  const handleModuloClick = (modulo) => {
    console.log("Modulo seleccionado:", modulo);  // <-- Añade este log
    setLoading(true);
    
    axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/obtener/${modulo.id}`)
      .then((response) => {
        const moduloCompleto = response.data;
        navigate("/calificaciones", { state: moduloCompleto });
      })
      .catch((error) => {
        ErrorMessage(error);
        setLoading(false); 
        alert("Ocurrió un error al cargar los datos del módulo.");
      });
  };
  
  const handleSidebarNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  const iconoCurso = <BookOpen size={40} />;
  const cursosModulos = cursos.map((curso) => ({ ...curso, icono: iconoCurso }));

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules} onNavigate={handleSidebarNavigation}>
        <div className="content-container">
          <h2 className="mb-4">Panel de Cursos</h2>
          <Modulo modulos={cursosModulos} onModuloClick={(modulo) => handleModuloClick(modulo)} />
          </div>
      </Layout>
    </>
  );
}

export default PanelCursos;
