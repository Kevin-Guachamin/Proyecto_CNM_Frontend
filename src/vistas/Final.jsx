import React from "react";
import HeaderTabla from "../components/HeaderTabla";
import Tabla from "../components/Tabla";

const Final = () => {
  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MUSICA",
    subtitulo: "ACTA FINAL",
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
    { titulo: "RESUMEN DE APRENDIZAJES", colspan: 6 },
    { titulo: "", colspan: 1 }
  ];

  const columnas = [
    "Primer Quimestre", "Segundo Quimestre",
    "Promedio Anual", "Comportamiento", "Examen Supletorio",
    "Promedio Final", "Nivel"
  ];

  const datos = [];

  return (
    <div className="container">
      <HeaderTabla datosEncabezado={datosEncabezado} imagenIzquierda={"/ConservatorioNacional.png"} imagenDerecha={"/Ministerio.png"} />
      <Tabla columnasAgrupadas={columnasAgrupadas} columnas={["Nro", "Nómina de Estudiantes", ...columnas]} datos={datos} />
    </div>
  );
};

export default Final;