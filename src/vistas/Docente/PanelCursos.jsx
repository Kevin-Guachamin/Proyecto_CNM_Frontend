import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Layout from "../../layout/Layout";
import Modulo from "../../components/Modulo";
import Loading from "../../components/Loading";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../getModulos";
import Swal from "sweetalert2";
import { useAuth } from "../../Utils/useAuth";


function PanelCursos() {
  // Protección de ruta
  const auth = useAuth(["Profesor", "Administrador", "Vicerrector"]);


  // Si no está autenticado, no renderizar nada
  if (!auth.isAuthenticated) {
    return null;
  }

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);


  function formatearHorario(horario) {
    // Reemplaza cualquier ocurrencia de "HH:MM:SS" por "HH:MM"
    return horario.replace(/(\d{2}:\d{2}):\d{2}/g, "$1");
  }

  const storedToken = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      console.log("este es el usuario que quiero ver", parsedUser)
      setUsuario(parsedUser);

      const modulosBase = getModulos(parsedUser.subRol, true);
      setModules(transformModulesForLayout(modulosBase));

      // Paso 1: Verificar periodo académico activo
      axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/periodo_academico/activo`, config)
        .then((response) => {
          const periodoActivo = response.data;

          if (periodoActivo && periodoActivo.estado === "Activo") {
            // Paso 2: Obtener cursos si el periodo está activo
            axios
              .get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/docente/${parsedUser.nroCedula}`, config)
              .then((response) => {
                const { data, message } = response.data;

                // ✅ Caso: no hay asignaciones (estado normal)
                if (Array.isArray(data) && data.length === 0) {
                  setCursos([]);

                  Swal.fire({
                    icon: "info",
                    title: "Sin asignaciones",
                    text: message || "Aún no tienes cursos asignados para el período activo.",
                    confirmButtonText: "Entendido",
                  });

                  return;
                }

                // ✅ Caso: sí hay asignaciones
                if (Array.isArray(data)) {
                  // Función para determinar si un nivel es BE o Superior
                  const esNivelBE = (nivel) => {
                    return nivel && nivel.includes("BE");
                  };

                  // Agrupar materias individuales por nombre y tipo de nivel
                  const materiasAgrupadas = data.reduce((acc, curso) => {
                    if (curso.tipo === "individual") {
                      const nombreMateria = curso.materia;
                      const tipoNivel = esNivelBE(curso.nivel) ? "BE" : "Superior";
                      const key = `${nombreMateria}_${tipoNivel}`;

                      if (!acc[key]) {
                        acc[key] = {
                          nombreMateria,
                          tipoNivel,
                          asignaciones: []
                        };
                      }

                      acc[key].asignaciones.push(curso);
                    }
                    return acc;
                  }, {});

                  // Crear tarjetas agrupadas para materias individuales
                  const cursosAgrupados = Object.values(materiasAgrupadas).map(grupo => ({
                    id: `grupo_${grupo.nombreMateria}_${grupo.tipoNivel}`,
                    titulo: `Curso: ${grupo.nombreMateria}`,
                    descripcion: `Nivel: ${grupo.tipoNivel}\n${grupo.asignaciones.length} asignación(es)`,
                    link: "/profesor/panelcursos/calificaciones",
                    nivel: grupo.tipoNivel,
                    tipo: "individual",
                    asignaciones: grupo.asignaciones
                  }));

                  // Mantener materias grupales sin cambios
                  const cursosGrupales = data
                    .filter(curso => curso.tipo !== "individual")
                    .map((curso) => ({
                      id: curso.ID,
                      titulo: `Curso: ${curso.materia}`,
                      descripcion: `Paralelo: ${curso.paralelo}\nHorario: ${formatearHorario(curso.horario)}\nNivel: ${curso.nivel}`,
                      link: "/profesor/panelcursos/calificaciones",
                      nivel: curso.nivel,
                      tipo: curso.tipo
                    }));

                  // Combinar ambos tipos
                  const cursosData = [...cursosAgrupados, ...cursosGrupales];

                  setCursos(cursosData);
                }
              })
              .catch((error) => {
                // ❌ Errores reales (401, 500, etc.)
                ErrorMessage(error);
                setCursos([]);
              });

          } else {
            Swal.fire({
              icon: "info",
              title: "Sin período activo",
              text: "No hay un período académico activo actualmente.",
            });
            setCursos([]);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status === 404 &&
            error.response.data?.message === "Periodo no encontrado"
          ) {
            Swal.fire({
              icon: "info",
              title: "Sin período activo",
              text: "No se ha encontrado un período académico activo.",
            });
          } else {
            ErrorMessage(error);
          }
          setCursos([]);
        });
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleModuloClick = (modulo) => {
    setLoading(true);

    // Si es una materia agrupada, manejar todas las asignaciones
    if (modulo.asignaciones && modulo.asignaciones.length > 0) {
      // Navegar con todas las asignaciones del grupo
      navigate("/profesor/panelcursos/calificaciones", { 
        state: {
          tipo: "individual",
          nombreMateria: modulo.titulo.replace("Curso: ", ""),
          tipoNivel: modulo.nivel,
          asignaciones: modulo.asignaciones
        }
      });
      return;
    }

    // Para materias grupales, funcionar como antes
    axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/obtener/${modulo.id}`, config)
      .then((response) => {
        const moduloCompleto = {
          ...response.data,
          nivel: modulo.nivel
        };
        navigate("/profesor/panelcursos/calificaciones", { state: moduloCompleto });
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
          <h2 className="mb-4">Cursos</h2>
          {cursosModulos.length > 0 ? (
            <Modulo modulos={cursosModulos} onModuloClick={handleModuloClick} />
          ) : (
            <div className="alert alert-info">
              Aún no tienes cursos asignados para el período activo.
              <br />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default PanelCursos;
