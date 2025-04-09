import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import axios from "axios";
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
    let contentToPrint = document.querySelector(".tab-pane.active .tab-pane.active div[id^='pdf-']")
      || document.querySelector(".tab-pane.active div[id^='pdf-']");
    if (!contentToPrint) {
      alert("No se encontró el contenido a exportar.");
      return;
    }

    const isParcial = contentToPrint.id.includes("parcial");
    const clonedContent = contentToPrint.cloneNode(true);
    const tempContainer = document.createElement("div");
    tempContainer.style.width = isParcial ? "1400px" : "1300px";
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(clonedContent);
    clonedContent.classList.add("pdf-export");

    if (isParcial) {
      const tablaParciales = clonedContent.querySelector(".tabla-parciales");
      if (tablaParciales) {
        tablaParciales.style.transform = "scale(0.829)";
        tablaParciales.style.transformOrigin = "top left";
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(clonedContent, {
      scale: isParcial ? 2 : 3,
      useCORS: true,
      windowWidth: isParcial ? 1400 : 1300,
      width: isParcial ? 1400 : 1150,
      height: clonedContent.scrollHeight + 100,
      scrollY: 0,
      scrollX: 0
    });

    document.body.removeChild(tempContainer);
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({ orientation: "l", unit: "pt", format: "a4" });

    const margin = isParcial ? 30 : 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let imgWidth = pageWidth - margin * 2;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight - margin * 2) {
      imgHeight = pageHeight - margin * 2;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = margin;
    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

    let fileName = "Calificaciones.pdf";
    if (contentToPrint.id.startsWith("pdf-")) {
      const [parcialRaw, quimRaw] = contentToPrint.id.replace("pdf-", "").split("-");
      fileName = `Calificaciones - Parcial ${parcialRaw.replace("parcial", "")} - Quimestre ${quimRaw.replace("quim", "")}.pdf`;
    }

    pdf.save(fileName);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo exportar el PDF.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#28a745"
    });
    ErrorMessage(error);
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
    tieneDatosGuardados
  }) => {
    let currentSubTab = "";
    if (activeMainTab === "quimestre1") {
      currentSubTab = activeSubTabQuim1;
    } else if (activeMainTab === "quimestre2") {
      currentSubTab = activeSubTabQuim2;
    } else if (activeMainTab === "notaFinal") {
      currentSubTab = "notaFinal";
    }
  
    const isWithinRange = estadoFechas[currentSubTab] ?? false;
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
    Swal.fire({
      icon: "success",
      title: "Edición habilitada",
      text: "Los campos se han desbloqueado para edición.",
    });
  };