export const calcularPromedioFinalNormal = (parciales, quimestrales, finales, idInscripcion) => {
  const getPromParcial = (p1, p2, evaluacion) => {
    const insumoAvg = (parseFloat(p1) + parseFloat(p2)) / 2;
    return insumoAvg * 0.7 + parseFloat(evaluacion) * 0.3;
  };

  const parc1 = parciales.find(p => p.idInscripcion === idInscripcion && p.parcial === "P1" && p.quimestre === "Q1");
  const parc2 = parciales.find(p => p.idInscripcion === idInscripcion && p.parcial === "P2" && p.quimestre === "Q1");
  const parc3 = parciales.find(p => p.idInscripcion === idInscripcion && p.parcial === "P1" && p.quimestre === "Q2");
  const parc4 = parciales.find(p => p.idInscripcion === idInscripcion && p.parcial === "P2" && p.quimestre === "Q2");

  const promQ1 = (getPromParcial(parc1?.insumo1, parc1?.insumo2, parc1?.evaluacion) + getPromParcial(parc2?.insumo1, parc2?.insumo2, parc2?.evaluacion)) / 2;
  const promQ2 = (getPromParcial(parc3?.insumo1, parc3?.insumo2, parc3?.evaluacion) + getPromParcial(parc4?.insumo1, parc4?.insumo2, parc4?.evaluacion)) / 2;

  const examenQ1 = parseFloat(quimestrales.find(q => q.idInscripcion === idInscripcion && q.quimestre === "Q1")?.examen || 0);
  const examenQ2 = parseFloat(quimestrales.find(q => q.idInscripcion === idInscripcion && q.quimestre === "Q2")?.examen || 0);

  const finalQ1 = promQ1 * 0.7 + examenQ1 * 0.3;
  const finalQ2 = promQ2 * 0.7 + examenQ2 * 0.3;

  let promedioAnual = (finalQ1 + finalQ2) / 2;
  const examenRecup = parseFloat(finales.find(f => f.idInscripcion === idInscripcion)?.examen_recuperacion || 0);

  let promedioFinal = promedioAnual;
  if (promedioAnual < 7 && examenRecup) {
    promedioFinal = Math.max(promedioAnual, examenRecup);
  }

  return {
    promedioFinal,
    detalle: { promQ1, promQ2, examenQ1, examenQ2, examenRecup, finalQ1, finalQ2, promedioAnual }
  };
};