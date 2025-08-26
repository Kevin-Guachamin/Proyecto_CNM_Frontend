import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

/* Reescala un canvas a targetWidth px manteniendo proporción */
function resampleCanvas(sourceCanvas, targetWidthPx) {
  if (!sourceCanvas || !targetWidthPx) return sourceCanvas;
  if (targetWidthPx >= sourceCanvas.width) return sourceCanvas; // no ampliar
  const ratio = targetWidthPx / sourceCanvas.width;
  const out = document.createElement("canvas");
  out.width = targetWidthPx;
  out.height = Math.round(sourceCanvas.height * ratio);
  const ctx = out.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, out.width, out.height);
  return out;
}

/* Tamaño aproximado (bytes) de un dataURL */
function dataUrlBytes(dataUrl) {
  // quita cabecera "data:image/xxx;base64,"
  const b64 = dataUrl.split(",")[1] || "";
  // 4 chars base64 ≈ 3 bytes
  return Math.floor((b64.length * 3) / 4);
}

/* Genera dataURL intentando WEBP y luego JPEG con calidades/DPI decrecientes hasta quedar bajo maxKB */
function compressCanvasAdaptive(sourceCanvas, targetWidthPt, maxKB = 120) {
  // 72 pt = 1 inch → px deseados = (pt/72)*DPI
  const dpiSteps = [160, 140, 120, 100, 90];            // baja si aún queda pesado
  const qualStepsWebP = [0.75, 0.65, 0.55, 0.45];
  const qualStepsJpeg = [0.72, 0.65, 0.6, 0.5, 0.45];

  const maxBytes = maxKB * 1024;

  for (const dpi of dpiSteps) {
    const targetWidthPx = Math.max(600, Math.round((targetWidthPt / 72) * dpi));
    const scaled = resampleCanvas(sourceCanvas, targetWidthPx);

    // 1) WEBP (mucho más eficiente si jsPDF soporta)
    for (const q of qualStepsWebP) {
      const url = scaled.toDataURL("image/webp", q);
      if (dataUrlBytes(url) <= maxBytes) {
        return { url, fmt: "WEBP", dpi, q };
      }
    }

    // 2) JPEG (fallback universal)
    for (const q of qualStepsJpeg) {
      const url = scaled.toDataURL("image/jpeg", q);
      if (dataUrlBytes(url) <= maxBytes) {
        return { url, fmt: "JPEG", dpi, q };
      }
    }
  }

  // si nada cumple el límite, devuelve lo “menos pesado” probado (último intento)
  const lastTargetWidthPx = Math.round((targetWidthPt / 72) * dpiSteps.at(-1));
  const lastScaled = resampleCanvas(sourceCanvas, lastTargetWidthPx);
  const url = lastScaled.toDataURL("image/jpeg", 0.45);
  return { url, fmt: "JPEG", dpi: dpiSteps.at(-1), q: 0.45 };
}

export const handleExportPDF = async () => {
  try {
    let contentToPrint = document.querySelector(
      ".tab-pane.active .tab-pane.active div[id^='pdf-']"
    );
    if (!contentToPrint) {
      contentToPrint = document.querySelector(".tab-pane.active div[id^='pdf-']");
    }
    if (!contentToPrint) {
      alert("No se encontró el contenido a exportar.");
      return;
    }

    const clonedContent = contentToPrint.cloneNode(true);
    const tempContainer = document.createElement("div");

    const isParcial = contentToPrint.id.includes("parcial") && !contentToPrint.id.includes("be");
    const isParcialBE = contentToPrint.id.includes("parcial") && contentToPrint.id.includes("be");
    const renderWidth = isParcial ? 1400 : 1250;
    const renderScale = isParcial ? 2 : 3;

    tempContainer.style.width = `${renderWidth}px`;
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(clonedContent);

    clonedContent.classList.add("pdf-export");

    if (isParcial) {
      const tablaParciales = clonedContent.querySelector(".tabla-parciales");
      if (tablaParciales) {
        tablaParciales.style.transform = "scale(0.798)";
        tablaParciales.style.transformOrigin = "top left";
      }
    }

    if (isParcialBE) {
      const tablaParcialesBE = clonedContent.querySelector(".tabla-parciales-be");
      if (tablaParcialesBE) {
        tablaParcialesBE.style.transform = "scale(0.985)";
        tablaParcialesBE.style.transformOrigin = "top left";
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    clonedContent.style.width = "100%";
    clonedContent.style.boxSizing = "border-box";

    const canvas = await html2canvas(clonedContent, {
      scale: renderScale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: renderWidth,
      width: renderWidth,
      height: clonedContent.scrollHeight + 100,
      x: 0,
      y: 0,
      scrollY: 0,
      scrollX: 0,
    });

    document.body.removeChild(tempContainer);

    // ==============================
    //   PDF + COMPRESIÓN ADAPTATIVA
    // ==============================
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      compress: true, // compresión interna de streams
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // mismo layout que tenías (no tocamos offsets ni tamaño visual)
    const imgWidth = pageWidth - 10;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const xOffset = isParcial ? 30 : 40;
    const yOffset = isParcial ? (pageHeight - imgHeight) / 10 : (pageHeight - imgHeight) / 8;

    // Genera imagen optimizada <= 120 KB (ajusta si quieres 80/100/150)
    const { url, fmt } = compressCanvasAdaptive(canvas, imgWidth, /*maxKB*/ 120);

    // addImage soporta 'WEBP' en jsPDF recientes; si no, cae a JPEG sin romper formato
    const formatForJsPDF = fmt === "WEBP" ? "WEBP" : "JPEG";

    pdf.addImage(url, formatForJsPDF, xOffset, yOffset, imgWidth, imgHeight);

    // ==============================
    //    Nombre de archivo (igual)
    // ==============================
    let fileName = "Calificaciones.pdf";
    if (contentToPrint.id.startsWith("pdf-")) {
      const partialName = contentToPrint.id.replace("pdf-", "");
      const parts = partialName.split("-");
      if (parts.length >= 2) {
        const parcialRaw = parts[0] || "";
        const quimRaw = parts[1] || "";
        const parcialNumber = parcialRaw.replace("parcial", "");
        const quimNumber = quimRaw.replace("quim", "");
        const parcialLabel = parcialNumber ? `Parcial ${parcialNumber}` : "";
        const quimLabel = quimNumber ? `Quimestre ${quimNumber}` : "";
        if (parcialLabel && quimLabel) {
          fileName = `Calificaciones - ${parcialLabel} - ${quimLabel}.pdf`;
        }
      }
    }

    pdf.save(fileName);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al exportar a PDF.",
      footer: "Por favor intente nuevamente.",
    });
  }
};

export const parseFecha = (strFecha) => {
  if (!strFecha) return null;
  if (strFecha.includes("-")) return new Date(strFecha);
  const [dia, mes, anio] = strFecha.split("/");
  return new Date(`${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`);
};

export const handleEditar = ({
  activeMainTab,
  activeSubTabQuim1,
  activeSubTabQuim2,
  estadoFechas,
  forceEdit,
  setForceEdit,
  setInputsDisabled,
  tieneDatosGuardados,
  solicitudAceptada,
  solicitudEnRango
}) => {
  let currentSubTab = "";
  if (activeMainTab === "quimestre1") {
    currentSubTab = activeSubTabQuim1;
  } else if (activeMainTab === "quimestre2") {
    currentSubTab = activeSubTabQuim2;
  } else if (activeMainTab === "notaFinal") {
    currentSubTab = "notaFinal";
  }

  const isDentroRango = estadoFechas[currentSubTab] ?? false;
  const coincideConSolicitud = solicitudAceptada?.descripcion.replaceAll("_", "-") === currentSubTab;
  const isWithinRange = isDentroRango || (coincideConSolicitud && solicitudEnRango);

  if (!isWithinRange) {
    let mensaje = "No se pueden editar los datos fuera del rango permitido.";
  
    if (coincideConSolicitud && !solicitudEnRango) {
      mensaje = "La solicitud de edición ha expirado. Ya no está dentro del rango de fechas permitido.";
    }
  
    Swal.fire({
      icon: "warning",
      title: "Edición no permitida",
      text: mensaje,
    });
    return;
  }  

  if (forceEdit) {
    Swal.fire({
      icon: "info",
      title: "Ya están desbloqueados",
      text: "Los campos ya se encuentran disponibles para edición.",
    });
    return;
  }

  if (tieneDatosGuardados()) {
    Swal.fire({
      icon: "warning",
      title: "Edición no permitida",
      text: "Las calificaciones ya fueron guardadas. Usa el ✏️ de cada fila si necesitas editar.",
    });
    return;
  }

  setForceEdit(true);
  localStorage.removeItem("inputsLocked");
  setInputsDisabled(false);
  const mensaje = coincideConSolicitud
    ? "La edición fue habilitada gracias a una solicitud de permiso aprobada. Puedes ingresar las calificaciones."
    : "Los campos se han desbloqueado para edición.";    
  Swal.fire({
    icon: "success",
    title: "Edición habilitada",
    text: mensaje,
  });

};