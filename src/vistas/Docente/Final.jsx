import React, { useState, useEffect,useMemo } from "react";
import HeaderTabla from "../../components/HeaderTabla";
import Tabla from "../../components/Tabla";
import Swal from 'sweetalert2';
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import "./Parcial.css";

const Final = ({ quim1Data, quim2Data, datosModulo, actualizarDatosFinal, inputsDisabled }) => {
  const [datos, setDatos] = useState([]);

  const idContenedor = `pdf-final`;

  // Función para convertir el promedio de comportamiento en letra
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
  
  const transformarDatosFinalParaGuardar = (datos) => {
    return datos.map((fila) => {
      return {
        id_inscripcion: fila.idInscripcion, // 👈 cambia la clave a minúscula y con guión bajo      
        examen_recuperacion: parseFloat(fila["Examen Supletorio"]) || 0,
        _promedioAnual: fila._promedioAnual,
      };
    });
  };

  // Combinar los datos de Quimestre 1 y 2
  useEffect(() => {
    if (!datosModulo?.ID) return;

    const urlInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/asignacion/${datosModulo.ID}`;
    const urlFinales = `${import.meta.env.VITE_URL_DEL_BACKEND}/finales/asignacion/${datosModulo.ID}`;

    Promise.all([axios.get(urlInscripciones), axios.get(urlFinales)])
      .then(([respEstudiantes, respFinales]) => {
        const estudiantes = respEstudiantes.data;
        const finales = respFinales.data;

        const nuevosDatos = estudiantes.map((est) => {
          // Buscar examen supletorio en "finales"
          const finalGuardado = finales.find(
            (f) => f.idInscripcion === est.idInscripcion
          ) || {};

          // Buscar sus datos de quimestre 1 y 2
          const quim1 = quim1Data.find(
            (q) => q.id_inscripcion === est.idInscripcion
          ) || {};
          const quim2 = quim2Data.find(
            (q) => q.id_inscripcion === est.idInscripcion
          ) || {};

          // Tomar los promedios finales (numéricos) de Q1 y Q2
          const q1PF = parseFloat(quim1["Promedio Completo"]) || 0;
          const q2PF = parseFloat(quim2["Promedio Completo"]) || 0;
          const promedioAnual = (q1PF + q2PF) / 2;
          console.log(quim1, quim2)
          // Tomar los promedios de comportamiento (numéricos)
          const q1PC = parseFloat(quim1["Promedio Comportamiento Completo"]) || 0;
          const q2PC = parseFloat(quim2["Promedio Comportamiento Completo"]) || 0;
          const promedioComportamiento = (q1PC + q2PC) / 2;
          const comportamiento = calcularValoracion(promedioComportamiento);

          // Examen supletorio guardado (si existe)
          const examenSupletorio = finalGuardado.examen_recuperacion ?? "";

          // Cálculo del promedio final según la lógica
          let pFinal = promedioAnual;
          if (promedioAnual < 7 && examenSupletorio !== "") {
            const examenVal = parseFloat(examenSupletorio) || 0;
            pFinal = examenVal > promedioAnual ? examenVal : promedioAnual;
          }
          const estado = pFinal >= 7 ? "Aprobado" : "Reprobado";

          // Nota que guardamos en propiedades "numéricas" (prefijo _)
          // y también en las llaves visibles si quieres un valor inicial
          return {
            // Identificador
            idInscripcion: est.idInscripcion, // o est.idInscripcion, según tu BD

            // Props numéricas internas
            _primerQuimestre: q1PF,
            _segundoQuimestre: q2PF,
            _promedioAnual: promedioAnual,
            _promedioFinal: pFinal,

            // Flags
            promedioAnualRequeridoSupletorio: promedioAnual < 7,
            promedioFinalInsuficiente: pFinal < 7,

            // Campos para la tabla
            Nro: est.nro,
            "Nómina de Estudiantes": est.nombre,
            "Primer Quimestre": q1PF,          // Puedes poner .toFixed(2) aquí si gustas
            "Segundo Quimestre": q2PF,
            "Promedio Anual": promedioAnual,
            "Comportamiento": comportamiento,
            "Examen Supletorio": examenSupletorio,
            "Promedio Final": pFinal,         // Valor inicial (se convertirá en <span> o string después)
            "Nivel": abreviarNivel(est.nivel),
            "Estado": estado,
          };
        });

        setDatos(nuevosDatos);
      })
      .catch((err) => {
        console.error("❌ Error cargando datos finales:", err);
        ErrorMessage(err);
      });
  }, [datosModulo, quim1Data, quim2Data]);

  useEffect(() => {
    if (datos.length === 0) return;

    // Filtrar filas válidas si hace falta
    // const datosCompletos = datos.filter(...);

    // Aquí no definiste "datosCompletos", así que puedes usar "datos" directamente
    if (typeof actualizarDatosFinal === "function") {
      const datosTransformados = transformarDatosFinalParaGuardar(datos);
      actualizarDatosFinal(datosTransformados);
      console.log("🚀 Datos finales preparados:", datosTransformados);
    }
  }, [datos, actualizarDatosFinal]);

  // Manejar cambios en la columna "Examen Supletorio"
  const handleInputChange = (rowIndex, columnName, value) => {
    // 1) Solo para la columna "Examen Supletorio"
    if (columnName === "Examen Supletorio") {
      // A) Tomamos la versión numérica pura
      const pAnualNum = datos[rowIndex]._promedioAnual || 0;
      console.log("pAnualNum =>", pAnualNum);
  
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
            newRow["Estado"] = pFinal >= 7 ? "Aprobado" : "Reprobado";
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
        inputsDisabled={inputsDisabled}
      />
    </div>
  );
};

export default Final;
