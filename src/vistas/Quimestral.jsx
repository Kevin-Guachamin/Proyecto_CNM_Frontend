import React from "react";
import HeaderTabla from "../components/HeaderTabla";
import Tabla from "../components/Tabla";

const Quimestral = () => {
  const datosEncabezado = {
    titulo: "ACTA DE RESUMEN DEL PRIMER QUIMESTRE",
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
    { titulo: "RESUMEN DE APRENDIZAJES", colspan: 9 },
  ];

  const columnas = [
    "Primer Parcial", "Segundo Parcial", "Ponderación 70%",
    "Examen", "Ponderación 30%","Promedio Final", "Promedio Comportamiento","Nivel", "Comportamiento Final"
  ];

  const datos = [
    { "Nro": 1, "Nómina de Estudiantes": "Estudiante 1", "Primer Parcial": 7.0, "Segundo Parcial": 8.49, 
      "Examen": 5.42, "Promedio Final": 7.82, "Nivel": "B", "Comportamiento": "E" }
  ];

  return (
    <div className="container">
      <HeaderTabla datosEncabezado={datosEncabezado} imagenIzquierda={"/ConservatorioNacional.png"} imagenDerecha={"/Ministerio.png"} />      <Tabla columnasAgrupadas={columnasAgrupadas} columnas={["Nro", "Nómina de Estudiantes", ...columnas]} datos={datos} />
    </div>
  );
};

export default Quimestral;
