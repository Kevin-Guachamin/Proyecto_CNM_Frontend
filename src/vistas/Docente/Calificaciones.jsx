import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import Parcial from "./Parcial";
import Quimestral from "./Quimestral";
import Final from "./Final";
import Header from "../../components/Header";
import Layout from "../../layout/Layout";
import { Home, Users, Settings } from "lucide-react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import axios from "axios";
import Swal from "sweetalert2";
import "./Calificaciones.css";
import { ErrorMessage } from "../../Utils/ErrorMesaje";

function Calificaciones() {

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const moduloSeleccionado = location.state;

  // Estados para almacenar los datos de cada Parcial
  const [parcial1Quim1Data, setParcial1Quim1Data] = useState([]);
  const [parcial2Quim1Data, setParcial2Quim1Data] = useState([]);
  const [parcial1Quim2Data, setParcial1Quim2Data] = useState([]);
  const [parcial2Quim2Data, setParcial2Quim2Data] = useState([]);
  // Estados para Quimestral
  const [quim1Data, setQuim1Data] = useState([]);
  const [quim2Data, setQuim2Data] = useState([]);
  
  const makeKey = ({ id_inscripcion, quimestre, parcial }) =>
  `${id_inscripcion}-${quimestre}-${parcial}`;

  const handleActualizarParcial1Quim1 = React.useCallback((datos) => {
    setParcial1Quim1Data(datos);
    setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });
  }, []);
  

  const handleActualizarParcial2Quim1 = React.useCallback((datos) => {
    setParcial2Quim1Data(datos);
    setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });
  }, []);

  const handleActualizarParcial1Quim2 = React.useCallback((datos) => {
    setParcial1Quim2Data(datos);
    setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });
  }, []);

  const handleActualizarParcial2Quim2 = React.useCallback((datos) => {
    setParcial2Quim2Data(datos);
    setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });
  }, []);

  const handleActualizarQuim1 = React.useCallback((datos) => {
    setQuim1Data(datos);
    setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });
  }, []);

  const handleActualizarQuim2 = React.useCallback((datos) => {
    setQuim2Data(datos);
    setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });
  }, []);

  const [activeMainTab, setActiveMainTab] = useState("quimestre1");
  const [activeSubTabQuim1, setActiveSubTabQuim1] = useState("parcial1-quim1");
  const [activeSubTabQuim2, setActiveSubTabQuim2] = useState("parcial1-quim2");

  const modules = [
    { name: "Inicio", icon: <Home size={20} />, path: "/panelcursos" },
    { name: "Usuarios", icon: <Users size={20} /> },
    { name: "Configuración", icon: <Settings size={20} /> },
  ];

  const [datosModulo, setDatosModulo] = useState(moduloSeleccionado || {});

  const [savedKeys, setSavedKeys] = useState(new Set());

  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken && moduloSeleccionado) {
      setUsuario(JSON.parse(storedUser));
      setDatosModulo(moduloSeleccionado);
    } else {
      navigate("/panelcursos"); // Si falta módulo seleccionado o usuario/token, regresamos.
    }
  }, [moduloSeleccionado, navigate]);

  // ──────────────────────────────────────────
  // 1) Exportar a Excel
  // ──────────────────────────────────────────
  const handleExportExcel = () => {
    try {
      // 1) Ubicar la pestaña activa
      const activeTab = document.querySelector(".tab-pane.active");
      if (!activeTab) {
        alert("No se encontró la pestaña activa para exportar a Excel.");
        return;
      }

      // 2) Buscar el header y la tabla dentro de la pestaña activa
      //    Asumiendo que el header tiene clase .cabecera-parciales
      const headerContainer = activeTab.querySelector(".cabecera-parciales");
      const table = activeTab.querySelector("table");

      if (!table) {
        alert("No se encontró ninguna tabla en la pestaña activa.");
        return;
      }

      // 3) Extraer datos del header
      //    (En este ejemplo tomamos el texto y lo ponemos en filas simples)
      let headerData = [];
      if (headerContainer) {
        // Tomamos el texto de h4 y h5
        const h4 = headerContainer.querySelector("h4")?.innerText || "";
        const h5 = headerContainer.querySelector("h5")?.innerText || "";
        // Agregamos cada uno en una fila separada
        headerData.push([h4]);
        headerData.push([h5]);

        // Luego, tomamos los "Profesor: X", "Año Lectivo: Y", etc.
        // asumiendo que están en divs .col-md-6.mb-1
        const infoDivs = headerContainer.querySelectorAll(".row .col-md-6.mb-1");
        infoDivs.forEach((div) => {
          // Ej: "Profesor: Guachis"
          headerData.push([div.innerText]);
        });

        // Agregamos una fila vacía para separar
        headerData.push([]);
      }

      // 4) Convertir la tabla HTML a un array de arrays (AOA)
      //    usando primero table_to_sheet y luego sheet_to_json con { header: 1 }
      const tempSheet = XLSX.utils.table_to_sheet(table);
      const tableAOA = XLSX.utils.sheet_to_json(tempSheet, { header: 1 });

      // 5) Combinar el header AOA y la tabla AOA
      const finalAOA = [...headerData, ...tableAOA];

      // 6) Generar el worksheet y el workbook
      const worksheet = XLSX.utils.aoa_to_sheet(finalAOA);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Calificaciones");

      // 7) Exportar a .xlsx
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
      if (!contentToPrint) {
        contentToPrint = document.querySelector(".tab-pane.active div[id^='pdf-']");
      }
      if (!contentToPrint) {
        alert("No se encontró el contenido a exportar.");
        return;
      }

      // 2. Crear un clon del contenido
      const clonedContent = contentToPrint.cloneNode(true);
      const tempContainer = document.createElement("div");

      // Detectar si es "parcial"
      const isParcial = contentToPrint.id.includes("parcial");

      // Ajustar ancho del contenedor temporal
      if (isParcial) {
        tempContainer.style.width = "1400px";
      } else {
        tempContainer.style.width = "1300px";
      }

      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      document.body.appendChild(tempContainer);
      tempContainer.appendChild(clonedContent);

      // 3. Agregar clase para estilos de impresión al clon
      clonedContent.classList.add("pdf-export");

      // 4. (Opcional) Escalar solo la tabla si es parcial
      if (isParcial) {
        const tablaParciales = clonedContent.querySelector(".tabla-parciales");
        if (tablaParciales) {
          // Ajusta este valor si quieres más o menos tamaño
          tablaParciales.style.transform = "scale(0.829)";
          tablaParciales.style.transformOrigin = "top left";
        }
      }

      // 5. Esperar para que se apliquen estilos
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 6. Capturar con html2canvas
      const canvas = await html2canvas(clonedContent, {
        // Si es parcial, scale 2 para no generar un canvas enorme
        // Si no, scale 3 para más nitidez
        scale: isParcial ? 2 : 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: isParcial ? 1400 : 1300,
        height: clonedContent.scrollHeight + 100,
        width: isParcial ? 1400 : 1150,
        x: 0,
        y: 0,
        scrollY: 0,
        scrollX: 0,
      });

      // 7. Remover el contenedor temporal
      document.body.removeChild(tempContainer);

      // 8. Convertir Canvas a imagen
      const imgData = canvas.toDataURL("image/png", 1.0);

      // 9. Crear PDF (landscape)
      const pdf = new jsPDF({
        orientation: "l",
        unit: "pt",
        format: "a4",
      });

      // 10. Calcular dimensiones para que quepa en A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Define margen menor si es parcial
      const margin = isParcial ? 30 : 40;
      let imgWidth = pageWidth - margin * 2;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Ajustar si excede la altura
      if (imgHeight > pageHeight - margin * 2) {
        imgHeight = pageHeight - margin * 2;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      // Calcular offsets para centrar
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = margin;

      // 11. Añadir imagen al PDF
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

      // 12. Nombre de archivo dinámico
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
  // 3) Función para guardar datos del tab activo
  // ──────────────────────────────────────────
  const handleSave = () => {
    let activeData = [];
    if (activeMainTab === "quimestre1") {
      if (activeSubTabQuim1 === "parcial1-quim1") activeData = parcial1Quim1Data;
      else if (activeSubTabQuim1 === "parcial2-quim1") activeData = parcial2Quim1Data;
      else activeData = quim1Data;
    } else {
      if (activeSubTabQuim2 === "parcial1-quim2") activeData = parcial1Quim2Data;
      else if (activeSubTabQuim2 === "parcial2-quim2") activeData = parcial2Quim2Data;
      else activeData = quim2Data;
    }
  
    if (activeData.length === 0) {
      return Swal.fire({ icon:"warning", title:"Sin datos", text:"No hay calificaciones para guardar." });
    }
  
    const newRows = activeData.filter(row => !savedKeys.has(makeKey(row)));
  
    if (newRows.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "Para modificar una calificación ya guardada usa el botón ✏️ en Acciones."
      });
    }
  
    axios.post(`${import.meta.env.VITE_URL_DEL_BACKEND}/parciales/bulk`, newRows)
      .then(() => {
        Swal.fire({ icon:"success", title:"Guardado", text:"Calificaciones guardadas correctamente." });
        setSavedKeys(prev => {
          const copy = new Set(prev);
          newRows.forEach(r => copy.add(makeKey(r)));
          return copy;
        });
      })
      .catch(error => {
        Swal.fire({ icon:"error", title:"Error", text:"No se pudieron guardar las calificaciones." });
        ErrorMessage(error);
      });
  };  

  const handleSidebarNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  if (loading) {
    return <Loading />;
  }
  
  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules} onNavigate={handleSidebarNavigation}>
        <div className="content-container">
          <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
              <h2 className="mb-0">Gestión de Calificaciones</h2>

              <div className="d-flex flex-column align-items-end gap-2">
                {/* Línea de Exportaciones */}
                <div className="d-flex align-items-center gap-2">
                  <span className="label-text">Exportaciones:</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleExportExcel}
                    title="Exportar a Excel"
                  >
                    <i className="bi bi-file-earmark-excel-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleExportPDF}
                    title="Exportar a PDF"
                  >
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </button>
                </div>

                {/* Línea de Acciones */}
                <div className="d-flex align-items-center gap-2">
                  <span className="label-text">Acciones:</span>
                  <button className="btn btn-secondary btn-sm" title="Guardar"  onClick={handleSave}>
                    <i className="bi bi-save"></i>
                  </button>
                  <button className="btn btn-primary btn-sm text-white" title="Editar">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                </div>
              </div>
            </div>


            {/* TABS PRINCIPALES */}
            <Tabs defaultActiveKey="quimestre1" id="calificaciones-tabs" className="mb-3" fill onSelect={(k) => setActiveMainTab(k)}>
              {/* QUIMESTRE 1 */}
              <Tab eventKey="quimestre1" title="Quimestre 1">
                <Tabs defaultActiveKey="parcial1-quim1" className="mb-3" fill onSelect={(k) => setActiveSubTabQuim1(k)}>
                  <Tab eventKey="parcial1-quim1" title="Parcial 1 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="1"
                      actualizarDatosParcial={handleActualizarParcial1Quim1}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre1" && activeSubTabQuim1 === "parcial1-quim1"}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim1" title="Parcial 2 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={handleActualizarParcial2Quim1}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre1" && activeSubTabQuim1 === "parcial2-quim1"}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim1" title="Quimestre 1">
                      <Quimestral
                        quimestreSeleccionado="1"
                        parcial1Data={parcial1Quim1Data}
                        parcial2Data={parcial2Quim1Data}
                        actualizarDatosQuim={handleActualizarQuim1}
                        datosModulo={datosModulo}
                      />
                  </Tab>
                </Tabs>
              </Tab>

              {/* QUIMESTRE 2 */}
              <Tab eventKey="quimestre2" title="Quimestre 2">
                <Tabs defaultActiveKey="parcial1-quim2" className="mb-3" fill onSelect={(k) => setActiveSubTabQuim2(k)}>
                  <Tab eventKey="parcial1-quim2" title="Parcial 1 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="1"
                      actualizarDatosParcial={handleActualizarParcial1Quim2}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre2" && activeSubTabQuim2 === "parcial1-quim2"}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim2" title="Parcial 2 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={handleActualizarParcial2Quim2}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre2" && activeSubTabQuim2 === "parcial2-quim2"}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim2" title="Quimestre 2">
                    <Quimestral
                      quimestreSeleccionado="2"
                      parcial1Data={parcial1Quim2Data}
                      parcial2Data={parcial2Quim2Data}
                      actualizarDatosQuim={handleActualizarQuim2}
                      datosModulo={datosModulo}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* NOTA FINAL */}
              <Tab eventKey="notaFinal" title="Nota Final">
                <div className="tab-pane active">
                  <Final quim1Data={quim1Data} quim2Data={quim2Data} datosModulo={datosModulo} />
                </div>
              </Tab>
            </Tabs>
          </Container>
        </div>
      </Layout>
    </>
  );
}

export default Calificaciones;
