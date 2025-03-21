import React, { useState, useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";

const Final = ({ quim1Data, quim2Data, datosModulo }) => {
  const [datos, setDatos] = useState([]);

  const idContenedor = `pdf-final`;

  // Función para convertir el promedio de comportamiento en letra
  const calcularValoracion = (valor) => {
    if (valor >= 10) return "A";
    if (valor === 9) return "B";
    if (valor >= 7) return "C";
    if (valor >= 5) return "D";
    return "E";
  };

  // Combinar los datos de Quimestre 1 y 2
  useEffect(() => {
    if (quim1Data?.length > 0 && quim2Data?.length > 0) {
      setDatos((prevDatos) =>
        quim1Data.map((estudiante, index) => {
          const estudiante2 = quim2Data[index] || {};

          // Nota final de cada quimestre (de la columna "Promedio Final" en Quimestral)
          const quim1PF = parseFloat(estudiante["Promedio Final"]) || 0;
          const quim2PF = parseFloat(estudiante2["Promedio Final"]) || 0;
          const promedioAnual = ((quim1PF + quim2PF) / 2).toFixed(2);

          // Promedio de comportamiento de cada quimestre
          const quim1PC = parseFloat(estudiante["Promedio Comportamiento"]) || 0;
          const quim2PC = parseFloat(estudiante2["Promedio Comportamiento"]) || 0;
          const promedioComportamientoAnual = (quim1PC + quim2PC) / 2;
          const comportamiento = calcularValoracion(promedioComportamientoAnual);

          // Conservar valor previo del examen supletorio si ya se ingresó
          const existingRow = prevDatos.find((row) => row.Nro === estudiante.Nro) || {};
          const examenSupletorioPrev = existingRow["Examen Supletorio"] || "";

          // Cálculo del Promedio Final:
          //  1) Si Promedio Anual >= 7 => no se requiere supletorio, se mantiene igual.
          //  2) Si Promedio Anual < 7 => se revisa el supletorio:
          //       - Si supletorio es mayor que el promedioAnual => se usa supletorio
          //       - En caso contrario => se mantiene el promedioAnual
          let promedioFinal;
          const pAnualNum = parseFloat(promedioAnual);

          if (pAnualNum >= 7) {
            // No se requiere supletorio
            promedioFinal = pAnualNum;
          } else {
            if (examenSupletorioPrev !== "") {
              const examenVal = parseFloat(examenSupletorioPrev) || 0;
              if (examenVal > pAnualNum) {
                promedioFinal = examenVal;
              } else {
                promedioFinal = pAnualNum;
              }
            } else {
              promedioFinal = pAnualNum;
            }
          }

          const estado = promedioFinal >= 7 ? "Aprobado" : "Reprobado";

          return {
            ...estudiante,
            "Nro": estudiante.Nro,
            "Nómina de Estudiantes": estudiante["Nómina de Estudiantes"],
            "Primer Quimestre": quim1PF.toFixed(2),
            "Segundo Quimestre": quim2PF.toFixed(2),
            "Promedio Anual": promedioAnual,
            "Comportamiento": comportamiento,
            "Examen Supletorio": examenSupletorioPrev, // editable si < 7
            "Promedio Final": promedioFinal.toFixed(2),
            "Nivel": "", // Ajustar si lo requieres
            "Estado": estado,

            // Flags para estilos condicionales
            promedioAnualRequeridoSupletorio: pAnualNum < 7,
            promedioFinalInsuficiente: promedioFinal < 7,
          };
        })
      );
    }
  }, [quim1Data, quim2Data]);

  // Manejar cambios en la columna "Examen Supletorio"
  const handleInputChange = (rowIndex, columnName, value) => {
    if (columnName === "Examen Supletorio") {
      // Validar que sea un número válido entre 0.00 y 10.00
      if (
        value !== "" &&
        (!/^\d{0,2}(\.\d{0,2})?$/.test(value) || value > 10 || value < 0)
      ) {
        alert("Error: El valor debe estar entre 0.00 y 10.00 con máximo dos decimales.");
        return;
      }
    }

    setDatos((prevDatos) =>
      prevDatos.map((row, i) => {
        if (i === rowIndex) {
          let newRow = { ...row, [columnName]: value };
          if (columnName === "Examen Supletorio") {
            const pAnualNum = parseFloat(newRow["Promedio Anual"]) || 0;
            let nuevoPromedioFinal;

            if (pAnualNum >= 7) {
              // No se requiere supletorio
              nuevoPromedioFinal = pAnualNum;
            } else {
              const examenVal = value !== "" ? parseFloat(value) : 0;
              // Solo reemplaza si supletorio es mayor que promedio anual
              if (examenVal > pAnualNum) {
                nuevoPromedioFinal = examenVal;
              } else {
                nuevoPromedioFinal = pAnualNum;
              }
            }

            newRow["Promedio Final"] = nuevoPromedioFinal.toFixed(2);
            newRow["Estado"] = nuevoPromedioFinal >= 7 ? "Aprobado" : "Reprobado";
            newRow.promedioFinalInsuficiente = nuevoPromedioFinal < 7;
          }
          return newRow;
        }
        return row;
      })
    );
  };

  const determinarJornada = (horario) => {
    const horaInicio = horario.split("-")[0];
    const horaNumerica = parseInt(horaInicio.split(":")[0], 10);
    return horaNumerica < 12 ? "Matutina" : "Vespertina";
  };

  const datosEncabezado = {
    titulo: "CONSERVATORIO NACIONAL DE MUSICA",
    subtitulo: "ACTA DE RESUMEN FINAL",
    info: {
      "Profesor": datosModulo.docente,
      "Asignatura": datosModulo.materia,
      "Curso": datosModulo.año,
      "Paralelo": datosModulo.paralelo,
      "Año Lectivo": datosModulo.periodo,
      "Jornada": determinarJornada(datosModulo.horario)
    }
  };

  // Columnas
  const columnasAgrupadas = [
    { titulo: "", colspan: 2 },
    { titulo: "RESUMEN DE APRENDIZAJES", colspan: 6 },
    { titulo: "", colspan: 2 }
  ];

  const columnas = [
    "Primer Quimestre",
    "Segundo Quimestre",
    "Promedio Anual",
    "Comportamiento",
    "Examen Supletorio",
    "Promedio Final",
    "Nivel",
    "Estado"
  ];

  // Aplicamos estilos condicionales en la data
  const datosConEstilos = datos.map((row) => {
    // Promedio Anual en rojo si < 7
    let promedioAnualConEstilo = row.promedioAnualRequeridoSupletorio
      ? <span style={{ color: "red" }}>{row["Promedio Anual"]}</span>
      : row["Promedio Anual"];

    // Promedio Final en rojo si < 7 (o si no se ha ingresado supletorio y sigue <7)
    let promedioFinalConEstilo = row.promedioFinalInsuficiente
      ? <span style={{ color: "red" }}>{row["Promedio Final"]}</span>
      : row["Promedio Final"];

    // Estado con fondo verde si Aprobado, rojo si Reprobado
    let estadoConEstilo;
    if (row["Estado"] === "Aprobado") {
      estadoConEstilo = (
        <span style={{ backgroundColor: "green", color: "#fff", padding: "2px 4px" }}>
          Aprobado
        </span>
      );
    } else {
      estadoConEstilo = (
        <span style={{ backgroundColor: "red", color: "#fff", padding: "2px 4px" }}>
          Reprobado
        </span>
      );
    }

    return {
      ...row,
      "Promedio Anual": promedioAnualConEstilo,
      "Promedio Final": promedioFinalConEstilo,
      "Estado": estadoConEstilo,
    };
  });

  return (
    <div id={idContenedor} className="container tabla-final">
      <HeaderTabla
        datosEncabezado={datosEncabezado}
        imagenIzquierda={"/ConservatorioNacional.png"}
        imagenDerecha={"/Ministerio.png"}
      />
      <Tabla
        columnasAgrupadas={columnasAgrupadas}
        columnas={columnas}
        datos={datosConEstilos}
        onChange={handleInputChange}
        // Sólo la columna "Examen Supletorio" es editable
        columnasEditables={["Examen Supletorio"]}
      />
    </div>
  );
};

export default Final;
