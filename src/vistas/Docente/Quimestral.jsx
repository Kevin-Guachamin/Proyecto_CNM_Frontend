import React, { useState, useEffect } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import Swal from 'sweetalert2';
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";


const Quimestral = ({ quimestreSeleccionado, parcial1Data, parcial2Data, actualizarDatosQuim, datosModulo }) => {

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
  
  // Cada vez que lleguen datos de ambos parciales, se combinan
  useEffect(() => {
    console.log("💡 parcial1Data:", parcial1Data);
    if (!datosModulo || !datosModulo.ID) return;
  
    const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;
  
    axios.get(urlInscripciones)
      .then((resp) => {
        const estudiantes = resp.data;
  
        const nuevosDatos = estudiantes.map((est) => {
          const p1 = parcial1Data.find(p => p.id_inscripcion === est.idInscripcion);
          const p2 = parcial2Data.find(p => p.id_inscripcion === est.idInscripcion);
  
          const parcial1 = p1?.["Promedio Final"] !== undefined
            ? parseFloat(p1["Promedio Final"]) || 0
            : 0;
  
          const parcial2 = p2?.["Promedio Final"] !== undefined
            ? parseFloat(p2["Promedio Final"]) || 0
            : 0;
  
          const promedioAcademico = (parcial1 + parcial2) / 2;
          const ponderacion70 = promedioAcademico * 0.7;
  
          const comportamiento1 = p1?.comportamiento?.reduce((acc, val) => acc + (parseInt(val) || 0), 0) || 0;
          const comportamiento2 = p2?.comportamiento?.reduce((acc, val) => acc + (parseInt(val) || 0), 0) || 0;
          const promedioComportamiento = Math.ceil((comportamiento1 + comportamiento2) / 2);
          const comportamientoFinal = calcularValoracion(promedioComportamiento);
  
          return {
            idInscripcion: est.idInscripcion,
            "Nro": est.nro,
            "Nómina de Estudiantes": est.nombre,
            "Primer Parcial": parcial1.toFixed(2),
            "Segundo Parcial": parcial2.toFixed(2),
            "Ponderación 70%": ponderacion70.toFixed(2),
            "Examen": "",
            "Ponderación 30%": "0.00",
            "Promedio Final": ponderacion70.toFixed(2),
            "Promedio Comportamiento": promedioComportamiento,
            "Nivel": abreviarNivel(est.nivel),
            "Comportamiento Final": comportamientoFinal,
          };
        });
  
        setDatos(nuevosDatos);
        if (typeof actualizarDatosQuim === "function") {
          actualizarDatosQuim(nuevosDatos);
        }
  
        // 👇 Para depurar si llega la nota bien
        console.log("✅ Datos combinados Quimestral:", nuevosDatos);
      })
      .catch((err) => {
        console.error("❌ Error al cargar estudiantes:", err);
        ErrorMessage(err);
      });
  }, [datosModulo, parcial1Data, parcial2Data]);
       

  useEffect(() => {
    if (typeof actualizarDatosQuim === "function") {
      actualizarDatosQuim(datos);
    }
  }, [datos, actualizarDatosQuim]);

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
        mostrarEliminar={false}
      />
    </div>
  );
};

export default Quimestral;
