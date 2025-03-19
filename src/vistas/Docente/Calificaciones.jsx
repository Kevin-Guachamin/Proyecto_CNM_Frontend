import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import Parcial from "./Parcial";
import Quimestral from "./Quimestral";
import Final from "./Final";
import Header from "../../components/Header";
import Layout from "../../layout/containers/Layout";
import { Home, Users, Settings } from "lucide-react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import "./Calificaciones.css";

function Calificaciones() {
  // Simulación de usuario ficticio
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    setUsuario({ nombre: "Juan Pérez", rol: "Estudiante" });
  }, []);

  // Estados para almacenar los datos de cada Parcial
  const [parcial1Quim1Data, setParcial1Quim1Data] = useState([]);
  const [parcial2Quim1Data, setParcial2Quim1Data] = useState([]);
  const [parcial1Quim2Data, setParcial1Quim2Data] = useState([]);
  const [parcial2Quim2Data, setParcial2Quim2Data] = useState([]);
  // Estados para Quimestral
  const [quim1Data, setQuim1Data] = useState([]);
  const [quim2Data, setQuim2Data] = useState([]);

  const modules = [
    { name: "Inicio", icon: <Home size={20} /> },
    { name: "Usuarios", icon: <Users size={20} /> },
    { name: "Configuración", icon: <Settings size={20} /> },
  ];

  // ──────────────────────────────────────────
  // 1) Exportar a Excel
  // ──────────────────────────────────────────
  const handleExportExcel = () => {
    try {
      const activeTab = document.querySelector(".tab-pane.active");
      if (!activeTab) {
        alert("No se encontró la pestaña activa para exportar a Excel.");
        return;
      }

      const table = activeTab.querySelector("table");
      if (!table) {
        alert("No se encontró ninguna tabla en la pestaña activa.");
        return;
      }

      const worksheet = XLSX.utils.table_to_sheet(table);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Calificaciones");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "Calificaciones.xlsx");
    } catch (error) {
      console.error("Error exportando a Excel:", error);
    }
  };

  // ──────────────────────────────────────────
  // 2) Exportar a PDF (dinámico con ID)
  // ──────────────────────────────────────────
  
  const handleExportPDF = async () => {
    try {
      // 1. Buscar el contenedor activo con id^="pdf-"
      let contentToPrint = document.querySelector(
        ".tab-pane.active .tab-pane.active div[id^='pdf-']"
      );
      // Si no hay un tab anidado, buscar en el tab principal
      if (!contentToPrint) {
        contentToPrint = document.querySelector(".tab-pane.active div[id^='pdf-']");
      }
      if (!contentToPrint) {
        alert("No se encontró el contenido a exportar.");
        return;
      }
      
      // 2. Crear un clon del contenido para manipularlo sin afectar la vista original
      const clonedContent = contentToPrint.cloneNode(true);
      const tempContainer = document.createElement("div");
      tempContainer.style.width = "1200px"; // Ancho fijo para asegurar espacio suficiente
      tempContainer.appendChild(clonedContent);
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      document.body.appendChild(tempContainer);
      
      // 3. Agregar clase para estilos de impresión al clon
      clonedContent.classList.add("pdf-export");
      
      // 4. Aumentar el tiempo de espera para que se apliquen completamente los estilos
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // 5. Capturar el contenido como Canvas con mejor calidad y márgenes
      const canvas = await html2canvas(clonedContent, {
        scale: 3, // Mayor nitidez
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 1200, // Ancho fijo que coincide con el contenedor
        height: clonedContent.scrollHeight + 100, // Altura con margen adicional
        width: 1200, // Ancho fijo para consistencia
        x: 0,
        y: 0,
        scrollY: 0,
        scrollX: 0,
      });
      
      // 6. Eliminar el contenedor temporal
      document.body.removeChild(tempContainer);
      
      // 7. Convertir Canvas a imagen
      const imgData = canvas.toDataURL("image/png", 1.0); // Máxima calidad
      
      // 8. Crear el PDF en A4 horizontal (landscape)
      const pdf = new jsPDF({
        orientation: "l", // "l" = landscape
        unit: "pt",       // puntos
        format: "a4",     // tamaño A4
      });
      
      // 9. Calcular dimensiones para encajar la imagen en A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let imgWidth = pageWidth - 40; // Margen de 20pt en cada lado
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // 10. Ajustar si la imagen excede la altura de la página
      if (imgHeight > pageHeight - 40) { // Margen de 20pt arriba y abajo
        imgHeight = pageHeight - 40;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }
      
      // 11. Agregar la imagen al PDF centrada
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      
      // 12. Construir nombre de archivo dinámico
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
      
      // 13. Guardar el PDF
      pdf.save(fileName);
    } catch (error) {
      console.error("Error exportando a PDF:", error);
      alert("Ocurrió un error al exportar a PDF. Por favor intente nuevamente.");
    }
  };

  // ──────────────────────────────────────────
  // 3) Imprimir
  // ──────────────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules}>
        <div className="content-container">
          <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Gestión de Calificaciones</h2>
              <div>
                <button
                  className="btn btn-success me-2"
                  onClick={handleExportExcel}
                  title="Exportar a Excel"
                >
                  <i className="bi bi-file-earmark-excel-fill"></i>
                </button>

                <button
                  className="btn btn-danger me-2"
                  onClick={handleExportPDF}
                  title="Exportar a PDF"
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handlePrint}
                  title="Imprimir"
                >
                  <i className="bi bi-printer-fill"></i>
                </button>
              </div>
            </div>

            {/* TABS PRINCIPALES */}
            <Tabs defaultActiveKey="quimestre1" id="calificaciones-tabs" className="mb-3" fill>
              {/* QUIMESTRE 1 */}
              <Tab eventKey="quimestre1" title="Quimestre 1">
                <Tabs defaultActiveKey="parcial1-quim1" className="mb-3" fill>
                  <Tab eventKey="parcial1-quim1" title="Parcial 1 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="1"
                      actualizarDatosParcial={(datos) => {
                        setParcial1Quim1Data(datos);
                      }}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim1" title="Parcial 2 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={(datos) => {
                        setParcial2Quim1Data(datos);
                      }}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim1" title="Quimestre 1">
                    <Quimestral
                      quimestreSeleccionado="1"
                      parcial1Data={parcial1Quim1Data}
                      parcial2Data={parcial2Quim1Data}
                      actualizarDatosQuim={(datos) => {
                        setQuim1Data(datos);
                      }}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* QUIMESTRE 2 */}
              <Tab eventKey="quimestre2" title="Quimestre 2">
                <Tabs defaultActiveKey="parcial1-quim2" className="mb-3" fill>
                  <Tab eventKey="parcial1-quim2" title="Parcial 1 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="1"
                      actualizarDatosParcial={(datos) => {
                        setParcial1Quim2Data(datos);
                      }}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim2" title="Parcial 2 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={(datos) => {
                        setParcial2Quim2Data(datos);
                      }}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim2" title="Quimestre 2">
                    <Quimestral
                      quimestreSeleccionado="2"
                      parcial1Data={parcial1Quim2Data}
                      parcial2Data={parcial2Quim2Data}
                      actualizarDatosQuim={(datos) => {
                        setQuim2Data(datos);
                      }}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* NOTA FINAL */}
              <Tab eventKey="notaFinal" title="Nota Final">
                <Final quim1Data={quim1Data} quim2Data={quim2Data} />
              </Tab>
            </Tabs>
          </Container>
        </div>
      </Layout>
    </>
  );
}

export default Calificaciones;
