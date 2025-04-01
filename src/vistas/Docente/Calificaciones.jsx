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
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const moduloSeleccionado = location.state;

  // Estados para almacenar los datos de cada Parcial
  const [parcial1Quim1Data, setParcial1Quim1Data] = useState([]);
  const [parcial2Quim1Data, setParcial2Quim1Data] = useState([]);
  const [parcial1Quim2Data, setParcial1Quim2Data] = useState([]);
  const [parcial2Quim2Data, setParcial2Quim2Data] = useState([]);
  // Estados para Quimestral
  const [quim1Data, setQuim1Data] = useState([]);
  const [quim2Data, setQuim2Data] = useState([]);

  const [finalData, setFinalData] = useState([]);

  const makeKey = ({ id_inscripcion, quimestre, parcial }) =>
    `${id_inscripcion}-${quimestre}-${parcial}`;

  const makeKeyQuim = ({ id_inscripcion, quimestre }) =>
    `${id_inscripcion}-${quimestre}`;

  const makeKeyFinal = ({ id_inscripcion }) =>
    `${id_inscripcion}`;

  const handleActualizarParcial1Quim1 = React.useCallback((datos) => {
    setParcial1Quim1Data(datos);
    /*setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });*/
  }, []);


  const handleActualizarParcial2Quim1 = React.useCallback((datos) => {
    setParcial2Quim1Data(datos);
    /*setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });*/
  }, []);

  const handleActualizarParcial1Quim2 = React.useCallback((datos) => {
    setParcial1Quim2Data(datos);
    /*setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });*/
  }, []);

  const handleActualizarParcial2Quim2 = React.useCallback((datos) => {
    setParcial2Quim2Data(datos);
    /*setSavedKeys(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKey(row)));
      return copy;
    });*/
  }, []);

  const handleActualizarQuim1 = React.useCallback((datos) => {
    setQuim1Data(datos);
    /*setSavedKeysQuim(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKeyQuim(row)));
      return copy;
    });*/
  }, []);

  const handleActualizarQuim2 = React.useCallback((datos) => {
    setQuim2Data(datos);
    /*setSavedKeysQuim(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKeyQuim(row)));
      return copy;
    });*/
  }, []);

  const handleActualizarFinal = React.useCallback((datos) => {
    setFinalData(datos);
    /*setSavedKeysFinal(prev => {
      const copy = new Set(prev);
      datos.forEach(row => copy.add(makeKeyFinal(row)));
      return copy;
    });*/
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
  const [savedKeysQuim, setSavedKeysQuim] = useState(new Set());
  const [savedKeysFinal, setSavedKeysFinal] = useState(new Set());

  useEffect(() => {
    const locked = localStorage.getItem("inputsLocked");
    if (locked === "true") {
      setInputsDisabled(true);
    }
  }, []);
  
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
    let isQuimestral = false;
    let isFinal = false;

    // 1) Determinar qué pestaña (Parcial, Quimestral o Final) está activa
    if (activeMainTab === "quimestre1") {
      if (activeSubTabQuim1 === "parcial1-quim1") {
        activeData = parcial1Quim1Data;
      } else if (activeSubTabQuim1 === "parcial2-quim1") {
        activeData = parcial2Quim1Data;
      } else if (activeSubTabQuim1 === "quimestral-quim1") {
        activeData = quim1Data;
        isQuimestral = true;
      }
    } else if (activeMainTab === "quimestre2") {
      if (activeSubTabQuim2 === "parcial1-quim2") {
        activeData = parcial1Quim2Data;
      } else if (activeSubTabQuim2 === "parcial2-quim2") {
        activeData = parcial2Quim2Data;
      } else if (activeSubTabQuim2 === "quimestral-quim2") {
        activeData = quim2Data;
        isQuimestral = true;
      }
    } else if (activeMainTab === "notaFinal") {
      activeData = finalData;
      isFinal = true;
    }

    if (activeData.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Sin datos",
        text: "No hay calificaciones para guardar."
      });
    }

    // ─────────────────────────────────────────────────
    // A) Lógica para parciales y quimestrales (no finales)
    // ─────────────────────────────────────────────────
    if (!isFinal) {
      const newRows = isQuimestral
        ? activeData.filter(row => !savedKeysQuim.has(makeKeyQuim(row)))
        : activeData.filter(row => !savedKeys.has(makeKey(row)));

      if (newRows.length === 0) {
        return Swal.fire({
          icon: "info",
          title: "Los datos ya fueron guardados",
          text: "No se han insertado registros, los datos ya fueron guardados 💾."
        });
      }

      // 1) Definir campos obligatorios según si es quimestral o parcial
      let requiredFields = [];
      if (isQuimestral) {
        // Solo quimestral
        requiredFields = ["examen"];
      } else {
        // Solo parcial
        requiredFields = ["insumo1", "insumo2", "evaluacion", "comportamiento"];
        // O los campos que tú necesites en parciales
      }

      // 2) Verificar que ninguno de los campos requeridos esté vacío o nulo
      const camposVacios = newRows.some(row =>
        requiredFields.some(field => row[field] == null || row[field] === "")
      );
      // Para guardado Parcial de estuidantes
      /*// 1) Dividir los registros en “completos” vs. “incompletos”
      const rowsCompletos = newRows.filter(row => {
        return requiredFields.every(field => row[field] != null && row[field] !== "");
      });
      const rowsIncompletos = newRows.filter(row => {
        return requiredFields.some(field => row[field] == null || row[field] === "");
      });

      // 2) Si no hay ninguno completo, devuelves "Campos vacíos"
      if (rowsCompletos.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor completa todos los campos obligatorios antes de guardar."
      });
    }*/

      if (camposVacios) {
        return Swal.fire({
          icon: "warning",
          title: "Campos vacíos",
          text: "Por favor completa todos los campos obligatorios antes de guardar (Debe ingresar las notas de todos los alumnos)."
        });
      }

      // 3) Realizar el POST

      const endpoint = isQuimestral
        ? `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestrales/bulk`
        : `${import.meta.env.VITE_URL_DEL_BACKEND}/parciales/bulk`;

      axios.post(endpoint, newRows)
        .then((response) => {
          // Verificas el status o el contenido del response
          if (response.status === 201) {
            // Significa que sí se insertaron registros
            Swal.fire({
              icon: "success",
              title: "Guardado",
              text: "Calificaciones guardadas correctamente."
            }).then(() => {setInputsDisabled(true); localStorage.setItem("inputsLocked", "true");});

            // Aquí actualizas tus savedKeys como venías haciendo
            if (isQuimestral) {
              setSavedKeysQuim(prev => {
                const copy = new Set(prev);
                newRows.forEach(r => copy.add(makeKeyQuim(r)));
                return copy;
              });
            } else {
              setSavedKeys(prev => {
                const copy = new Set(prev);
                newRows.forEach(r => copy.add(makeKey(r)));
                return copy;
              });
            }
          }
          else if (
            response.status === 200 &&
            response.data.message === "No se han insertado registros, ya existen."
          ) {
            // Significa que el backend devolvió el mensaje de que NO se insertó nada
            Swal.fire({
              icon: "info",
              title: "Sin cambios",
              text: "Para editar una calificación ya guardada usa el botón ✏️ y guarda con el botón 💾 en Acciones."
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron guardar las calificaciones."
          });
          ErrorMessage(error);
        });

        //mensaje en caso de gurdado parcial de estudiantes
        /*
        // 4) (Opcional) Advertir que hubo otros incompletos
        if (rowsIncompletos.length > 0) {
          Swal.fire({
            icon: "info",
            title: "Registros incompletos",
            text: "Algunos estudiantes no se guardaron porque tenían campos vacíos."
          });
        }*/
      return; // Sale, porque no es Final
    }

    // ─────────────────────────────────────────
    // B) Lógica para Nota Final (Examen Supletorio)
    // ─────────────────────────────────────────
    if (isFinal) {
      // 1) Verificar que quienes estén entre 4 y 6.99 no dejen el supletorio vacío
      const rowsNeedingSupleButEmpty = activeData.filter(row => {
        const promedioAnual = parseFloat(row._promedioAnual) || 0;
        const supleVal = row.examen_recuperacion ?? ""; // Usamos la clave que viene del hijo
        return (promedioAnual >= 4 && promedioAnual < 7 && !supleVal);
      });

      if (rowsNeedingSupleButEmpty.length > 0) {
        return Swal.fire({
          icon: "warning",
          title: "Campos vacíos",
          text: "Los estudiantes con promedio anual entre 4 y 6.99 deben rendir supletorio."
        });
      }

      // 2) Excluir a los que tengan promedio <4 (pierden el año) o ≥7 (no necesitan supletorio)
      //    Solo guardamos a los que realmente tienen supletorio
      const rowsToSave = activeData.filter(row => {
        const promedioAnual = parseFloat(row._promedioAnual) || 0;
        if (promedioAnual < 4 || promedioAnual >= 7) {
          // No se guarda nada para estos casos
          return false;
        }
        // Si está entre 4 y 6.99, retornamos true (los guardamos)
        return true;
      });

      // 3) Si no hay nada que guardar, salimos con un mensaje
      if (rowsToSave.length === 0) {
        return Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No hay supletorios para guardar."
        });
      }

      // 4) Transformar los datos (ej. fila["Examen Supletorio"] => examen_recuperacion)
      const datosFiltrados = rowsToSave.map((row) => ({
        id_inscripcion: row.id_inscripcion,
        examen_recuperacion: row.examen_recuperacion,
      }));

      // 5) Guardar en /finales/bulk
      axios.post(`${import.meta.env.VITE_URL_DEL_BACKEND}/finales/bulk`, datosFiltrados)
        .then((response) => {
          // Revisas el status o el contenido de response
          if (response.status === 201) {
            // Se insertaron registros nuevos
            Swal.fire({
              icon: "success",
              title: "Guardado",
              text: "Examen(es) supletorio(s) guardado(s) correctamente."
            }).then(() => setInputsDisabled(true));

            // Actualizar las “keys” guardadas
            setSavedKeysFinal(prev => {
              const copy = new Set(prev);
              rowsToSave.forEach(r => copy.add(makeKeyFinal(r)));
              return copy;
            });
          }
          else if (
            response.status === 200 &&
            response.data.message === "No se han insertado registros, ya existen."
          ) {
            // El backend indica que no se insertó nada
            Swal.fire({
              icon: "info",
              title: "Sin cambios",
              text: "Para editar una calificación ya guardada usa el botón ✏️ y guarda con el botón 💾 en Acciones."
            });
          }
          else {
            // Cualquier otro status
            Swal.fire({
              icon: "info",
              title: `Status: ${response.status}`,
              text: response.data?.message || "Respuesta no esperada"
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron guardar los supletorios."
          });
          ErrorMessage(error);
        });

      return;
    }
  };

  const handleSidebarNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  if (loading) {
    return <Loading />;
  }

  const handleEditar = (rowIndex, rowData) => {
    console.log("Editar fila:", rowIndex, rowData);
    // Limpiar el flag en localStorage y desbloquear la edición
    localStorage.removeItem("inputsLocked");
    setInputsDisabled(false);
  };
  
  const [estadoFechas, setEstadoFechas] = useState({});
  const [textoRangoFechas, setTextoRangoFechas] = useState({});

  // ✅ Función para convertir "D/M/YYYY" a objeto Date válido
  const parseFecha = (strFecha) => {
    const [dia, mes, anio] = strFecha.split("/");
    return new Date(`${anio}-${mes}-${dia}`);
  };

  useEffect(() => {
    const verificarFechas = async () => {
      const mapping = {
        "parcial1-quim1": "parcial1_quim1",
        "parcial2-quim1": "parcial2_quim1",
        "quimestral-quim1": "quimestre1",
        "parcial1-quim2": "parcial1_quim2",
        "parcial2-quim2": "parcial2_quim2",
        "quimestral-quim2": "quimestre2",
        "notaFinal": "nota_final"
      };
  
      let activeSubTab = null;
      if (activeMainTab === "quimestre1") {
        activeSubTab = activeSubTabQuim1;
      } else if (activeMainTab === "quimestre2") {
        activeSubTab = activeSubTabQuim2;
      } else if (activeMainTab === "notaFinal") {
        activeSubTab = "notaFinal";
      }
  
      const claveDescripcion = mapping[activeSubTab];
      if (!claveDescripcion) return;
  
      try {
        const resp = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/obtener`);
        const data = resp.data;
        const registro = data.find(item => item.descripcion === claveDescripcion);
  
        if (!registro) {
          Swal.fire({
            icon: "warning",
            title: "Fecha por definirse",
            text: "Aún no se han definido las fechas para esta sección.",
          });
  
          setEstadoFechas(prev => ({ ...prev, [activeSubTab]: false }));
          setTextoRangoFechas(prev => ({ ...prev, [activeSubTab]: "" }));
          return;
        }
        
        const fechaResp = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/fecha_actual`);
        const hoy = parseFecha(fechaResp.data.fechaActual);
        const fechaInicio = parseFecha(registro.fecha_inicio);
        const fechaFin = parseFecha(registro.fecha_fin);
  
        const estaDentro = hoy >= fechaInicio && hoy <= fechaFin;
  
        const formatearFecha = (fechaStr) => {
          const [dia, mes, anio] = fechaStr.split("/");
          const diaF = dia.padStart(2, "0");
          const mesF = mes.padStart(2, "0");
          return `${diaF}/${mesF}/${anio}`;
        };
        
        const rangoTexto = `Disponible del ${formatearFecha(registro.fecha_inicio)} al ${formatearFecha(registro.fecha_fin)}`;
        
        setEstadoFechas(prev => ({ ...prev, [activeSubTab]: estaDentro }));
        setTextoRangoFechas(prev => ({ ...prev, [activeSubTab]: rangoTexto }));
  
      } catch (error) {
        console.error("Error al verificar fechas:", error);
        ErrorMessage(error);
        setEstadoFechas(prev => ({ ...prev, [activeSubTab]: false }));
        setTextoRangoFechas(prev => ({ ...prev, [activeSubTab]: "Error al obtener fechas" }));
      }
    };
  
    verificarFechas();
  }, [activeMainTab, activeSubTabQuim1, activeSubTabQuim2]);

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
                  <button className="btn btn-secondary btn-sm" title="Guardar" onClick={handleSave}>
                    <i className="bi bi-save"></i>
                  </button>
                  <button className="btn btn-warning btn-sm text-white" title="Limpiar">
                    <i className="bi bi-trash3-fill"></i>
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
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditar}
                      isWithinRange={estadoFechas["parcial1-quim1"] ?? false}
                      rangoTexto={textoRangoFechas["parcial1-quim1"]}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim1" title="Parcial 2 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={handleActualizarParcial2Quim1}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre1" && activeSubTabQuim1 === "parcial2-quim1"}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditar}
                      isWithinRange={estadoFechas["parcial2-quim1"] ?? false}
                      rangoTexto={textoRangoFechas["parcial2-quim1"]}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim1" title="Quimestre 1">
                    <Quimestral
                      quimestreSeleccionado="1"
                      parcial1Data={parcial1Quim1Data}
                      parcial2Data={parcial2Quim1Data}
                      actualizarDatosQuim={handleActualizarQuim1}
                      datosModulo={datosModulo}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditar}
                      isWithinRange={estadoFechas["quimestral-quim1"] ?? false}
                      rangoTexto={textoRangoFechas["quimestral-quim1"]}
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
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditar}
                      isWithinRange={estadoFechas["parcial1-quim2"] ?? false}
                      rangoTexto={textoRangoFechas["parcial1-quim2"]}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim2" title="Parcial 2 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={handleActualizarParcial2Quim2}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre2" && activeSubTabQuim2 === "parcial2-quim2"}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditar}
                      isWithinRange={estadoFechas["parcial2-quim2"] ?? false}
                      rangoTexto={textoRangoFechas["parcial2-quim2"]}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim2" title="Quimestre 2">
                    <Quimestral
                      quimestreSeleccionado="2"
                      parcial1Data={parcial1Quim2Data}
                      parcial2Data={parcial2Quim2Data}
                      actualizarDatosQuim={handleActualizarQuim2}
                      datosModulo={datosModulo}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditar}
                      isWithinRange={estadoFechas["quimestral-quim2"] ?? false}
                      rangoTexto={textoRangoFechas["quimestral-quim2"]}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* NOTA FINAL */}
              <Tab eventKey="notaFinal" title="Nota Final">
                <div className="tab-pane active">
                  <Final
                    quim1Data={quim1Data}
                    quim2Data={quim2Data}
                    datosModulo={datosModulo}
                    actualizarDatosFinal={handleActualizarFinal}
                    inputsDisabled={inputsDisabled}
                    onEditar={handleEditar}
                    isWithinRange={estadoFechas["notaFinal"] ?? false}
                    rangoTexto={textoRangoFechas["notaFinal"]}
                  />
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
