// funcionesListas.jsx
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

// Exportar a Excel
export const exportarListadoAExcel = (datos, datosModulo) => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Listado de Estudiantes");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const nombreArchivo = `ListadoEstudiantes_${datosModulo.materia}_${datosModulo.paralelo}.xlsx`;
    saveAs(data, nombreArchivo);
};

// Exportar a PDF
export const exportarListadoAPDF = async (elementoId, nombreArchivo = "ListadoEstudiantes.pdf") => {
    try {
        const contenido = document.getElementById(elementoId);
        if (!contenido) {
            Swal.fire({
                icon: "error",
                title: "Elemento no encontrado",
                text: `No se encontró el elemento con ID "${elementoId}" para exportar.`,
            });
            return;
        }

        const contenedorClonado = contenido.cloneNode(true);
        contenedorClonado.classList.add("pdf-export");

        const elementosNoPrint = contenedorClonado.querySelectorAll(".no-print");
        elementosNoPrint.forEach(el => {
            el.style.display = "none";
        });

        const tempContainer = document.createElement("div");
        tempContainer.style.width = "1000px";
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        document.body.appendChild(tempContainer);
        tempContainer.appendChild(contenedorClonado);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(contenedorClonado, {
            scale: 3,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
        });

        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF("p", "pt", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const margin = 40;
        let imgWidth = pageWidth - margin * 2;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pageHeight - margin * 2) {
            imgHeight = pageHeight - margin * 2;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = margin;

        pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

        // 📝 Pie de página fijo al final del PDF
        const xRight = pageWidth - margin;
        const footerY1 = pageHeight - 40;
        const footerY2 = pageHeight - 25;

        pdf.setFontSize(9);
        pdf.setTextColor(85, 85, 85); // #555
        pdf.text("Documento generado automáticamente por el sistema académico.", xRight, footerY1, { align: "right" });
        pdf.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-EC", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })}`, xRight, footerY2, { align: "right" });

        pdf.save(nombreArchivo);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un problema al exportar el PDF.",
        });
        console.error(error);
    }
};

