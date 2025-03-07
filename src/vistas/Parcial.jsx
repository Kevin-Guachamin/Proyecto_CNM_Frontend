import React from "react";
import HeaderTabla from "../components/HeaderTabla";
import Tabla from "../components/Tabla";

function Parcial({ quimestreSeleccionado, parcialSeleccionado }) {
  console.log("quimestreSeleccionado:", quimestreSeleccionado); // Debugging
  console.log("parcialSeleccionado:", parcialSeleccionado); // Debugging

  // Generar el subtítulo dinámico correctamente
  const subtitulo = `ACTA DE CALIFICACIONES ${parcialSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} PARCIAL - ${quimestreSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} QUIMESTRE`;

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MUSICA",  // Título fijo
    subtitulo: subtitulo,  // Subtítulo dinámico corregido
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
    { titulo: "", colspan: 1 },
    { titulo: "", colspan: 1 },
    { titulo: "Evaluación de Aprendizajes", colspan: 6 },
    { titulo: "Evaluación del Comportamiento", colspan: 13 },
  ];

  const columnas = [
    "INSUMO 1", "INSUMO 2", "Ponderación 70%", "Evaluación Sumativa", "Ponderación 30%", "Promedio Parcial",
    "RESPETO Y CONSIDERACION", "VALORACION DE LA DIVERSIDAD", "CUMPLIMIENTO DE LAS NORMA DE CONVIVENCIA",
    "CUIDADO  DEL PATRIMONIO INSTITUCIONAL", "RESPETO A LA PROPIEDAD AJENA", "PUNTUALIDAD Y  ASISTENCIA", "HONESTIDAD",
    "PRESENTACION PERSONAL  (LIMPIEZA Y UNIFORME)", "PARTICIPACION COMUNITARIA", "RESPONSABILIDAD", "PROMEDIO PARCIAL",
    "NIVEL","VALORACION"
  ];

  const datos = [
    { "Nro": 1, "Nómina de Estudiantes": "Estudiante 1", "INSUMO 1": 7, "INSUMO 2": 7, 
      "Evaluación Sumativa": 4.9, "Ponderación 70%": 7, "Evaluación": 7, 
      "Ponderación 30%": 2.10, "Promedio Parcial": 7.00,
      "Conservación Materiales": 1, "Cuidado Espacios": 1, "Uso Herramientas": 1,
      "Comunicación": 1, "Organización": 1, "Trabajo Individual": 1, "Trabajo Cooperativo": 1,
      "Iniciativa": 1, "Liderazgo": 1, "Puntualidad": 0, "Responsabilidad": 1,
      "Respeto Normas": 1, "Promedio Parcial Comportamiento": 9, "Nivel": "2 BE", "Valoración": "B"
    },
    { "Nro": 2, "Nómina de Estudiantes": "Estudiante 2", "INSUMO 1": 8, "INSUMO 2": 8, 
      "Evaluación Sumativa": 5.2, "Ponderación 70%": 8, "Evaluación": 8, 
      "Ponderación 30%": 2.40, "Promedio Parcial": 8.00,
      "Conservación Materiales": 1, "Cuidado Espacios": 1, "Uso Herramientas": 1,
      "Comunicación": 1, "Organización": 1, "Trabajo Individual": 0, "Trabajo Cooperativo": 0,
      "Iniciativa": 1, "Liderazgo": 1, "Puntualidad": 1, "Responsabilidad": 0,
      "Respeto Normas": 0, "Promedio Parcial Comportamiento": 8, "Nivel": "C", "Valoración": "D"
    }
  ];

  return (
    <div className="container">
      <HeaderTabla datosEncabezado={datosEncabezado} imagenIzquierda={"/ConservatorioNacional.png"} />
      <Tabla columnasAgrupadas={columnasAgrupadas} columnas={["Nro", "Nómina de Estudiantes", ...columnas]} datos={datos} />
    </div>
  );
}

export default Parcial;
