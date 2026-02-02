import React, { useState, useEffect, useMemo } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import Swal from 'sweetalert2';
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import { calcularPromedioAnual, calcularPromedioComportamientoFinal, calcularPromedioFinalConSupletorio, determinarEstado, calcularValoracionComportamiento, abreviarNivel } from "./Promedios";
import "./Parcial.css";

const Final = ({ quim1Data, quim2Data, datosModulo, actualizarDatosFinal, inputsDisabled, onEditar, isWithinRange, rangoTexto, forceEdit, soloLectura, esPorSolicitud, savedKeysFinal, makeKeyFinal }) => {
  const [datos, setDatos] = useState([]);

  const idContenedor = `pdf-final`;

  const transformarDatosFinalParaGuardar = (datos) => {
    return datos.map((fila) => {
      return {
        id_inscripcion: fila.idInscripcion, // 👈 cambia la clave a minúscula y con guión bajo      
        examen_recuperacion: parseFloat(fila["Examen Supletorio"]) || 0,
        _promedioAnual: fila._promedioAnual,
      };
    });
  };

  const [datosOriginales, setDatosOriginales] = useState([]);

  // Combinar los datos de Quimestre 1 y 2
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    const esGrupoIndividual = datosModulo?.asignaciones && datosModulo.asignaciones.length > 0;

    if (esGrupoIndividual) {
      // Cargar datos de todas las asignaciones del grupo
      const promesasAsignaciones = datosModulo.asignaciones.map(asignacion => {
        const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${asignacion.ID}`;
        const urlFinales = `${import.meta.env.VITE_URL_DEL_BACKEND}/finales/asignacion/${asignacion.ID}`;
        return Promise.all([axios.get(urlInscripciones), axios.get(urlFinales)])
          .then(([respEstudiantes, respFinales]) => ({
            asignacion,
            estudiantes: respEstudiantes.data,
            finales: respFinales.data
          }));
      });

      Promise.all(promesasAsignaciones)
        .then(resultados => {
          let nroGlobal = 1;
          const todosLosDatos = [];

          resultados.forEach(({ asignacion, estudiantes, finales }) => {
            estudiantes.forEach(est => {
              const finalGuardado = finales.find(
                (f) => f.idInscripcion === est.idInscripcion
              ) || {};

              const quim1 = quim1Data.find(
                (q) => q.id_inscripcion === est.idInscripcion
              ) || {};
              const quim2 = quim2Data.find(
                (q) => q.id_inscripcion === est.idInscripcion
              ) || {};

              const q1PF = parseFloat(quim1["Promedio Completo"]) || 0;
              const q2PF = parseFloat(quim2["Promedio Completo"]) || 0;
              const promedioAnual = calcularPromedioAnual(q1PF, q2PF);
              const q1PC = parseFloat(quim1["Promedio Comportamiento Completo"]) || 0;
              const q2PC = parseFloat(quim2["Promedio Comportamiento Completo"]) || 0;

              const promedioComportamiento = calcularPromedioComportamientoFinal(q1PC, q2PC);
              const comportamiento = calcularValoracionComportamiento(promedioComportamiento);

              const examenSupletorio = finalGuardado.examen_recuperacion ?? "";
              const pFinal = calcularPromedioFinalConSupletorio(promedioAnual, examenSupletorio);
              const estado = determinarEstado(pFinal);

              todosLosDatos.push({
                idInscripcion: est.idInscripcion,
                idFinal: finalGuardado.id,
                idAsignacion: asignacion.ID,
                _primerQuimestre: q1PF,
                _segundoQuimestre: q2PF,
                _promedioAnual: promedioAnual,
                _promedioFinal: pFinal,
                promedioAnualRequeridoSupletorio: promedioAnual < 7,
                promedioFinalInsuficiente: pFinal < 7,
                Nro: nroGlobal++,
                "Nómina de Estudiantes": est.nombre,
                "Primer Quimestre": q1PF,
                "Segundo Quimestre": q2PF,
                "Promedio Anual": promedioAnual,
                "Comportamiento": comportamiento,
                "Examen Supletorio": examenSupletorio,
                "Promedio Final": pFinal,
                "Nivel": abreviarNivel(est.nivel),
                "Estado": estado,
              });
            });
          });

          setDatos(todosLosDatos);
          setDatosOriginales(JSON.parse(JSON.stringify(todosLosDatos)));
        })
        .catch((err) => {
          ErrorMessage(err);
        });
    } else if (datosModulo?.ID) {
      // Lógica original para materias grupales
      const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;
      const urlFinales = `${import.meta.env.VITE_URL_DEL_BACKEND}/finales/asignacion/${datosModulo.ID}`;

      Promise.all([axios.get(urlInscripciones), axios.get(urlFinales)])
        .then(([respEstudiantes, respFinales]) => {
          const estudiantes = respEstudiantes.data;
          const finales = respFinales.data;

          const nuevosDatos = estudiantes.map((est) => {
            const finalGuardado = finales.find(
              (f) => f.idInscripcion === est.idInscripcion
            ) || {};

            const quim1 = quim1Data.find(
              (q) => q.id_inscripcion === est.idInscripcion
            ) || {};
            const quim2 = quim2Data.find(
              (q) => q.id_inscripcion === est.idInscripcion
            ) || {};

            const q1PF = parseFloat(quim1["Promedio Completo"]) || 0;
            const q2PF = parseFloat(quim2["Promedio Completo"]) || 0;
            const promedioAnual = calcularPromedioAnual(q1PF, q2PF);
            const q1PC = parseFloat(quim1["Promedio Comportamiento Completo"]) || 0;
            const q2PC = parseFloat(quim2["Promedio Comportamiento Completo"]) || 0;

            const promedioComportamiento = calcularPromedioComportamientoFinal(q1PC, q2PC);
            const comportamiento = calcularValoracionComportamiento(promedioComportamiento);

            const examenSupletorio = finalGuardado.examen_recuperacion ?? "";
            const pFinal = calcularPromedioFinalConSupletorio(promedioAnual, examenSupletorio);
            const estado = determinarEstado(pFinal);

            return {
              idInscripcion: est.idInscripcion,
              idFinal: finalGuardado.id,
              _primerQuimestre: q1PF,
              _segundoQuimestre: q2PF,
              _promedioAnual: promedioAnual,
              _promedioFinal: pFinal,
              promedioAnualRequeridoSupletorio: promedioAnual < 7,
              promedioFinalInsuficiente: pFinal < 7,
              Nro: est.nro,
              "Nómina de Estudiantes": est.nombre,
              "Primer Quimestre": q1PF,
              "Segundo Quimestre": q2PF,
              "Promedio Anual": promedioAnual,
              "Comportamiento": comportamiento,
              "Examen Supletorio": examenSupletorio,
              "Promedio Final": pFinal,
              "Nivel": abreviarNivel(est.nivel),
              "Estado": estado,
            };
          });

          setDatos(nuevosDatos);
          setDatosOriginales(JSON.parse(JSON.stringify(nuevosDatos)));
        })
        .catch((err) => {
          ErrorMessage(err);
        });
    }
  }, [datosModulo, quim1Data, quim2Data]);

  useEffect(() => {
    if (datos.length === 0) return;

    if (typeof actualizarDatosFinal === "function") {
      const datosTransformados = transformarDatosFinalParaGuardar(datos);
      actualizarDatosFinal(datosTransformados);
    }
  }, [datos, actualizarDatosFinal]);

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
            const pFinal = calcularPromedioFinalConSupletorio(pAnualNum, value);
            newRow._promedioFinal = pFinal;
            newRow["Promedio Final"] = pFinal;
            newRow["Estado"] = determinarEstado(pFinal);

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
      "Profesor": datosModulo.docente || (datosModulo.asignaciones?.[0]?.docente),
      "Asignatura": datosModulo.materia || datosModulo.nombreMateria,
      "Curso": datosModulo.asignaciones ? `Niveles ${datosModulo.tipoNivel}` : datosModulo.año,
      "Paralelo": datosModulo.asignaciones ? "Múltiples" : datosModulo.paralelo,
      "Año Lectivo": datosModulo.periodo || (datosModulo.asignaciones?.[0]?.periodo),
      "Jornada": datosModulo.horario ? determinarJornada(datosModulo.horario) : (datosModulo.asignaciones?.[0]?.horario ? determinarJornada(datosModulo.asignaciones[0].horario) : "")
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
      // Tomar valores numéricos de las props internas
      const primerQNum = parseFloat(row._primerQuimestre) || 0;
      const segundoQNum = parseFloat(row._segundoQuimestre) || 0;
      const pAnualNum = parseFloat(row._promedioAnual) || 0;
      const pFinalNum = parseFloat(row._promedioFinal) || 0;

      // Convertir a string con 2 decimales
      const primerQuimestreStr = primerQNum.toFixed(2);
      const segundoQuimestreStr = segundoQNum.toFixed(2);
      const promedioAnualStr = pAnualNum.toFixed(2);
      const promedioFinalStr = pFinalNum.toFixed(2);

      return {
        ...row,
        "Primer Quimestre": primerQuimestreStr,
        "Segundo Quimestre": segundoQuimestreStr,
        "Promedio Anual": row.promedioAnualRequeridoSupletorio
          ? <span style={{ color: "red" }}>{promedioAnualStr}</span>
          : promedioAnualStr,
        "Promedio Final": row.promedioFinalInsuficiente
          ? <span style={{ color: "red" }}>{promedioFinalStr}</span>
          : promedioFinalStr,
        "Estado":
          row["Estado"] === "Aprobado" ? (
            <span style={{ backgroundColor: "green", color: "#fff", padding: "2px 4px" }}>Aprobado</span>
          ) : row["Estado"] === "Supletorio" ? (
            <span style={{ backgroundColor: "yellow", color: "#000", padding: "2px 4px" }}>Supletorio</span>
          ) : (
            <span style={{ backgroundColor: "red", color: "#fff", padding: "2px 4px" }}>Reprobado</span>
          )
      };
    });
  }, [datos]);

  // Función que determina si una fila específica está deshabilitada
  const esFilaDeshabilitada = (row) => {
    // Si es soloLectura, siempre deshabilitado
    if (soloLectura) return true;
    
    // Si la fila está guardada (tiene idFinal), está deshabilitada
    // INCLUSO si forceEdit está activo (botón amarillo presionado)
    if (savedKeysFinal && row.idInscripcion) {
      const rowKey = `${row.idInscripcion}`;
      if (savedKeysFinal.has(rowKey)) {
        return true;
      }
    }
    
    // Si forceEdit está activo, las NO guardadas están habilitadas
    if (forceEdit) return false;
    
    // Si estamos fuera de rango, deshabilitado
    if (!isWithinRange) return true;
    
    // Si inputsDisabled es true, deshabilitado
    return inputsDisabled;
  };

  const handleGuardar = (rowIndex, rowData) => {
    const original = datosOriginales[rowIndex];
    const haCambiado =
      parseFloat(rowData["Examen Supletorio"] || 0).toFixed(2) !==
      parseFloat(original["Examen Supletorio"] || 0).toFixed(2);

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
      .put(`${import.meta.env.VITE_URL_DEL_BACKEND}/finales/${rowData.idFinal}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "La nota del examen supletorio se actualizó correctamente.",
        });

        // 👉 Recalcular estado y promedio
        const promedioFinalRecalculado = calcularPromedioFinalConSupletorio(rowData._promedioAnual, examen);
        const estadoFinal = determinarEstado(promedioFinalRecalculado);

        const nuevaCopia = [...datos];
        nuevaCopia[rowIndex] = {
          ...rowData,
          "Examen Supletorio": examen.toFixed(2),
          _promedioFinal: promedioFinalRecalculado,
          "Promedio Final": promedioFinalRecalculado.toFixed(2),
          "Estado": estadoFinal,
        };
        setDatos(nuevaCopia);

        const nuevosOriginales = [...datosOriginales];
        nuevosOriginales[rowIndex] = {
          ...rowData,
          "Examen Supletorio": examen.toFixed(2),
          _promedioFinal: promedioFinalRecalculado,
          "Promedio Final": promedioFinalRecalculado.toFixed(2),
          "Estado": estadoFinal,
        };
        setDatosOriginales(nuevosOriginales);
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
        // Sólo la columna "Examen Supletorio" es editable
        columnasEditables={["Examen Supletorio"]}
        inputsDisabled={inputsDisabled}
        onEditar={onEditar}
        onGuardar={handleGuardar}
        rangoTexto={rangoTexto}
        isWithinRange={isWithinRange}
        globalEdit={forceEdit}
        soloLectura={soloLectura}
        esPorSolicitud={esPorSolicitud}
        esFilaDeshabilitada={esFilaDeshabilitada}
      />
    </div>
  );
};

export default Final;