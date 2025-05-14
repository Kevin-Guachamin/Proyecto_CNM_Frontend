import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderTabla from "../../../components/HeaderTabla";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import { obtenerPromediosPorAsignatura } from "./Promedio";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import Swal from "sweetalert2";

function ReporteEstudiante() {
  const location = useLocation();
  const navigate = useNavigate();
  const { estudiante } = location.state || {};
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      const modulosBase = getModulos(parsedUser.subRol, true);
      setModules(transformModulesForLayout(modulosBase));
    }
  }, []);

  const columnas = ["Asignatura", "Promedio Final", "Calificación Cualitativa"];

  useEffect(() => {
    if (!estudiante?.idMatricula || estudiante.idMatricula === "undefined") {
      Swal.fire("Error", "No se encontró el ID de matrícula del estudiante.", "error");
      navigate("/secretaria/reportes");
      return;
    }

    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const esBE = estudiante.nivel?.toLowerCase().includes("be");

    obtenerPromediosPorAsignatura(estudiante.idMatricula, esBE)
      .then((res) => {
        const materiasConvertidas = res.map((m) => ({
          Asignatura: m.asignatura,
          "Promedio Final": m.promedio,
          "Calificación Cualitativa": m.cualitativa
        }));
        setMaterias(materiasConvertidas);
      })
      .catch((err) => {
        ErrorMessage(err);
        setMaterias([]);
      })
      .finally(() => setLoading(false));
  }, [estudiante]);

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MÚSICA",
    subtitulo: "CERTIFICADO DE PROMOCIÓN",
    info: {
      Estudiante: estudiante?.nombre,
      Cédula: estudiante?.cedula,
      Nivel: estudiante?.nivel,
      "Año Lectivo": estudiante?.anioLectivo,
    },
  };

  if (loading) return <Loading />;

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
                <tr>
                  {columnas.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materias.map((materia, idx) => (
                  <tr key={idx}>
                    <td>{materia["Asignatura"]}</td>
                    <td>{materia["Promedio Final"]}</td>
                    <td>{materia["Calificación Cualitativa"]}</td>
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