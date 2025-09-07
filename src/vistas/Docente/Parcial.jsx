import React, { useState, useEffect, useRef } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import Swal from 'sweetalert2';
import "./Parcial.css";
import { calcularPromedioParcial, calcularSumaComportamiento, calcularValoracionComportamiento, abreviarNivel } from "./Promedios"

function Parcial({ quimestreSeleccionado, parcialSeleccionado, actualizarDatosParcial, datosModulo, inputsDisabled, onEditar, isWithinRange, rangoTexto, forceEdit, soloLectura }) {
  // ID dinámico: pdf-parcial1-quim1, pdf-parcial2-quim1, pdf-parcial1-quim2, etc.
  const idContenedor = `pdf-parcial${parcialSeleccionado}-quim${quimestreSeleccionado}`;

  const subtitulo = `ACTA DE CALIFICACIONES ${parcialSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} PARCIAL - ${quimestreSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} QUIMESTRE`;

  // ⬇️ Aquí implementamos la función para determinar la jornada
  const determinarJornada = (horario) => {
    const horaInicio = horario.split("-")[0];
    const horaNumerica = parseInt(horaInicio.split(":")[0], 10);
    return horaNumerica < 12 ? "Matutina" : "Vespertina";
  };

  const [datosOriginales, setDatosOriginales] = useState([]);

  const obtenerEtiquetaQuimestre = () => {
    return quimestreSeleccionado === "1" ? "Q1" : "Q2";
  };

  const obtenerEtiquetaParcial = () => {
    return parcialSeleccionado === "1" ? "P1" : "P2";
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
    { titulo: "Evaluación de Aprendizajes", colspan: 6 },
    { titulo: "Evaluación del Comportamiento", colspan: 13 },
  ];


  const columnas = [
    "INSUMO 1", "INSUMO 2", "PONDERACIÓN 70%", "EVALUACIÓN SUMATIVA", "PONDERACIÓN 30%", "PROMEDIO PARCIAL",
    "RESPETO Y CONSIDERACION", "VALORACION DE LA DIVERSIDAD", "CUMPLIMIENTO DE LAS NORMA DE CONVIVENCIA",
    "CUIDADO  DEL PATRIMONIO INSTITUCIONAL", "RESPETO A LA PROPIEDAD AJENA", "PUNTUALIDAD Y ASISTENCIA", "HONESTIDAD ",
    "PRESENTACION PERSONAL (LIMPIEZA Y UNIFORME)", "PARTICIPACION COMUNITARIA", "RESPONSABILIDAD ", "PROMEDIO COMPORTAMIENTO",
    "NIVEL", "VALORACION"
  ];

  const [datos, setDatos] = useState([]);

  // Definir qué columnas son editables en Parciales
  const columnasEditables = [
    "INSUMO 1", "INSUMO 2", "EVALUACIÓN SUMATIVA",
    "RESPETO Y CONSIDERACION", "VALORACION DE LA DIVERSIDAD", "CUMPLIMIENTO DE LAS NORMA DE CONVIVENCIA",
    "CUIDADO  DEL PATRIMONIO INSTITUCIONAL", "RESPETO A LA PROPIEDAD AJENA", "PUNTUALIDAD Y ASISTENCIA", "HONESTIDAD ",
    "PRESENTACION PERSONAL (LIMPIEZA Y UNIFORME)", "PARTICIPACION COMUNITARIA", "RESPONSABILIDAD "
  ];
  const columnasComportamiento = [
    "RESPETO Y CONSIDERACION", "VALORACION DE LA DIVERSIDAD", "CUMPLIMIENTO DE LAS NORMA DE CONVIVENCIA",
    "CUIDADO  DEL PATRIMONIO INSTITUCIONAL", "RESPETO A LA PROPIEDAD AJENA", "PUNTUALIDAD Y ASISTENCIA", "HONESTIDAD ",
    "PRESENTACION PERSONAL (LIMPIEZA Y UNIFORME)", "PARTICIPACION COMUNITARIA", "RESPONSABILIDAD "
  ];

  function parseCampoNumerico(valor) {
    if (typeof valor === "string" && valor.trim() === "") {
      return null; // vacío
    }
    const parsed = parseFloat(valor);
    return isNaN(parsed) ? null : parsed;
  }

  // 🔁 Transformador que ajusta la estructura a lo que necesita el backend
  const transformarDatosParaGuardar = (datos) => {
    return datos.map((fila) => {
      const comportamiento = columnasComportamiento.map((col) => {
        const parsed = parseInt(fila[col]);
        return isNaN(parsed) ? null : parsed;
      });

      return {
        id_inscripcion: fila.idInscripcion,
        insumo1: parseCampoNumerico(fila["INSUMO 1"]),
        insumo2: parseCampoNumerico(fila["INSUMO 2"]),
        evaluacion: parseCampoNumerico(fila["EVALUACIÓN SUMATIVA"]),
        comportamiento, // array con valores numéricos o null
        quimestre: obtenerEtiquetaQuimestre(),
        parcial: obtenerEtiquetaParcial(),
        "Promedio Final": parseCampoNumerico(fila["PROMEDIO PARCIAL"]),
        "Promedio Comportamiento": parseCampoNumerico(fila["PROMEDIO COMPORTAMIENTO"])
      };
    });
  };

  // Combina la lógica de "deshabilitado por fuera de fecha" y "deshabilitado por prop"
  const realmenteDeshabilitado = soloLectura || inputsDisabled || (!isWithinRange && !forceEdit);

  // ✅ Nuevo useEffect que envía datos transformados al padre
  useEffect(() => {
    // ✅ Nos aseguramos de que ya haya datos con cálculos listos
    if (!datos || datos.length === 0) return;

    const datosCompletos = datos.filter(fila => fila["PROMEDIO PARCIAL"] !== undefined);

    if (actualizarDatosParcial && datosCompletos.length > 0) {
      const datosTransformados = transformarDatosParaGuardar(datos);
      actualizarDatosParcial(datosTransformados);
    }
  }, [datos, actualizarDatosParcial, quimestreSeleccionado, parcialSeleccionado]);

  // Manejar cambios en los inputs de la tabla
  const handleInputChange = (rowIndex, columnName, value) => {
    // Chequeamos si ya está bloqueado por prop o por fecha
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
        text: 'Este parcial ya se bloqueó o se guardó definitivamente.',
      });
      return;
    }
    const nuevosDatos = datos.map((fila, i) => {
      if (i === rowIndex) {
        let nuevaFila = { ...fila };

        // Validar que Insumo 1, Insumo 2 y Evaluación Sumativa acepten solo valores entre 0.00 y 10.00
        if (["INSUMO 1", "INSUMO 2", "EVALUACIÓN SUMATIVA"].includes(columnName)) {
          if (value === "") {
            nuevaFila[columnName] = ""; // Permitir borrar el dato
          } else if (!/^\d{0,2}(\.\d{0,2})?$/.test(value) || value > 10 || value < 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error de Validación',
              text: 'El valor debe estar entre 0.00 y 10.00 con máximo dos decimales.',
              confirmButtonColor: '#3085d6',
            });
            return fila; // No actualizar si el valor es inválido
          } else {
            nuevaFila[columnName] = value;
          }
        }

        // Validar que las columnas de comportamiento solo acepten 0 o 1
        else if (columnasComportamiento.includes(columnName)) {
          if (value === "") {
            nuevaFila[columnName] = ""; // Permitir borrar el dato
          } else if (value !== "0" && value !== "1") {
            Swal.fire({
              icon: 'error',
              title: 'Error de Validación',
              text: 'Solo se permite ingresar 0 o 1 en este campo.',
              confirmButtonColor: '#3085d6',
            });
            return fila; // No actualizar si el valor no es 0 o 1
          } else {
            nuevaFila[columnName] = value;
          }
        }

        // Cálculo de suma de comportamiento
        const sumaComportamiento = calcularSumaComportamiento(nuevaFila, columnasComportamiento);
        const { ponderacion70, ponderacion30, promedioParcial } = calcularPromedioParcial(
          nuevaFila["INSUMO 1"],
          nuevaFila["INSUMO 2"],
          nuevaFila["EVALUACIÓN SUMATIVA"]
        );

        // Actualizar los valores en la fila
        return {
          ...nuevaFila,
          "PONDERACIÓN 70%": ponderacion70.toFixed(2),
          "PONDERACIÓN 30%": ponderacion30.toFixed(2),
          "PROMEDIO PARCIAL": promedioParcial.toFixed(2),
          "PROMEDIO COMPORTAMIENTO": sumaComportamiento, // Para la sección de comportamiento
          "VALORACION": calcularValoracionComportamiento(sumaComportamiento),
        };
      }
      return fila;
    });

    setDatos(nuevosDatos);
  };

  const safe = (val) => (val === 0 || val === "0") ? "0" : (val !== undefined && val !== null ? val : "");

  const calcularDatosFila = (fila) => {
    const sumaComportamiento = calcularSumaComportamiento(fila, columnasComportamiento);
    const { ponderacion70, ponderacion30, promedioParcial } = calcularPromedioParcial(
      fila["INSUMO 1"],
      fila["INSUMO 2"],
      fila["EVALUACIÓN SUMATIVA"]
    );

    return {
      ...fila,
      "PONDERACIÓN 70%": ponderacion70.toFixed(2),
      "PONDERACIÓN 30%": ponderacion30.toFixed(2),
      "PROMEDIO PARCIAL": promedioParcial.toFixed(2),
      "PROMEDIO COMPORTAMIENTO": sumaComportamiento,
      "VALORACION": calcularValoracionComportamiento(sumaComportamiento),
    };
  };

  useEffect(() => {
    if (!datosModulo?.ID) return;

    // ✅ Aquí agregamos el token antes de hacer cualquier request
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;
    const urlParciales = `${import.meta.env.VITE_URL_DEL_BACKEND}/parciales/asignacion/${datosModulo.ID}`;

    Promise.all([axios.get(urlInscripciones), axios.get(urlParciales)])
      .then(([respEstudiantes, respParciales]) => {
        const estudiantes = respEstudiantes.data;
        const parciales = respParciales.data;
        
        const nuevosDatos = estudiantes.map(est => {
          const parcialGuardado = parciales.find(p =>
            p.idInscripcion === est.idInscripcion &&
            p.parcial === obtenerEtiquetaParcial() &&
            p.quimestre === obtenerEtiquetaQuimestre()
          ) || {};

          const fila = {
            idInscripcion: est.idInscripcion,
            idParcial: parcialGuardado?.idParcial,
            "Nro": est.nro,
            "Nómina de Estudiantes": est.nombre,
            "INSUMO 1": safe(parcialGuardado?.insumo1),
            "INSUMO 2": safe(parcialGuardado?.insumo2),
            "EVALUACIÓN SUMATIVA": safe(parcialGuardado?.evaluacion),
            "RESPETO Y CONSIDERACION": safe(parcialGuardado?.comportamiento?.[0]),
            "VALORACION DE LA DIVERSIDAD": safe(parcialGuardado?.comportamiento?.[1]),
            "CUMPLIMIENTO DE LAS NORMA DE CONVIVENCIA": safe(parcialGuardado?.comportamiento?.[2]),
            "CUIDADO  DEL PATRIMONIO INSTITUCIONAL": safe(parcialGuardado?.comportamiento?.[3]),
            "RESPETO A LA PROPIEDAD AJENA": safe(parcialGuardado?.comportamiento?.[4]),
            "PUNTUALIDAD Y ASISTENCIA": safe(parcialGuardado?.comportamiento?.[5]),
            "HONESTIDAD ": safe(parcialGuardado?.comportamiento?.[6]),
            "PRESENTACION PERSONAL (LIMPIEZA Y UNIFORME)": safe(parcialGuardado?.comportamiento?.[7]),
            "PARTICIPACION COMUNITARIA": safe(parcialGuardado?.comportamiento?.[8]),
            "RESPONSABILIDAD ": safe(parcialGuardado?.comportamiento?.[9]),
            "PONDERACIÓN 70%": "",
            "PONDERACIÓN 30%": "",
            "PROMEDIO PARCIAL": "",
            "PROMEDIO COMPORTAMIENTO": "",
            "NIVEL": abreviarNivel(est.nivel),
            "VALORACION": ""
          };
          return calcularDatosFila(fila);
        });
        setDatos(nuevosDatos);
        setDatosOriginales(JSON.parse(JSON.stringify(nuevosDatos)));
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }, [datosModulo, quimestreSeleccionado, parcialSeleccionado]);

  const handleGuardar = (rowIndex, rowData) => {
    if (!rowData.idParcial) {
      Swal.fire({
        icon: "error",
        title: "Registro no encontrado",
        text: "No se puede actualizar porque aún no existe un registro para esta fila.",
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

    const comportamiento = columnasComportamiento.map((col) =>
      parseInt(rowData[col]) || 0
    );

    const body = {
      id_inscripcion: rowData.idInscripcion,
      insumo1: parseFloat(rowData["INSUMO 1"]),
      insumo2: parseFloat(rowData["INSUMO 2"]),
      evaluacion: parseFloat(rowData["EVALUACIÓN SUMATIVA"]),
      comportamiento,
      quimestre: obtenerEtiquetaQuimestre(),
      parcial: obtenerEtiquetaParcial(),
    };

    axios
      .put(`${import.meta.env.VITE_URL_DEL_BACKEND}/parciales/${rowData.idParcial}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Las calificaciones se actualizaron correctamente.",
        });
        const nuevaCopia = [...datosOriginales];
        nuevaCopia[rowIndex] = JSON.parse(JSON.stringify(rowData));
        setDatosOriginales(nuevaCopia);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar ❌.",
          text: "No se pudo actualizar la calificación.",
        });
        ErrorMessage(error);
      });
  };

  return (
    <div id={idContenedor} className="container tabla-parciales">
      <HeaderTabla datosEncabezado={datosEncabezado} imagenIzquierda={"/ConservatorioNacional.png"} />
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
      />
    </div>
  );
}

export default Parcial;