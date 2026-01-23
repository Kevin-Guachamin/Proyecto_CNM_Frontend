import React, { useState, useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import Swal from 'sweetalert2';
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import { calcularPromedioQuimestral, calcularPromedioComportamiento, calcularValoracionComportamiento, abreviarNivel } from "./Promedios";
import "./Parcial.css";

const Quimestral = ({ quimestreSeleccionado, parcial1Data, parcial2Data, actualizarDatosQuim, datosModulo, inputsDisabled, onEditar, isWithinRange, rangoTexto, forceEdit, soloLectura, esPorSolicitud }) => {

  const idContenedor = `pdf-quimestral-quim${quimestreSeleccionado}`;

  // Estado que contendrá los datos combinados (por estudiante) provenientes de los parciales
  const [datos, setDatos] = useState([]);

  
  const obtenerEtiquetaQuimestre = () => {
    return quimestreSeleccionado === "1" ? "Q1" : "Q2";
  };

  function parseCampoNumerico(valor) {
    if (typeof valor === "string" && valor.trim() === "") {
      return null; // vacío
    }
    const parsed = parseFloat(valor);
    return isNaN(parsed) ? null : parsed;
  }

  const transformarDatosQuimestralParaGuardar = (datos) => {
    return datos.map((fila) => {
      return {
        id_inscripcion: fila.idInscripcion, // 👈 ojo con la nomenclatura
        examen: parseCampoNumerico(fila["Examen"]),
        quimestre: obtenerEtiquetaQuimestre(),
        "Promedio Completo": parseCampoNumerico(fila["Promedio Final"]),
        "Promedio Comportamiento Completo": parseCampoNumerico(fila["Promedio Comportamiento"])
      };
    });
  };

  const [datosOriginales, setDatosOriginales] = useState([]);

  // Cada vez que lleguen datos de ambos parciales, se combinan
  useEffect(() => {
    if (!datosModulo?.ID) return;

    // ✅ Aquí agregamos el token antes de hacer cualquier request
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;
    const urlQuimestrales = `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestrales/asignacion/${datosModulo.ID}`;

    Promise.all([axios.get(urlInscripciones), axios.get(urlQuimestrales)])
      .then(([respEstudiantes, respQuimestrales]) => {
        const estudiantes = respEstudiantes.data;
        const quimestrales = respQuimestrales.data;
        const nuevosDatos = estudiantes.map(est => {
          const p1 = parcial1Data.find(p => p.id_inscripcion === est.idInscripcion) || {};
          const p2 = parcial2Data.find(p => p.id_inscripcion === est.idInscripcion) || {};
          const saved = quimestrales.find(q =>
            q.idInscripcion === est.idInscripcion &&
            q.quimestre === obtenerEtiquetaQuimestre()
          ) || {};

          const parcial1 = parseFloat(p1["Promedio Final"] || 0);
          const parcial2 = parseFloat(p2["Promedio Final"] || 0);
          const notaExamen = saved.examen ?? "";

          const { ponderacion70, ponderacion30, promedioFinal } = calcularPromedioQuimestral(parcial1, parcial2, notaExamen);

          const comportamientoP1 = p1["Promedio Comportamiento"];
          const comportamientoP2 = p2["Promedio Comportamiento"];
          const comportamientoTotal = calcularPromedioComportamiento(comportamientoP1, comportamientoP2);
          const comportamientoFinal = calcularValoracionComportamiento(comportamientoTotal);

          return {
            idInscripcion: est.idInscripcion,
            idQuimestral: saved.id,
            "Nro": est.nro,
            "Nómina de Estudiantes": est.nombre,
            "Primer Parcial": parcial1.toFixed(2),
            "Segundo Parcial": parcial2.toFixed(2),
            "Ponderación 70%": ponderacion70.toFixed(2),
            "Examen": notaExamen,
            "Ponderación 30%": ponderacion30.toFixed(2),
            "Promedio Final": promedioFinal.toFixed(2),
            "Promedio Comportamiento": comportamientoTotal.toFixed(2),
            "Nivel": abreviarNivel(est.nivel),
            "Comportamiento Final": comportamientoFinal,
          };
        });
        setDatos(nuevosDatos);
        setDatosOriginales(JSON.parse(JSON.stringify(nuevosDatos)));
        actualizarDatosQuim(nuevosDatos);
      })
      .catch(err => {
        ErrorMessage(err);
      });
  }, [datosModulo, parcial1Data, parcial2Data, quimestreSeleccionado]);

  useEffect(() => {
    // Sólo disparar cuando ya tengamos filas con cálculo listo
    if (!datos || datos.length === 0) return;

    // Filtra filas válidas (aquí todas tienen “Promedio Final” calculado)
    const datosCompletos = datos.filter(fila => fila["Promedio Final"] !== undefined && fila["Comportamiento Final"] !== undefined);

    if (typeof actualizarDatosQuim === "function" && datosCompletos.length > 0) {
      const datosTransformados = transformarDatosQuimestralParaGuardar(datosCompletos);
      actualizarDatosQuim(datosTransformados);
    }
  }, [datos, actualizarDatosQuim, quimestreSeleccionado]);

  // Función para manejar cambios en los inputs de la tabla (en este caso, solo para la columna "Examen")
  const handleInputChange = (rowIndex, columnName, value) => {
    if (!isWithinRange && !forceEdit) {
      Swal.fire({
        icon: 'info',
        title: 'Fuera de fecha',
        text: 'No se pueden editar notas fuera del rango de fechas establecido.',
      });
      return;
    }

    if (inputsDisabled) {
      Swal.fire({
        icon: 'info',
        title: 'Edición bloqueada',
        text: 'Este quimestre ya fue guardado o bloqueado.',
      });
      return;
    }

    const nuevosDatos = datos.map((fila, i) => {
      if (i === rowIndex) {
        let nuevaFila = { ...fila };

        if (columnName === "Examen") {
          if (value === "") {
            nuevaFila["Examen"] = "";
          } else if (!/^\d{0,2}(\.\d{0,2})?$/.test(value) || value > 10 || value < 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error de Validación',
              text: 'El valor debe estar entre 0.00 y 10.00 con máximo dos decimales.',
              confirmButtonColor: '#3085d6',
            });
            return fila;
          } else {
            nuevaFila["Examen"] = value;
          }
        }

        // Recalcular la ponderación del examen y el promedio final
        const parcial1 = nuevaFila["Primer Parcial"];
        const parcial2 = nuevaFila["Segundo Parcial"];
        const { ponderacion30, promedioFinal } = calcularPromedioQuimestral(parcial1, parcial2, nuevaFila["Examen"]);

        nuevaFila["Ponderación 30%"] = ponderacion30.toFixed(2);
        nuevaFila["Promedio Final"] = promedioFinal.toFixed(2);

        return nuevaFila;
      }
      return fila;
    });
    setDatos(nuevosDatos);
  };

  const subtitulo = `ACTA DE RESUMEN DEL ${quimestreSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} QUIMESTRE`;

  const determinarJornada = (horario) => {
    const horaInicio = horario.split("-")[0];
    const horaNumerica = parseInt(horaInicio.split(":")[0], 10);
    return horaNumerica < 12 ? "Matutina" : "Vespertina";
  };

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MUSICA",
    subtitulo: subtitulo,
    info: {
      "Profesor": datosModulo.docente,
      "Asignatura": datosModulo.materia,
      "Curso": datosModulo.año,
      "Paralelo": datosModulo.paralelo,
      "Año Lectivo": datosModulo.periodo,
      "Jornada": determinarJornada(datosModulo.horario)
    }
  };

  const columnasAgrupadas = [
    { titulo: "", colspan: 2 },
    { titulo: "RESUMEN DE APRENDIZAJES Y COMPORTAMIENTO", colspan: 9 },
  ];

  const columnas = [
    "Primer Parcial", "Segundo Parcial", "Ponderación 70%",
    "Examen", "Ponderación 30%", "Promedio Final", "Promedio Comportamiento", "Nivel", "Comportamiento Final"
  ];

  // Indicamos que la columna "Examen" es editable, similar a como se hace en el componente de Parcial
  const columnasEditables = ["Examen"];

  const realmenteDeshabilitado = soloLectura || inputsDisabled || (!isWithinRange && !forceEdit);

  const handleGuardar = (rowIndex, rowData) => {
    if (!rowData.idQuimestral) {
      Swal.fire({
        icon: "error",
        title: "Registro no encontrado",
        text: "No se puede actualizar porque aún no existe un registro para este estudiante.",
      });
      return;
    }

    const original = datosOriginales[rowIndex];
    const haCambiado = JSON.stringify(rowData) !== JSON.stringify(original);

    if (!haCambiado) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No has realizado ningún cambio en esta fila.",
      });
      return;
    }

    const examen = parseFloat(rowData["Examen"]);
    if (isNaN(examen) || examen < 0 || examen > 10) {
      Swal.fire({
        icon: "error",
        title: "Valor inválido",
        text: "La nota del examen debe estar entre 0.00 y 10.00.",
      });
      return;
    }

    const body = {
      id_inscripcion: rowData.idInscripcion,
      quimestre: quimestreSeleccionado === "1" ? "Q1" : "Q2",
      examen,
    };

    axios
      .put(`${import.meta.env.VITE_URL_DEL_BACKEND}/quimestrales/${rowData.idQuimestral}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "La nota del examen quimestral se actualizó correctamente.",
        });
        const copia = [...datosOriginales];
        copia[rowIndex] = JSON.parse(JSON.stringify(rowData));
        setDatosOriginales(copia);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar ❌.",
          text: "No se pudo actualizar la nota del examen.",
        });
        ErrorMessage(error);
      });
  };

  return (
    <div id={idContenedor} className="container tabla-quimestral">
      <HeaderTabla
        datosEncabezado={datosEncabezado}
        imagenIzquierda={"/ConservatorioNacional.png"}
        imagenDerecha={"/Ministerio.png"}
      />
      {!isWithinRange && (
        <div className="alert alert-warning text-center screen-only">
          🕒 {rangoTexto || "Este parcial aún no está disponible para edición."}
        </div>
      )}
      <Tabla
        columnasAgrupadas={columnasAgrupadas}
        columnas={columnas}
        datos={datos}
        onChange={handleInputChange}
        columnasEditables={columnasEditables}
        inputsDisabled={realmenteDeshabilitado}
        onEditar={onEditar}
        onGuardar={handleGuardar}
        rangoTexto={rangoTexto}
        isWithinRange={isWithinRange}
        globalEdit={forceEdit}
        soloLectura={soloLectura}
        esPorSolicitud={esPorSolicitud}
      />
    </div>
  );
};

export default Quimestral;