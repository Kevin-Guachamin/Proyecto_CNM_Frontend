import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import HeaderTabla from "../../../components/HeaderTabla";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import { calcularPromedioFinalNormal } from "./Promedio";
import { calcularPromedioFinalBE } from "./PromedioBe";
import "./ReporteGeneral.css";

function ReporteGeneral() {
  const { nivel } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progreso, setProgreso] = useState(0);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [modules, setModules] = useState([]);
  const [periodoDescripcion, setPeriodoDescripcion] = useState("");

  const nivelesMap = {
    "1ro BE": "1ro Básico Elemental",
    "2do BE": "2do Básico Elemental", 
    "1ro BM": "1ro Básico Medio",
    "2do BM": "2do Básico Medio",
    "3ro BM": "3ro Básico Medio",
    "1ro BS": "1ro Básico Superior",
    "2do BS": "2do Básico Superior",
    "3ro BS": "3ro Básico Superior",
    "1ro BCH": "1ro Bachillerato",
    "2do BCH": "2do Bachillerato",
    "3ro BCH": "3ro Bachillerato",
  };

  const obtenerCualitativa = (n, esBE) => {
    if (esBE) {
      if (n >= 9) return "Domina los aprendizajes requeridos";
      if (n >= 7) return "Alcanza los aprendizajes requeridos";
      if (n > 4) return "Está próximo a alcanzar los aprendizajes requeridos";
      return "No alcanza los aprendizajes requeridos";
    } else {
      if (n >= 7) return "Aprobado";
      if (n >= 4) return "Supletorio";
      return "Reprobado";
    }
  };

  useEffect(() => {
    const su = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!su || !token) return navigate("/");
    
    const u = JSON.parse(su);
    setUsuario(u);
    setModules(transformModulesForLayout(getModulos(u.subRol, true)));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchReporteGeneral = async () => {
      try {
        // Obtener período actual para la descripción
        const { data: periodos } = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/periodos`);
        const periodoActual = periodos.find(p => p.ID === parseInt(state?.idPeriodo));
        setPeriodoDescripcion(periodoActual?.descripcion || "");

        // Obtener estudiantes del nivel
        const { data: estudiantesData } = await axios.get(
          `${import.meta.env.VITE_URL_DEL_BACKEND}/estudiante/nivel/${nivelesMap[nivel]}`
        );

        const estudiantesOrdenados = estudiantesData.sort((a, b) => {
          const apellidoA = `${a.primer_apellido} ${a.segundo_apellido || ""}`.toLowerCase();
          const apellidoB = `${b.primer_apellido} ${b.segundo_apellido || ""}`.toLowerCase();
          return apellidoA.localeCompare(apellidoB);
        });

        setTotalEstudiantes(estudiantesOrdenados.length);
        const resultados = [];

        for (let i = 0; i < estudiantesOrdenados.length; i++) {
          const estudiante = estudiantesOrdenados[i];
          setProgreso(Math.round(((i + 1) / estudiantesOrdenados.length) * 100));
          // Obtener matrícula del estudiante para el período
          const { data: matriculas } = await axios.get(
            `${import.meta.env.VITE_URL_DEL_BACKEND}/matricula/estudiante/${estudiante.ID}`
          );

          const periodoActualId = parseInt(state?.idPeriodo);
          const matriculaActual = matriculas.find(m => m.ID_periodo_academico === periodoActualId);

          if (!matriculaActual) continue;

          // Obtener inscripciones del estudiante
          const { data: inscripciones } = await axios.get(
            `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/obtener/matricula/${matriculaActual.ID}`
          );

          const esBE = estudiante.nivel?.toLowerCase().includes("elemental");
          let promedioGeneral = 0;
          let materiasCursadas = 0;

          for (const insc of inscripciones) {
            let promedioMateria = 0;

            if (esBE) {
              const { data: parciales } = await axios.get(
                `${import.meta.env.VITE_URL_DEL_BACKEND}/parcialesbe/asignacion/${insc.ID_asignacion}`
              );
              const { data: quimestrales } = await axios.get(
                `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestralesbe/asignacion/${insc.ID_asignacion}`
              );

              const { promedioFinal } = calcularPromedioFinalBE(parciales, quimestrales, insc.ID);
              promedioMateria = promedioFinal || 0;
            } else {
              const { data: parciales } = await axios.get(
                `${import.meta.env.VITE_URL_DEL_BACKEND}/parciales/asignacion/${insc.ID_asignacion}`
              );
              const { data: quimestrales } = await axios.get(
                `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestrales/asignacion/${insc.ID_asignacion}`
              );
              const { data: finales } = await axios.get(
                `${import.meta.env.VITE_URL_DEL_BACKEND}/finales/asignacion/${insc.ID_asignacion}`
              );

              const { promedioFinal } = calcularPromedioFinalNormal(parciales, quimestrales, finales, insc.ID);
              promedioMateria = promedioFinal || 0;
            }

            if (promedioMateria > 0) {
              promedioGeneral += promedioMateria;
              materiasCursadas++;
            }
          }

          const promedioFinalEstudiante = materiasCursadas > 0 ? promedioGeneral / materiasCursadas : 0;

          resultados.push({
            nombre: `${estudiante.primer_apellido} ${estudiante.segundo_apellido || ""} ${estudiante.primer_nombre} ${estudiante.segundo_nombre || ""}`,
            cedula: estudiante.nroCedula,
            promedioFinal: promedioFinalEstudiante,
            cualitativa: obtenerCualitativa(promedioFinalEstudiante, esBE),
            esBE
          });
        }

        setEstudiantes(resultados);
      } catch (err) {
        console.error("Error:", err);
        ErrorMessage(err);
        Swal.fire("Error", "No se pudo generar el reporte general.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (nivel && state?.idPeriodo) {
      fetchReporteGeneral();
    } else {
      Swal.fire("Error", "No se pudo determinar el nivel o el período.", "error");
      setLoading(false);
    }
  }, [nivel, state, navigate]);

  const handleSidebarNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Loading />
      {progreso > 0 && (
        <div className="mt-3 text-center">
          <div className="progress" style={{ width: "300px", height: "20px" }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: `${progreso}%` }}
              aria-valuenow={progreso} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {progreso}%
            </div>
          </div>
          <small className="text-muted mt-2 d-block">
            Procesando reportes... ({progreso}/{totalEstudiantes} estudiantes)
          </small>
        </div>
      )}
    </div>
  );

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MÚSICA",
    subtitulo: "REPORTE GENERAL DE PROMOCIÓN",
    info: {
      Nivel: nivel,
      "Año Lectivo": periodoDescripcion,
      "Total Estudiantes": estudiantes.length,
    },
  };

  const columnas = ["No.", "Estudiante", "Cédula", "Promedio Final", "Estado"];

  // Calcular estadísticas
  const estadisticas = React.useMemo(() => {
    const estudiantesConNota = estudiantes.filter(e => e.promedioFinal > 0);
    const aprobados = estudiantes.filter(e => 
      e.cualitativa.includes("Aprobado") || 
      e.cualitativa.includes("Domina") || 
      e.cualitativa.includes("Alcanza")
    ).length;
    const reprobados = estudiantes.filter(e => 
      e.cualitativa.includes("Reprobado") || 
      e.cualitativa.includes("No alcanza")
    ).length;
    const supletorios = estudiantes.length - aprobados - reprobados;

    const promedioGeneral = estudiantesConNota.length > 0 
      ? (estudiantesConNota.reduce((sum, e) => sum + e.promedioFinal, 0) / estudiantesConNota.length)
      : 0;

    return {
      total: estudiantes.length,
      aprobados,
      reprobados,
      supletorios,
      promedioGeneral: promedioGeneral.toFixed(2),
      porcentajeAprobacion: estudiantes.length > 0 ? ((aprobados / estudiantes.length) * 100).toFixed(1) : 0
    };
  }, [estudiantes]);

  return (
    <>
      <div className="container-fluid p-0 sticky-header">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modules} onNavigate={handleSidebarNavigation}>
        <div className="content-container reporte-general-container mt-3">
          <div className="reporte-header-actions">
            <button 
              className="btn btn-outline-secondary btn-sm btn-volver"
              onClick={() => navigate(-1)}
              title="Volver al listado"
            >
              <i className="bi bi-arrow-left"></i>
              Volver
            </button>
            <button 
              className="btn btn-primary btn-sm btn-imprimir"
              onClick={() => window.print()}
              title="Imprimir reporte"
            >
              <i className="bi bi-printer"></i>
              Imprimir
            </button>
          </div>
          <HeaderTabla
            datosEncabezado={datosEncabezado}
            imagenIzquierda="/ConservatorioNacional.png"
            imagenDerecha="/Ministerio.png"
          />
          <div className="tabla-reporte-general mt-4">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  {columnas.map((c, i) => <th key={i}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est, i) => {
                  const getClasePromedio = (promedio) => {
                    if (promedio >= 8.5) return "promedio-alto";
                    if (promedio >= 7) return "promedio-medio"; 
                    return "promedio-bajo";
                  };

                  const getClaseEstado = (estado) => {
                    if (estado.includes("Aprobado") || estado.includes("Domina") || estado.includes("Alcanza")) return "estado-aprobado";
                    if (estado.includes("Supletorio") || estado.includes("próximo")) return "estado-supletorio";
                    return "estado-reprobado";
                  };

                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ textAlign: 'left' }}>{est.nombre}</td>
                      <td>{est.cedula}</td>
                      <td className={est.promedioFinal > 0 ? getClasePromedio(est.promedioFinal) : ""}>
                        {est.promedioFinal > 0 ? est.promedioFinal.toFixed(2) : "—"}
                      </td>
                      <td className={getClaseEstado(est.cualitativa)}>{est.cualitativa}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Estadísticas resumidas */}
          <div className="resumen-estadisticas mt-4">
            <div className="estadistica-card">
              <div className="estadistica-numero">{estadisticas.total}</div>
              <div className="estadistica-label">Total Estudiantes</div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-numero text-success">{estadisticas.aprobados}</div>
              <div className="estadistica-label">Aprobados</div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-numero text-warning">{estadisticas.supletorios}</div>
              <div className="estadistica-label">Supletorios</div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-numero text-danger">{estadisticas.reprobados}</div>
              <div className="estadistica-label">Reprobados</div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-numero text-info">{estadisticas.promedioGeneral}</div>
              <div className="estadistica-label">Promedio General</div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-numero text-primary">{estadisticas.porcentajeAprobacion}%</div>
              <div className="estadistica-label">% Aprobación</div>
            </div>
          </div>
          {estudiantes.length === 0 && (
            <div className="text-center mt-4">
              <p className="text-muted">No se encontraron estudiantes con calificaciones para este nivel.</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default ReporteGeneral;
