import React, { useState, useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import Swal from 'sweetalert2';
import "./Parcial.css";

function Parcial({ quimestreSeleccionado, parcialSeleccionado, actualizarDatosParcial, datosModulo, inputsDisabled }) {

  // ID dinámico: pdf-parcial1-quim1, pdf-parcial2-quim1, pdf-parcial1-quim2, etc.
  const idContenedor = `pdf-parcial${parcialSeleccionado}-quim${quimestreSeleccionado}`;

  const subtitulo = `ACTA DE CALIFICACIONES ${parcialSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} PARCIAL - ${quimestreSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} QUIMESTRE`;

  // ⬇️ Aquí implementamos la función para determinar la jornada
  const determinarJornada = (horario) => {
    const horaInicio = horario.split("-")[0];
    const horaNumerica = parseInt(horaInicio.split(":")[0], 10);
    return horaNumerica < 12 ? "Matutina" : "Vespertina";
  };
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

  const abreviarNivel = (nivel) => {
    if (!nivel || typeof nivel !== "string") return "";

    const partes = nivel.split(" ");
    if (partes.length < 2) return "";

    const grado = partes[0][0]; // Ej. "1ro" => "1"

    if (nivel.includes("Bachillerato")) return `${grado}BCH`;
    if (nivel.includes("Básico Elemental")) return `${grado}BE`;
    if (nivel.includes("Básico Medio")) return `${grado}BM`;
    if (nivel.includes("Básico Superior")) return `${grado}BS`;

    return ""; // Por defecto si no matchea nada
  };

  // Función para calcular la valoración según la suma total de comportamiento
  const calcularValoracion = (valor) => {
    // 1) Truncar el valor (9.4 => 9)
    const truncado = Math.floor(valor);
  
    // 2) Asignar la letra en función del entero
    if (truncado === 10) return "A";
    if (truncado === 9)  return "B";
    if (truncado >= 7)  return "C"; // Esto abarca 7 y 8
    if (truncado >= 5)  return "D"; // Esto abarca 5 y 6
    return "E";                     // Menos de 5
  };
  
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
  

  // ✅ Nuevo useEffect que envía datos transformados al padre
  useEffect(() => {
    // ✅ Nos aseguramos de que ya haya datos con cálculos listos
    if (!datos || datos.length === 0) return;
  
    const datosCompletos = datos.filter(fila => fila["PROMEDIO PARCIAL"] !== undefined);
  
    if (actualizarDatosParcial && datosCompletos.length > 0) {
      const datosTransformados = transformarDatosParaGuardar(datos);
      actualizarDatosParcial(datosTransformados);
      console.log(`🚀 Datos enviados desde Parcial ${parcialSeleccionado} - Quimestre ${quimestreSeleccionado}:`, datosTransformados);
    }
  }, [datos, actualizarDatosParcial, quimestreSeleccionado, parcialSeleccionado]);
  

  // Manejar cambios en los inputs de la tabla
  const handleInputChange = (rowIndex, columnName, value) => {
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
        const sumaComportamiento = columnasComportamiento.reduce(
          (acc, col) => acc + (parseInt(nuevaFila[col]) || 0),
          0
        );

        // Cálculo automático de los promedios académicos
        const insumo1 = parseFloat(nuevaFila["INSUMO 1"]) || 0;
        const insumo2 = parseFloat(nuevaFila["INSUMO 2"]) || 0;
        const evaluacion = parseFloat(nuevaFila["EVALUACIÓN SUMATIVA"]) || 0;

        const ponderacion70 = ((insumo1 + insumo2) / 2) * 0.7;
        const ponderacion30 = evaluacion * 0.3;
        const promedioParcial = ponderacion70 + ponderacion30;

        // Actualizar los valores en la fila
        return {
          ...nuevaFila,
          "PONDERACIÓN 70%": ponderacion70.toFixed(2),
          "PONDERACIÓN 30%": ponderacion30.toFixed(2),
          "PROMEDIO PARCIAL": promedioParcial.toFixed(2),
          "PROMEDIO COMPORTAMIENTO": sumaComportamiento, // Para la sección de comportamiento
          "VALORACION": calcularValoracion(sumaComportamiento),
        };
      }
      return fila;
    });

    setDatos(nuevosDatos);
  };

  const safe = (val) => (val === 0 || val === "0") ? "0" : (val !== undefined && val !== null ? val : "");

  const calcularDatosFila = (fila) => {
    const insumo1 = parseFloat(fila["INSUMO 1"]) || 0;
    const insumo2 = parseFloat(fila["INSUMO 2"]) || 0;
    const evaluacion = parseFloat(fila["EVALUACIÓN SUMATIVA"]) || 0;
  
    const ponderacion70 = ((insumo1 + insumo2) / 2) * 0.7;
    const ponderacion30 = evaluacion * 0.3;
    const promedioParcial = ponderacion70 + ponderacion30;
  
    const sumaComportamiento = columnasComportamiento.reduce(
      (acc, col) => acc + (parseInt(fila[col]) || 0),
      0
    );
  
    return {
      ...fila,
      "PONDERACIÓN 70%": ponderacion70.toFixed(2),
      "PONDERACIÓN 30%": ponderacion30.toFixed(2),
      "PROMEDIO PARCIAL": promedioParcial.toFixed(2),
      "PROMEDIO COMPORTAMIENTO": sumaComportamiento,
      "VALORACION": calcularValoracion(sumaComportamiento),
    };
  };
  
  useEffect(() => {
    if (!datosModulo?.ID) return;

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
      })
      .catch((error) => {
        console.error("❌ Error al cargar datos combinados:", error);
        ErrorMessage(error);
      });
    }, [datosModulo, quimestreSeleccionado, parcialSeleccionado]);  

  return (
    <div id={idContenedor} className="container tabla-parciales">
      <HeaderTabla datosEncabezado={datosEncabezado} imagenIzquierda={"/ConservatorioNacional.png"} />
      <Tabla
        columnasAgrupadas={columnasAgrupadas}
        columnas={columnas}
        datos={datos}
        onChange={handleInputChange}
        columnasEditables={columnasEditables}
        inputsDisabled={inputsDisabled}
      />
    </div>
  );
}

export default Parcial;