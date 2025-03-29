import React, { useState, useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import Swal from 'sweetalert2';
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import "./Parcial.css";

const Quimestral = ({ quimestreSeleccionado, parcial1Data, parcial2Data, actualizarDatosQuim, datosModulo,inputsDisabled }) => {

  const idContenedor = `pdf-quimestral-quim${quimestreSeleccionado}`;

  // Estado que contendrá los datos combinados (por estudiante) provenientes de los parciales
  const [datos, setDatos] = useState([]);

  // Función para calcular la valoración (para comportamiento) según la suma total
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
  
  const obtenerEtiquetaQuimestre = () => {
    return quimestreSeleccionado === "1" ? "Q1" : "Q2";
  };

  function parseCampoNumerico(valor) {
    if (typeof valor === "string" && valor.trim() === "") {
      return null; // vacío
    }
    const parsed = parseFloat(valor);
    return isNaN(parsed) ? null : parsed;
  }
  
  const transformarDatosQuimestralParaGuardar = (datos) => {
    return datos.map((fila) => {
      return {
        id_inscripcion: fila.idInscripcion, // 👈 ojo con la nomenclatura
      examen: parseCampoNumerico(fila["Examen"]),
      quimestre: obtenerEtiquetaQuimestre(),
      "Promedio Completo": parseCampoNumerico(fila["Promedio Final"]),
      "Promedio Comportamiento Completo": parseCampoNumerico(fila["Promedio Comportamiento"])
      };
    });
  };

  // Cada vez que lleguen datos de ambos parciales, se combinan
  useEffect(() => {
    if (!datosModulo?.ID) return;
  
    const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;
    const urlQuimestrales = `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestrales/asignacion/${datosModulo.ID}`;
  
    Promise.all([axios.get(urlInscripciones), axios.get(urlQuimestrales)])
      .then(([respEstudiantes, respQuimestrales]) => {
        const estudiantes = respEstudiantes.data;
        const quimestrales = respQuimestrales.data;
  
        const nuevosDatos = estudiantes.map(est => {
          const p1 = parcial1Data.find(p => p.id_inscripcion === est.idInscripcion) || {};
          const p2 = parcial2Data.find(p => p.id_inscripcion === est.idInscripcion) || {};
          const saved = quimestrales.find(q =>
            q.idInscripcion === est.idInscripcion &&
            q.quimestre === obtenerEtiquetaQuimestre()
          ) || {};          
  
          const parcial1 = parseFloat(p1["Promedio Final"] || 0);
          const parcial2 = parseFloat(p2["Promedio Final"] || 0);
          const promedioAcademico = (parcial1 + parcial2) / 2;
          const ponderacion70 = promedioAcademico * 0.7;
          const notaExamen = saved.examen ?? "";
          const ponderacion30 = parseFloat(notaExamen || 0) * 0.3;
          const promedioFinal = ponderacion70 + ponderacion30;
          
          const comportamientoP1 = parseFloat(p1["Promedio Comportamiento"] || 0);
          const comportamientoP2 = parseFloat(p2["Promedio Comportamiento"] || 0);

          const comportamientoTotal = (comportamientoP1 + comportamientoP2) / 2;
          const comportamientoFinal = calcularValoracion(comportamientoTotal);
  
          return {
            idInscripcion: est.idInscripcion,
            "Nro": est.nro,
            "Nómina de Estudiantes": est.nombre,
            "Primer Parcial": parcial1.toFixed(2),
            "Segundo Parcial": parcial2.toFixed(2),
            "Ponderación 70%": ponderacion70.toFixed(2),
            "Examen": notaExamen,
            "Ponderación 30%": ponderacion30.toFixed(2),
            "Promedio Final": promedioFinal.toFixed(2),
            "Promedio Comportamiento": comportamientoTotal,
            "Nivel": abreviarNivel(est.nivel),
            "Comportamiento Final": comportamientoFinal,
          };
        });
  
        setDatos(nuevosDatos);
        actualizarDatosQuim(nuevosDatos);
        console.log("✅ Datos Quimestral cargados:", nuevosDatos);
      })
      .catch(err => {
        console.error("❌ Error cargando Quimestrales:", err);
        ErrorMessage(err);
      });
  }, [datosModulo, parcial1Data, parcial2Data, quimestreSeleccionado]);  

  useEffect(() => {
    // Sólo disparar cuando ya tengamos filas con cálculo listo
    if (!datos || datos.length === 0) return;
  
    // Filtra filas válidas (aquí todas tienen “Promedio Final” calculado)
    const datosCompletos = datos.filter(fila => fila["Promedio Final"]  !== undefined && fila["Comportamiento Final"] !== undefined);
    
  
    if (typeof actualizarDatosQuim === "function" && datosCompletos.length > 0) {
      const datosTransformados = transformarDatosQuimestralParaGuardar(datosCompletos);
      actualizarDatosQuim(datosTransformados);
      console.log(`🚀 Datos enviados desde Quimestral Quimestre ${quimestreSeleccionado}:`, datosTransformados);
    }
  }, [datos, actualizarDatosQuim, quimestreSeleccionado]);
  
  // Función para manejar cambios en los inputs de la tabla (en este caso, solo para la columna "Examen")
  const handleInputChange = (rowIndex, columnName, value) => {
    const nuevosDatos = datos.map((fila, i) => {
      if (i === rowIndex) {
        let nuevaFila = { ...fila };

        if (columnName === "Examen") {
          if (value === "") {
            nuevaFila["Examen"] = "";
          } else if (!/^\d{0,2}(\.\d{0,2})?$/.test(value) || value > 10 || value < 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error de Validación',
              text: 'El valor debe estar entre 0.00 y 10.00 con máximo dos decimales.',
              confirmButtonColor: '#3085d6',
            });
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

  const determinarJornada = (horario) => {
    const horaInicio = horario.split("-")[0];
    const horaNumerica = parseInt(horaInicio.split(":")[0], 10);
    return horaNumerica < 12 ? "Matutina" : "Vespertina";
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
        inputsDisabled={inputsDisabled}
      />
    </div>
  );
};

export default Quimestral;
