import React, { useState,useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import "./Parcial.css";

function Parcial({ quimestreSeleccionado, parcialSeleccionado, actualizarDatosParcial }) {
  
  // ID dinámico: pdf-parcial1-quim1, pdf-parcial2-quim1, pdf-parcial1-quim2, etc.
  const idContenedor = `pdf-parcial${parcialSeleccionado}-quim${quimestreSeleccionado}`;

  const subtitulo = `ACTA DE CALIFICACIONES ${parcialSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} PARCIAL - ${quimestreSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} QUIMESTRE`;

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MUSICA",
    subtitulo: subtitulo,
    info: {
      "Profesor": "Guachis",
      "Asignatura": "Instrumento",
      "Curso": "0",
      "Paralelo": "0",
      "Año Lectivo": "2024 - 2025",
      "Jornada": "Matutina"
    }
  };

  const columnasAgrupadas = [
    { titulo: "", colspan: 2 },
    { titulo: "Evaluación de Aprendizajes", colspan: 6 },
    { titulo: "Evaluación del Comportamiento", colspan: 13 },
  ];

  const columnas = [
    "INSUMO 1", "INSUMO 2", "PONDERACIÓN 70%", "EVALUACIÓN SUMATIVA", "PONDERACIÓN 30%", "PROMEDIO PARCIAL",
    "RESPETO Y \n CONSIDERACION", "VALORACION DE \n LA DIVERSIDAD", "CUMPLIMIENTO DE LAS \n NORMA DE CONVIVENCIA",
    "CUIDADO  DEL \n PATRIMONIO INSTITUCIONAL", "RESPETO A LA \n PROPIEDAD AJENA", "PUNTUALIDAD \n Y ASISTENCIA", "HONESTIDAD \n ",
    "PRESENTACION PERSONAL \n (LIMPIEZA Y UNIFORME)", "PARTICIPACION \n COMUNITARIA", "RESPONSABILIDAD \n ", "PROMEDIO COMPORTAMIENTO",
    "NIVEL", "VALORACION"
  ];

  const [datos, setDatos] = useState([
    {
      "Nro": 1, "Nómina de Estudiantes": "Estudiante 1", "INSUMO 1": "", "INSUMO 2": "", "PONDERACIÓN 70%": "", "EVALUACIÓN SUMATIVA": "", "PONDERACIÓN 30%": "", "PROMEDIO PARCIAL": "",
    "RESPETO Y \n CONSIDERACION": "", "VALORACION DE \n LA DIVERSIDAD": "", "CUMPLIMIENTO DE LAS \n NORMA DE CONVIVENCIA": "",
    "CUIDADO  DEL \n PATRIMONIO INSTITUCIONAL": "", "RESPETO A LA \n PROPIEDAD AJENA": "", "PUNTUALIDAD \n Y ASISTENCIA": "", "HONESTIDAD \n": "",
    "PRESENTACION PERSONAL \n (LIMPIEZA Y UNIFORME)": "", "PARTICIPACION \n COMUNITARIA": "", "RESPONSABILIDAD \n ": "", "PROMEDIO COMPORTAMIENTO": "",
    "NIVEL": "2BE", "VALORACION": ""
    }
  ]);

  // Definir qué columnas son editables en Parciales
  const columnasEditables = [
    "INSUMO 1", "INSUMO 2", "EVALUACIÓN SUMATIVA",
    "RESPETO Y \n CONSIDERACION", "VALORACION DE \n LA DIVERSIDAD", "CUMPLIMIENTO DE LAS \n NORMA DE CONVIVENCIA",
    "CUIDADO  DEL \n PATRIMONIO INSTITUCIONAL", "RESPETO A LA \n PROPIEDAD AJENA", "PUNTUALIDAD \n Y ASISTENCIA", "HONESTIDAD \n ",
    "PRESENTACION PERSONAL \n (LIMPIEZA Y UNIFORME)", "PARTICIPACION \n COMUNITARIA", "RESPONSABILIDAD \n "
  ];
  const columnasComportamiento = [
    "RESPETO Y \n CONSIDERACION", "VALORACION DE \n LA DIVERSIDAD", "CUMPLIMIENTO DE LAS \n NORMA DE CONVIVENCIA",
    "CUIDADO  DEL \n PATRIMONIO INSTITUCIONAL", "RESPETO A LA \n PROPIEDAD AJENA", "PUNTUALIDAD \n Y ASISTENCIA", "HONESTIDAD \n ",
    "PRESENTACION PERSONAL \n (LIMPIEZA Y UNIFORME)", "PARTICIPACION \n COMUNITARIA", "RESPONSABILIDAD \n "
  ];



  // Función para calcular la valoración según la suma total de comportamiento
  const calcularValoracion = (suma) => {
    if (suma >= 10) return "A";
    if (suma === 9) return "B";
    if (suma >= 7) return "C";
    if (suma >= 5) return "D";
    return "E";
  };

  // ✅ Nuevo: Enviar los datos al padre cuando cambian
  useEffect(() => {
    if (actualizarDatosParcial) {
      actualizarDatosParcial(datos);
    }
  }, [datos, actualizarDatosParcial]);

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
            alert("Error: El valor debe estar entre 0.00 y 10.00 con máximo dos decimales.");
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
            alert("Error: Solo se permite ingresar 0 o 1 en este campo.");
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

  return (
    <div id={idContenedor} className="container tabla-parciales">
      <HeaderTabla datosEncabezado={datosEncabezado} imagenIzquierda={"/ConservatorioNacional.png"} />
      <Tabla
        columnasAgrupadas={columnasAgrupadas}
        columnas={["Nro", "Nómina de Estudiantes", ...columnas]}
        datos={datos}
        onChange={handleInputChange}
        columnasEditables={columnasEditables}
      />
    </div>
  );
}

export default Parcial;
