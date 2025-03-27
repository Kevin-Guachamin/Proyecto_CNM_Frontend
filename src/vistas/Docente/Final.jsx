import React, { useState, useEffect,useMemo } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import Swal from 'sweetalert2';

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
        quim1Data.map((est1) => {
          const est2 = quim2Data.find((e) => e.Nro === est1.Nro) || {};

          // Nota final de cada quimestre (de la columna "Promedio Final" en Quimestral)
          const quim1PF = parseFloat(est1["Promedio Final"]) || 0;
          const quim2PF = parseFloat(est2["Promedio Final"]) || 0;
          const promedioAnual = ((quim1PF + quim2PF) / 2).toFixed(2);

          // Promedio de comportamiento de cada quimestre
          const quim1PC = parseFloat(est1["Promedio Comportamiento"]) || 0;
          const quim2PC = parseFloat(est2["Promedio Comportamiento"]) || 0;
          const promedioComportamientoAnual = (quim1PC + quim2PC) / 2;
          const comportamiento = calcularValoracion(promedioComportamientoAnual);

          // Conservar valor previo del examen supletorio si ya se ingresó
          const existingRow = prevDatos.find((row) => row.Nro === est1.Nro) || {};
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
            ...est1,
            "Nro": est1.Nro,
            "Nómina de est1s": est1["Nómina de est1s"],
            "Primer Quimestre": quim1PF,
            "Segundo Quimestre": quim2PF,
            "Promedio Anual": pAnualNum,
            "Comportamiento": comportamiento,
            "Examen Supletorio": examenSupletorioPrev,
            "Promedio Final": promedioFinal,
            "Nivel": est1["Nivel"] || "",
            "Estado": estado,
          
            // Flags
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
      const pAnualStr = datos[rowIndex]["Promedio Anual"];
      const pAnualNum = typeof pAnualStr === "string"
        ? parseFloat(pAnualStr)
        : parseFloat(pAnualStr?.props?.children) || 0;
  
      // Si el promedio anual es menor a 4, no se permite supletorio
      if (pAnualNum < 4) {
        Swal.fire({
          icon: 'warning',
          title: 'Supletorio no permitido',
          text: 'El est1 tiene menos de 4.00 en el promedio anual y no puede rendir supletorio.',
          confirmButtonColor: '#3085d6',
        });
        return;
      }
  
      // Validar que sea un número válido entre 0.00 y 7.00 con hasta dos decimales
      const regexDecimal = /^\d{1,2}(\.\d{0,2})?$/;
      if (value !== "") {
        const esNumeroValido = regexDecimal.test(value.trim());
        const valorNumerico = parseFloat(value);
  
        if (!esNumeroValido || isNaN(valorNumerico) || valorNumerico < 0 || valorNumerico > 7) {
          Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'El valor debe estar entre 0.00 y 7.00 con máximo dos decimales.',
            confirmButtonColor: '#3085d6',
          });
          return;
        }
      }
    }
  
    setDatos((prevDatos) =>
      prevDatos.map((row, i) => {
        if (i === rowIndex) {
          let newRow = { ...row, [columnName]: value };
          if (columnName === "Examen Supletorio") {
            const pAnualStr = newRow["Promedio Anual"];
            const pAnualNum = typeof pAnualStr === "string"
              ? parseFloat(pAnualStr)
              : parseFloat(pAnualStr?.props?.children) || 0;
  
            let nuevoPromedioFinal;
  
            if (pAnualNum >= 7) {
              nuevoPromedioFinal = pAnualNum;
            } else {
              const examenVal = value !== "" ? parseFloat(value) : 0;
              nuevoPromedioFinal = examenVal > pAnualNum ? examenVal : pAnualNum;
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
  const datosConEstilos = useMemo(() => {
    return datos.map((row) => {
      const promedioAnual = row["Promedio Anual"]?.toFixed(2) || "0.00";
      const promedioFinal = row["Promedio Final"]?.toFixed(2) || "0.00";
      const primerQuimestre = row["Primer Quimestre"]?.toFixed(2) || "0.00";
      const segundoQuimestre = row["Segundo Quimestre"]?.toFixed(2) || "0.00";
  
      return {
        ...row,
        "Primer Quimestre": primerQuimestre,
        "Segundo Quimestre": segundoQuimestre,
        "Promedio Anual": row.promedioAnualRequeridoSupletorio
          ? <span style={{ color: "red" }}>{promedioAnual}</span>
          : promedioAnual,
        "Promedio Final": row.promedioFinalInsuficiente
          ? <span style={{ color: "red" }}>{promedioFinal}</span>
          : promedioFinal,
        "Estado":
          row["Estado"] === "Aprobado"
            ? <span style={{ backgroundColor: "green", color: "#fff", padding: "2px 4px" }}>Aprobado</span>
            : <span style={{ backgroundColor: "red", color: "#fff", padding: "2px 4px" }}>Reprobado</span>
      };
    });
  }, [datos]);  

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
        mostrarEliminar={false}
      />
    </div>
  );
};

export default Final;
