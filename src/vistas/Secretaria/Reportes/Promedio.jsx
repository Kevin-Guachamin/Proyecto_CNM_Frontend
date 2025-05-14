import axios from "axios";

export async function obtenerPromediosPorAsignatura(idMatricula, esBE) {
  try {
    const endpointInscripciones = `${import.meta.env.VITE_URL_DEL_BACKEND}/inscripcion/obtener/matricula/${idMatricula}`;
    const endpointQuimestres = `${import.meta.env.VITE_URL_DEL_BACKEND}/${esBE ? "quimestralesbe" : "quimestrales"}/asignacion/${idMatricula}`;
    const endpointFinales = `${import.meta.env.VITE_URL_DEL_BACKEND}/${esBE ? "finalesbe" : "finales"}/asignacion/${idMatricula}`;

    const [resInscripciones, resQuimestres, resFinales] = await Promise.all([
      axios.get(endpointInscripciones),
      axios.get(endpointQuimestres),
      axios.get(endpointFinales)
    ]);

    const inscripciones = resInscripciones.data || [];
    const quimestres = resQuimestres.data || [];
    const finales = resFinales.data || [];

    const resultado = inscripciones.map((insc) => {
      const q1 = quimestres.find(q => q.idInscripcion === insc.ID && q.quimestre === "Q1") || {};
      const q2 = quimestres.find(q => q.idInscripcion === insc.ID && q.quimestre === "Q2") || {};

      const q1Prom = parseFloat(q1.examen || 0); // usa promedio quimestral si lo tienes
      const q2Prom = parseFloat(q2.examen || 0);

      const promedioAnual = (q1Prom + q2Prom) / 2;

      const final = finales.find(f => f.idInscripcion === insc.ID);
      const examenSupletorio = final?.examen_recuperacion ?? null;

      let promedioFinal = promedioAnual;
      if (promedioAnual < 7 && examenSupletorio !== null) {
        const examenVal = parseFloat(examenSupletorio);
        if (!isNaN(examenVal)) {
          promedioFinal = Math.max(promedioFinal, examenVal);
        }
      }

      const calificacion = obtenerCualitativa(promedioFinal);

      return {
        asignatura: insc.Asignacion?.Materia?.nombre || "Sin nombre",
        promedio: promedioFinal.toFixed(2),
        cualitativa: calificacion
      };
    });

    return resultado;

  } catch (error) {
    throw error;
  }
}

function obtenerCualitativa(n) {
  if (n >= 9) return "Domina los aprendizajes requeridos";
  if (n >= 7) return "Alcanza los aprendizajes requeridos";
  if (n > 4) return "Está próximo a alcanzar los aprendizajes requeridos";
  return "No alcanza los aprendizajes requeridos";
}