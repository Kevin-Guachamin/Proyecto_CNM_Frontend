export const calcularPromedioFinalBE = (parciales, quimestrales, idInscripcion) => {
  const getNotaParcial = (arr) => {
    if (arr.length !== 2) return null;

    return arr.map((p) => {
      const insumoAvg = (parseFloat(p.insumo1) + parseFloat(p.insumo2)) / 2;
      const evaluacion = parseFloat(p.evaluacion);
      const mejora = parseFloat(p.mejoramiento);

      let sumaEval = evaluacion;
      if (!isNaN(evaluacion) && !isNaN(mejora)) {
        if (mejora < evaluacion) {
          sumaEval = evaluacion;
        } else {
          const promedioMejora = (evaluacion + mejora) / 2;
          sumaEval = (promedioMejora + evaluacion) / 2;
        }
      }

      return (insumoAvg * 0.7) + (sumaEval * 0.3);
    });
  };

  const q1 = parciales.filter(p => p.idInscripcion === idInscripcion && p.quimestre === "Q1");
  const q2 = parciales.filter(p => p.idInscripcion === idInscripcion && p.quimestre === "Q2");

  const notasQ1 = getNotaParcial(q1);
  const notasQ2 = getNotaParcial(q2);

  const promQ1 = notasQ1?.length === 2 ? (notasQ1[0] + notasQ1[1]) / 2 : null;
  const promQ2 = notasQ2?.length === 2 ? (notasQ2[0] + notasQ2[1]) / 2 : null;

  let promedioFinal = null;
  if (promQ1 !== null && promQ2 !== null) {
    const q1Examen = parseFloat(quimestrales.find(q => q.idInscripcion === idInscripcion && q.quimestre === "Q1")?.examen || 0);
    const q2Examen = parseFloat(quimestrales.find(q => q.idInscripcion === idInscripcion && q.quimestre === "Q2")?.examen || 0);

    const q1Final = (promQ1 * 0.7) + (q1Examen * 0.3);
    const q2Final = (promQ2 * 0.7) + (q2Examen * 0.3);
    promedioFinal = (q1Final + q2Final) / 2;

    return {
      promedioFinal,
      detalle: { notasQ1, notasQ2, promQ1, promQ2, q1Examen, q2Examen, q1Final, q2Final }
    };
  }

  return { promedioFinal: null, detalle: {} };
};