import React, { useState, useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";

const Quimestral = ({ quimestreSeleccionado, parcial1Data, parcial2Data,  actualizarDatosQuim  }) => {
  
  const idContenedor = `pdf-quimestral-quim${quimestreSeleccionado}`;

  // Estado que contendrá los datos combinados (por estudiante) provenientes de los parciales
  const [datos, setDatos] = useState([]);

  // Función para calcular la valoración (para comportamiento) según la suma total
  const calcularValoracion = (valor) => {
    if (valor >= 10) return "A";
    if (valor === 9) return "B";
    if (valor >= 7) return "C";
    if (valor >= 5) return "D";
    return "E";
  };

  // Cada vez que lleguen datos de ambos parciales, se combinan
  useEffect(() => {
    if (parcial1Data?.length > 0 && parcial2Data?.length > 0) {
      setDatos((prevDatos) => {
        const newCombinedData = parcial1Data.map((estudiante1, index) => {
          const estudiante2 = parcial2Data[index] || {};
          const existingRow = prevDatos.find((row) => row.Nro === estudiante1.Nro) || {};
          const examenPrevio = existingRow["Examen"] || "";
  
          // Utilizamos el nombre correcto para el promedio académico
          const parcial1 = parseFloat(estudiante1["PROMEDIO PARCIAL"]) || 0;
          const parcial2 = parseFloat(estudiante2["PROMEDIO PARCIAL"]) || 0;
          const promedioAcademico = (parcial1 + parcial2) / 2;
          const ponderacion70 = promedioAcademico * 0.7;
  
          const notaExamen = examenPrevio;
          const ponderacion30 = notaExamen === "" ? 0 : parseFloat(notaExamen) * 0.3;
          const promedioFinal = ponderacion70 + ponderacion30;
  
          // Para el comportamiento, usamos la propiedad "PROMEDIO COMPORTAMIENTO"
          const comportamiento1 = parseFloat(estudiante1["PROMEDIO COMPORTAMIENTO"]) || 0;
          const comportamiento2 = parseFloat(estudiante2["PROMEDIO COMPORTAMIENTO"]) || 0;
          const promedioComportamientoRaw = (comportamiento1 + comportamiento2) / 2;
          const promedioComportamiento = Math.ceil(promedioComportamientoRaw);
          const comportamientoFinal = calcularValoracion(promedioComportamiento);
  
          return {
            ...estudiante1,
            "Nro": estudiante1.Nro,
            "Nómina de Estudiantes": estudiante1["Nómina de Estudiantes"],
            "Primer Parcial": parcial1.toFixed(2),
            "Segundo Parcial": parcial2.toFixed(2),
            "Ponderación 70%": ponderacion70.toFixed(2),
            "Examen": notaExamen,
            "Ponderación 30%": ponderacion30.toFixed(2),
            "Promedio Final": promedioFinal.toFixed(2),
            "Promedio Comportamiento": promedioComportamiento,
            "Nivel": "",
            "Comportamiento Final": comportamientoFinal,
          };
        });
  
        setTimeout(() => {
          if (typeof actualizarDatosQuim === "function") {
            actualizarDatosQuim(newCombinedData);
          }
        }, 0);
  
        return newCombinedData;
      });
    }
  }, [parcial1Data, parcial2Data, actualizarDatosQuim]);
     

  // Función para manejar cambios en los inputs de la tabla (en este caso, solo para la columna "Examen")
  const handleInputChange = (rowIndex, columnName, value) => {
    const nuevosDatos = datos.map((fila, i) => {
      if (i === rowIndex) {
        let nuevaFila = { ...fila };

        if (columnName === "Examen") {
          if (value === "") {
            nuevaFila["Examen"] = "";
          } else if (!/^\d{0,2}(\.\d{0,2})?$/.test(value) || value > 10 || value < 0) {
            alert("Error: El valor debe estar entre 0.00 y 10.00 con máximo dos decimales.");
            return fila;
          } else {
            nuevaFila["Examen"] = value;
          }
        }

        // Recalcular la ponderación del examen y el promedio final
        const notaExamen = parseFloat(nuevaFila["Examen"]) || 0;
        const ponderacion30 = notaExamen * 0.3;
        const ponderacion70 = parseFloat(nuevaFila["Ponderación 70%"]) || 0;
        const promedioFinal = ponderacion70 + ponderacion30;

        nuevaFila["Ponderación 30%"] = ponderacion30.toFixed(2);
        nuevaFila["Promedio Final"] = promedioFinal.toFixed(2);

        return nuevaFila;
      }
      return fila;
    });
    setDatos(nuevosDatos);
  };

  const subtitulo = `ACTA DE RESUMEN DEL ${quimestreSeleccionado === "1" ? "PRIMER" : "SEGUNDO"} QUIMESTRE`;

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
    { titulo: "RESUMEN DE APRENDIZAJES Y COMPORTAMIENTO", colspan: 9 },
  ];

  const columnas = [
    "Primer Parcial", "Segundo Parcial", "Ponderación 70%",
    "Examen", "Ponderación 30%", "Promedio Final", "Promedio Comportamiento", "Nivel", "Comportamiento Final"
  ];

  // Indicamos que la columna "Examen" es editable, similar a como se hace en el componente de Parcial
  const columnasEditables = ["Examen"];

  return (
    <div id={idContenedor} className="container tabla-quimestral">
      <HeaderTabla
        datosEncabezado={datosEncabezado}
        imagenIzquierda={"/ConservatorioNacional.png"}
        imagenDerecha={"/Ministerio.png"}
      />
      <Tabla
        columnasAgrupadas={columnasAgrupadas}
        columnas={columnas}
        datos={datos}
        onChange={handleInputChange}
        columnasEditables={columnasEditables}
      />
    </div>
  );
};

export default Quimestral;
