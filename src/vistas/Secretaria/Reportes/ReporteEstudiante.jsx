import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import HeaderTabla from "../../../components/HeaderTabla";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import { calcularPromedioFinalNormal } from "./Promedio";
import { calcularPromedioFinalBE } from "./PromedioBe";

function ReporteEstudiante() {
  const { estudiante, esBE } = useLocation().state || {};
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [modules, setModules] = useState([]);

  const obtenerCualitativa = (n) => {
    if (n >= 9) return "Domina los aprendizajes requeridos";
    if (n >= 7) return "Alcanza los aprendizajes requeridos";
    if (n > 4) return "Está próximo a alcanzar los aprendizajes requeridos";
    return "No alcanza los aprendizajes requeridos";
  };

  useEffect(() => {
    if (!estudiante?.idMatricula) {
      Swal.fire("Error", "No encontramos la matrícula del estudiante.", "error");
      return navigate("/secretaria/reportes");
    }

    const su = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!su || !token) return navigate("/");
    const u = JSON.parse(su);
    setUsuario(u);
    setModules(transformModulesForLayout(getModulos(u.subRol, true)));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchNotas = async () => {
      try {
        const { data: inscData } = await axios.get(
          `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/obtener/matricula/${estudiante.idMatricula}`
        );

        const resultados = [];
        for (const insc of inscData) {
          if (esBE) {
            const { data: parciales } = await axios.get(
              `${import.meta.env.VITE_URL_DEL_BACKEND}/parcialesbe/asignacion/${insc.ID_asignacion}`
            );
            const { data: quimestrales } = await axios.get(
              `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestralesbe/asignacion/${insc.ID_asignacion}`
            );

            const { promedioFinal } = calcularPromedioFinalBE(parciales, quimestrales, insc.ID);

            resultados.push({
              Asignatura: insc.Asignacion?.Materia?.nombre || "—",
              "Promedio Final": promedioFinal?.toFixed(2) || "—",
              "Calificación Cualitativa": promedioFinal ? obtenerCualitativa(promedioFinal) : "—",
            });

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

            const obtenerEstado = (n) => {
              if (n >= 7) return "Aprobado";
              if (n >= 4) return "Supletorio";
              return "Reprobado";
            };

            resultados.push({
              Asignatura: insc.Asignacion?.Materia?.nombre || "—",
              "Promedio Final": promedioFinal?.toFixed(2) || "—",
              "Calificación Cualitativa": promedioFinal ? obtenerEstado(promedioFinal) : "—",
            });
          }
        }

        setMaterias(resultados);
      } catch (err) {
        ErrorMessage(err);
        Swal.fire("Error", "No se pudo calcular la nota final.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, [estudiante, navigate]);

  if (loading) return <Loading />;

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MÚSICA",
    subtitulo: "CERTIFICADO DE PROMOCIÓN",
    info: {
      Estudiante: estudiante.nombre,
      Cédula: estudiante.cedula,
      Nivel: estudiante.nivel,
      "Año Lectivo": estudiante.anioLectivo,
    },
  };

  const columnas = ["Asignatura", "Promedio Final", "Calificación Cualitativa"];

  return (
    <>
      <div className="container-fluid p-0 sticky-header">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modules}>
        <div className="content-container mt-3">
          <HeaderTabla
            datosEncabezado={datosEncabezado}
            imagenIzquierda="/ConservatorioNacional.png"
            imagenDerecha="/Ministerio.png"
          />
          <div className="tabla-certificado mt-4">
            <table className="table table-bordered text-center">
              <thead className="table-primary">
                <tr>{columnas.map((c, i) => <th key={i}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {materias.map((m, i) => (
                  <tr key={i}>
                    <td>{m.Asignatura}</td>
                    <td>{m["Promedio Final"]}</td>
                    <td>{m["Calificación Cualitativa"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ReporteEstudiante;