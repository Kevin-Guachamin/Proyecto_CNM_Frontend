import React, { useState, useEffect, useMemo } from "react";
import HeaderTabla from "../../../components/HeaderTabla";
import Tabla from "../../../components/Tabla";
import Swal from 'sweetalert2';
import axios from "axios";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import "../Parcial.css";

const FinalBE = ({ quim1Data, quim2Data, datosModulo, actualizarDatosFinal, inputsDisabled, onEditar, isWithinRange, rangoTexto, forceEdit, soloLectura, escala }) => {
  const [datos, setDatos] = useState([]);

  const idContenedor = `pdf-final`;

  const convertirNota = (nota) => {
    const n = parseFloat(nota);
    if (isNaN(n) || n < 0 || n > 10) return "";

    if (escala === "cuantitativa" || escala === "1") {
      if (n >= 9) return "DA";
      if (n >= 7) return "AA";
      if (n > 4) return "PA";
      return "NA";
    }

    if (escala === "cualitativa" || escala === "2") {
      if (n >= 9.5) return "A+";
      if (n >= 9) return "A-";
      if (n >= 8.5) return "B+";
      if (n >= 7.5) return "B-";
      if (n >= 7) return "C+";
      if (n >= 6.5) return "C-";
      if (n >= 4) return "D+";
      if (n >= 3.5) return "D-";
      if (n >= 2) return "E+";
      return "E-";
    }

    return "";
  };

  // Combinar los datos de Quimestre 1 y 2
  useEffect(() => {
    if (!datosModulo?.ID) return;

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;

    axios.get(urlInscripciones)
      .then((respEstudiantes) => {
        const estudiantes = respEstudiantes.data;

        const nuevosDatos = estudiantes.map((est) => {
          const quim1 = quim1Data.find(
            (q) => q.id_inscripcion === est.idInscripcion
          ) || {};
          const quim2 = quim2Data.find(
            (q) => q.id_inscripcion === est.idInscripcion
          ) || {};

          const q1PF = parseFloat(quim1["Promedio Final"]) || 0;
          const q2PF = parseFloat(quim2["Promedio Final"]) || 0;
          const promedioAnual = (q1PF + q2PF) / 2;

          const estado = promedioAnual >= 7 ? "Aprobado" : promedioAnual >= 4 && promedioAnual < 7 ? "Supletorio" : "Reprobado";

          return {
            idInscripcion: est.idInscripcion,
            _primerQuimestre: q1PF,
            _segundoQuimestre: q2PF,
            _promedioAnual: promedioAnual,
            _promedioFinal: promedioAnual,
            promedioAnualRequeridoSupletorio: promedioAnual < 7,
            promedioFinalInsuficiente: promedioAnual < 7,
            examen_recuperacion: "", // se llenará cuando el usuario lo escriba
            Nro: est.nro,
            "Nómina de Estudiantes": est.nombre,
            "Primer Quimestre": q1PF,
            "Segundo Quimestre": q2PF,
            "Promedio Anual": promedioAnual,
            "Promedio Final": promedioAnual,
            "Estado": estado,
          };
        });

        setDatos(nuevosDatos);
      })
      .catch((err) => {
        ErrorMessage(err);
      });
  }, [datosModulo, quim1Data, quim2Data]);

  // Manejar cambios en la columna "Examen Supletorio"
  const handleInputChange = (rowIndex, columnName, value) => {
    // 1) Solo para la columna "Examen Supletorio"
    if (columnName === "Examen Supletorio") {
      // A) Tomamos la versión numérica pura
      const pAnualNum = datos[rowIndex]._promedioAnual || 0;
      // B) Validamos
      if (pAnualNum < 4) {
        Swal.fire({
          icon: 'warning',
          title: 'Supletorio no permitido',
          text: 'El estudiante tiene menos de 4.00 en el promedio anual y no puede rendir supletorio.',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      // C) Validar que sea un número de 0.00 a 7.00
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

    // 2) Luego, actualizas el estado “datos” igual que antes
    setDatos((prevDatos) =>
      prevDatos.map((row, i) => {
        if (i === rowIndex) {
          let newRow = { ...row, [columnName]: value };
          if (columnName === "Examen Supletorio") {
            const pAnualNum = row._promedioAnual || 0;
            let pFinal = pAnualNum;
            if (pAnualNum < 7 && value !== "") {
              const examenVal = parseFloat(value) || 0;
              pFinal = examenVal > pAnualNum ? examenVal : pAnualNum;
            }
            newRow._promedioFinal = pFinal;
            newRow["Promedio Final"] = pFinal;
            newRow["Estado"] = pFinal >= 7 ? "Aprobado" : pFinal >= 4 && pFinal < 7 ? "Supletorio" : "Reprobado";
            newRow.promedioFinalInsuficiente = pFinal < 7;
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
    subtitulo: "INFORME DE RENDIMIENTO ACADÉMICO ANUAL",
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
    { titulo: "RESUMEN DE APRENDIZAJES", colspan: escala === "cuantitativa" ? 6 : 5 },
    { titulo: "", colspan: 1 }
  ];

  const nombreColumnaExtra = escala === "cualitativa" ? "Cualitativa" : "Cuantitativa";
  const nombreColumnaExtra1 = escala === "cualitativa" ? "Cualitativa\u00A0" : "Cuantitativa\u00A0";
  const nombreColumnaExtra2 = escala === "cualitativa" ? "Cualitativa " : "Cuantitativa ";

  const columnas = [
    "Primer Quimestre", nombreColumnaExtra,
    "Segundo Quimestre", nombreColumnaExtra1,
    "Promedio Final", nombreColumnaExtra2,
    ...(escala === "cuantitativa" ? ["Estado"] : [])
  ];

  // Aplicamos estilos condicionales en la data
  const datosConEstilos = useMemo(() => {
    return datos.map((row) => {
      const primerQNum = parseFloat(row._primerQuimestre) || 0;
      const segundoQNum = parseFloat(row._segundoQuimestre) || 0;
      const pAnualNum = parseFloat(row._promedioAnual) || 0;
      const pFinalNum = parseFloat(row._promedioFinal) || 0;

      const primerQuimestreStr = primerQNum.toFixed(2);
      const segundoQuimestreStr = segundoQNum.toFixed(2);
      const promedioAnualStr = pAnualNum.toFixed(2);
      const promedioFinalStr = pFinalNum.toFixed(2);

      return {
        ...row,
        "Primer Quimestre": primerQuimestreStr,
        [nombreColumnaExtra]: convertirNota(primerQuimestreStr),

        "Segundo Quimestre": segundoQuimestreStr,
        [nombreColumnaExtra1]: convertirNota(segundoQuimestreStr),

        "Promedio Final": row.promedioFinalInsuficiente
          ? <span style={{ color: "red" }}>{promedioFinalStr}</span>
          : promedioFinalStr,
        [nombreColumnaExtra2]: convertirNota(promedioFinalStr),

        ...(escala === "cuantitativa" ? {
          "Estado":
            row["Estado"] === "Aprobado"
              ? <span style={{ backgroundColor: "green", color: "#fff", padding: "2px 4px" }}>Aprobado</span>
              : row["Estado"] === "Supletorio"
                ? <span style={{ backgroundColor: "orange", color: "#fff", padding: "2px 4px" }}>Supletorio</span>
                : <span style={{ backgroundColor: "red", color: "#fff", padding: "2px 4px" }}>Reprobado</span>
        } : {})
      };
    });
  }, [datos, escala]);

  const realmenteDeshabilitado = soloLectura || inputsDisabled || (!isWithinRange && !forceEdit);

  const handleGuardar = (rowIndex, rowData) => {
    // Aquí asumimos que ya existe el registro (como en los otros componentes)
    const original = datos[rowIndex];
    const haCambiado = JSON.stringify(rowData) !== JSON.stringify(original);

    if (!haCambiado) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No has realizado ningún cambio en esta fila.",
      });
      return;
    }

    const examen = parseFloat(rowData["Examen Supletorio"]);
    if (isNaN(examen) || examen < 0 || examen > 7) {
      Swal.fire({
        icon: "error",
        title: "Valor inválido",
        text: "La nota del examen supletorio debe estar entre 0.00 y 7.00.",
      });
      return;
    }

    const body = {
      id_inscripcion: rowData.idInscripcion,
      examen_recuperacion: examen,
    };

    axios
      .put(`${import.meta.env.VITE_URL_DEL_BACKEND}/finales/${rowData.idInscripcion}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "La nota del examen supletorio se actualizó correctamente.",
        });
        const nuevaCopia = [...datos];
        nuevaCopia[rowIndex] = JSON.parse(JSON.stringify(rowData));
        setDatos(nuevaCopia);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar ❌",
          text: "No se pudo actualizar el examen supletorio.",
        });
        ErrorMessage(error);
      });
  };

  return (
    <div id={idContenedor} className="container tabla-final">
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
        datos={datosConEstilos}
        onChange={handleInputChange}
        columnasEditables={[]} // Ninguna columna editable
        mostrarEditar={false} // 🔥 No mostrar botón editar
        mostrarGuardar={false} // 🔥 No mostrar botón guardar
        inputsDisabled={true} // o según tu lógica
        onEditar={null}
        onGuardar={null} rangoTexto={rangoTexto}
        isWithinRange={isWithinRange}
        globalEdit={forceEdit}
        soloLectura={soloLectura}

      />
    </div>
  );
};

export default FinalBE;