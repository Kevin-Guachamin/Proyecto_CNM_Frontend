import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import HeaderTabla from "../../../components/HeaderTabla";
import Tabla from "../../../components/Tabla";
import Loading from "../../../components/Loading";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import {  exportarListadoAPDF } from "./FuncionesParaListados";
import "./Exportaciones.css";

function ListadoCursos() {
  const { id_asignacion } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const datosModulo = location.state || JSON.parse(sessionStorage.getItem("datosModulo") || "{}");

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estudiantes, setEstudiantes] = useState([]);
  const [idPeriodo, setIdPeriodo] = useState(null);

  const determinarJornada = (horario) => {
    if (!horario) return "-";
    const horaInicio = horario.split("-")[0];
    const horaNumerica = parseInt(horaInicio.split(":")[0], 10);
    return horaNumerica < 12 ? "Matutina" : "Vespertina";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUsuario(parsedUser);

    if (location.state) {
      sessionStorage.setItem("datosModulo", JSON.stringify(location.state));
    }
    
    axios
      .get(`${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${id_asignacion}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEstudiantes(res.data || []);
        if (datosModulo.idPeriodo) {
          setIdPeriodo(datosModulo.idPeriodo);
        } else {
          console.warn("No se encontró idPeriodo en datosModulo");
        }        
      })
      .catch(ErrorMessage)
      .finally(() => setLoading(false));
  }, [id_asignacion, navigate]);

  const columnas = []; // Solo usamos Nro y Nómina (que el componente Tabla ya incluye)

  const tablaFormateada = estudiantes.map((e) => ({
    "Nro": e.nro,
    "Nómina de Estudiantes": e.nombre,
  }));


  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MUSICA",
    subtitulo: "LISTADO DE ESTUDIANTES",
    info: {
      "Profesor": datosModulo.docente,
      "Asignatura": datosModulo.materia,
      "Año Lectivo": datosModulo.descripcionPeriodo,
      "Paralelo": datosModulo.paralelo,
      "Jornada": determinarJornada(datosModulo.horario),
    },
  };

  if (loading) return <Loading />;

  return (
    <>
      {usuario && <Header isAuthenticated={true} usuario={usuario} />}

      <div id="contenido-exportable" className="container content-container mt-3">
        <div className="d-flex justify-content-end mb-3 no-print">
          <div className="d-flex align-items-center gap-2">
            <span className="label-text">Exportaciones:</span>
            {/* <button
              className="btn btn-success btn-sm"
              onClick={() => {
                const datosModuloConJornada = {
                  ...datosModulo,
                  jornada: determinarJornada(datosModulo.horario),
                };
                exportarListadoAExcel(tablaFormateada, datosModuloConJornada);
              }}              
              title="Exportar a Excel"
            >
              <i className="bi bi-file-earmark-excel-fill"></i>
            </button> */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() =>
                exportarListadoAPDF("contenido-exportable", `ListadoEstudiantes_${datosModulo.materia}_${datosModulo.paralelo}.pdf`)
              }
              title="Exportar a PDF"
            >
              <i className="bi bi-file-earmark-pdf-fill"></i>
            </button>
          </div>
        </div>

        <HeaderTabla
          datosEncabezado={datosEncabezado}
          imagenIzquierda={"/ConservatorioNacional.png"}
        />

        <Tabla
          columnas={columnas}
          columnasAgrupadas={null}
          datos={tablaFormateada}
          mostrarEditar={false}
          mostrarGuardar={false}
          clasePersonalizada="tabla-listado"
        />
        <div className="d-flex justify-content-center mt-4 no-print">
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-3"
            style={{ maxWidth: "100px" }}
            onClick={() => navigate(`/secretaria/periodo/materias/${idPeriodo}`)}
          >
            <i className="bi bi-arrow-left-circle-fill"></i> Regresar
          </button>
        </div>
      </div>
    </>
  );
}

export default ListadoCursos;
