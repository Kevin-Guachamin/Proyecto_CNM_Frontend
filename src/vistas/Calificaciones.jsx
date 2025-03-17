import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import Parcial from "./Parcial";
import Quimestral from "./Quimestral";
import Final from "./Final";
import Header from "../components/Header";
import Layout from "../layout/containers/Layout";
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
      const activePane = document.querySelector(".tab-pane.active");
      if (!activePane) return alert("No se encontró la pestaña activa.");
  
      const contentToPrint = activePane.querySelector("[id^='pdf-']");
      if (!contentToPrint) return alert("No se encontró contenedor pdf-*.");
  
      // 1. Agregar la clase .pdf-export
      contentToPrint.classList.add("pdf-export");
  
      // 2. Pequeña pausa para que el DOM re-renderice
      await new Promise((resolve) => setTimeout(resolve, 100));
  
      // 3. Capturar
      const canvas = await html2canvas(contentToPrint, {
        scale: 2,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: contentToPrint.scrollWidth,
        windowHeight: contentToPrint.scrollHeight
      });
  
      // 4. Quitar la clase para volver a la vista normal
      contentToPrint.classList.remove("pdf-export");
  
      // 5. Crear PDF del tamaño del canvas
      const imgData = canvas.toDataURL("image/png");
      const { width: canvasWidth, height: canvasHeight } = canvas;
      const orientation = canvasWidth > canvasHeight ? "l" : "p";
  
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvasWidth, canvasHeight],
      });
  
      pdf.addImage(imgData, "PNG", 0, 0, canvasWidth, canvasHeight);
      pdf.save("Calificaciones.pdf");
    } catch (error) {
      console.error("Error exportando a PDF:", error);
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

                  <Tab eventKey="quimestre1" title="Quimestre 1">
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

                  <Tab eventKey="quimestre2" title="Quimestre 2">
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
