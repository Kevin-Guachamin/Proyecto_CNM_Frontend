import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../Utils/ErrorMesaje";

// ✅ Exportar Excel
export const handleExportExcel = () => {
  try {
    const activeTab = document.querySelector(".tab-pane.active");
    if (!activeTab) {
      alert("No se encontró la pestaña activa para exportar a Excel.");
      return;
    }

    const headerContainer = activeTab.querySelector(".cabecera-parciales");
    const table = activeTab.querySelector("table");
    if (!table) {
      alert("No se encontró ninguna tabla en la pestaña activa.");
      return;
    }

    let headerData = [];
    if (headerContainer) {
      const h4 = headerContainer.querySelector("h4")?.innerText || "";
      const h5 = headerContainer.querySelector("h5")?.innerText || "";
      headerData.push([h4], [h5]);

      const infoDivs = headerContainer.querySelectorAll(".row .col-md-6.mb-1");
      infoDivs.forEach(div => headerData.push([div.innerText]));
      headerData.push([]);
    }

    const tempSheet = XLSX.utils.table_to_sheet(table);
    const tableAOA = XLSX.utils.sheet_to_json(tempSheet, { header: 1 });
    const finalAOA = [...headerData, ...tableAOA];

    const worksheet = XLSX.utils.aoa_to_sheet(finalAOA);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calificaciones");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Calificaciones.xlsx");
  } catch (error) {
    ErrorMessage(error);

  }
};

// ✅ Exportar PDF
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
      windowWidth: renderWidth,
      width: renderWidth,
      height: clonedContent.scrollHeight + 100,
      x: 0,
      y: 0,
      scrollY: 0,
      scrollX: 0,
    });

    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    if (isParcial) {
      // Configuración personalizada para PARCIALES
      const imgWidth = pageWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = 30;
      const yOffset = ((pageHeight - imgHeight) / 10);

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    } else {
      // Configuración para QUIMESTRAL, FINAL u otros
      const imgWidth = pageWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = 40;
      const yOffset = ((pageHeight - imgHeight) / 8);

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    }

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
  solicitudAceptada // nuevo
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
  const isWithinRange = isDentroRango || coincideConSolicitud;
  if (!isWithinRange) {
    Swal.fire({
      icon: "warning",
      title: "No se pueden desbloquear",
      text: "No se pueden editar los datos fuera del rango permitido.",
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