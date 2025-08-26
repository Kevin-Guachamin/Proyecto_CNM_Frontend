// exportarListado_1col_vector_con_estilos_compacto.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

/** Carga imagen y devuelve dataURL */
async function loadImageAsDataURL(src) {
    if (!src) return null;
    const res = await fetch(src, { cache: "no-store" });
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
    });
}

export async function exportarListadoAPDF(
    filas,
    header,
    nombreArchivo = "ListadoEstudiantes.pdf"
) {
    try {
        if (!Array.isArray(filas) || filas.length === 0) {
            Swal.fire({ icon: "warning", title: "Sin datos", text: "No hay filas para exportar." });
            return;
        }

        const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();

        const margin = 28;
        const gutter = 200;                              // espacio lateral extra
        const tableW = pageW - (margin * 2) - gutter;   // ancho efectivo de tabla
        const side = (pageW - tableW) / 2;              // margen calculado para centrar

        // ==== Logos ====
        const logoIzq = await loadImageAsDataURL(header?.logoIzq);
        const logoDer = header?.logoDer ? await loadImageAsDataURL(header.logoDer) : null;

        // ==== Encabezado ====
        const titulo = header?.titulo || "CONSERVATORIO NACIONAL DE MUSICA";
        const subtitulo = header?.subtitulo || "LISTADO DE ESTUDIANTES";
        const info = header?.info || {};

        const headerTop = 22;
        const logoH = 42, logoW = 42;
        const headerBottomY = 100;

        if (logoIzq) pdf.addImage(logoIzq, "PNG", margin, headerTop - 4, logoW, logoH);
        if (logoDer) pdf.addImage(logoDer, "PNG", pageW - margin - logoW, headerTop - 4, logoW, logoH);

        pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
        pdf.text(titulo, pageW / 2, headerTop + 8, { align: "center" });
        pdf.setFont("helvetica", "normal"); pdf.setFontSize(11);
        pdf.text(subtitulo, pageW / 2, headerTop + 26, { align: "center" });

        pdf.setFontSize(9);
        let y = headerTop + 46;
        const colGap = 220;
        pdf.text(`Profesor: ${info["Profesor"] || "-"}`, margin, y);
        pdf.text(`Asignatura: ${info["Asignatura"] || "-"}`, margin + colGap, y);
        pdf.text(`Paralelo: ${info["Paralelo"] || "-"}`, margin + colGap * 2 - 20, y);
        y += 12;
        pdf.text(`Año Lectivo: ${info["Año Lectivo"] || "-"}`, margin, y);
        pdf.text(`Jornada: ${info["Jornada"] || "-"}`, margin + colGap, y);

        pdf.setDrawColor(180); pdf.setLineWidth(0.6);
        pdf.line(margin, headerBottomY - 4, pageW - margin, headerBottomY - 4);

        // ==== Tabla 1 columna ====
        const head = [["Nro", "Nómina de Estudiantes"]];
        const body = filas.map(r => [r.Nro ?? r["Nro"], r["Nómina de Estudiantes"] ?? r.nombre ?? ""]);

        autoTable(pdf, {
            head,
            body,
            startY: headerBottomY + 6,
            margin: { left: side, right: side },   // centrada
            tableWidth: tableW,                    // ancho fijo
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 9,                         // más compacto
                cellPadding: { top: 3, right: 5, bottom: 3, left: 5 },
                lineColor: [120, 120, 120],
                lineWidth: 0.25,
                halign: "left",
                valign: "middle",
                overflow: "linebreak"
            },
            headStyles: {
                fillColor: [230, 230, 230],
                textColor: 20,
                lineColor: [120, 120, 120],
                lineWidth: 0.5,
                fontStyle: "bold",
                halign: "center"
            },
            alternateRowStyles: { fillColor: [248, 248, 248] },
            columnStyles: {
                0: { cellWidth: 38, halign: "center" },      // columna Nro más angosta
                1: { cellWidth: tableW - 38 }                // el resto para el nombre
            },
            didDrawPage: () => {
                pdf.setFontSize(9);
                pdf.setTextColor(85);
                pdf.text("Generado por SGE", pageW - margin, pageH - 10, { align: "right" });
            }
        });

        pdf.save(nombreArchivo);
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo exportar el PDF." });
    }
}
