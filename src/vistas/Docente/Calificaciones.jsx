import React, { useState, useEffect } from "react";
import Notas from "./Notas";
import NotasBE from "./BasicoElemental/NotasBE";
import { Home, Users, Settings } from "lucide-react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { handleExportExcel, handleExportPDF, parseFecha, handleEditar as ejecutarHandleEditar } from "./FuncionesCalificaciones";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import axios from "axios";
import Swal from "sweetalert2";
import "./Calificaciones.css";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../getModulos";
import { useAuth } from "../../Utils/useAuth";

function Calificaciones() {

  // Protección de ruta - permitir acceso a Profesores y Secretarias
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detectar si es acceso de secretaria basado en la ruta
  const isSecretariaAccess = location.pathname.includes('/secretaria/');
  
  // Aplicar protección de rol según el contexto
  const auth = useAuth(isSecretariaAccess ? "Secretaria" : "Profesor");
  
  // Si no está autenticado, no renderizar nada (el hook maneja la redirección)
  if (!auth.isAuthenticated) {
    return null;
  }

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const moduloSeleccionado = location.state;
  const [parcial1Quim1Data, setParcial1Quim1Data] = useState([]);
  const [parcial2Quim1Data, setParcial2Quim1Data] = useState([]);
  const [parcial1Quim2Data, setParcial1Quim2Data] = useState([]);
  const [parcial2Quim2Data, setParcial2Quim2Data] = useState([]);
  const [quim1Data, setQuim1Data] = useState([]);
  const [quim2Data, setQuim2Data] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState("quimestre1");
  const [activeSubTabQuim1, setActiveSubTabQuim1] = useState("parcial1-quim1");
  const [activeSubTabQuim2, setActiveSubTabQuim2] = useState("parcial1-quim2");
  const [datosModulo, setDatosModulo] = useState(moduloSeleccionado || {});
  const [estadoFechas, setEstadoFechas] = useState({});
  const [textoRangoFechas, setTextoRangoFechas] = useState({});
  const soloLectura = usuario?.subRol?.toLowerCase() === "secretaria";
  const [solicitudAceptada, setSolicitudAceptada] = useState(null);
  const [solicitudEnRango, setSolicitudEnRango] = useState(false);

  const getRangoValido = (clave) => {
    return estadoFechas[clave] || (solicitudAceptada?.descripcion === clave);
  };
  
  const obtenerParcialBE = (subtab) => {
    if (subtab.includes("parcial1")) return "P1";
    if (subtab.includes("parcial2")) return "P2";
    return "??";
  };
  
  const makeKey = ({ id_inscripcion, quimestre, parcial }) => {
    const esBe = datosModulo?.nivel?.toLowerCase().includes("be");
    if (esBe) {
      const tab = activeMainTab === "quimestre1" ? "Q1" :
                  activeMainTab === "quimestre2" ? "Q2" : "FINAL";
      const subtab = activeMainTab === "quimestre1" ? activeSubTabQuim1 :
                     activeMainTab === "quimestre2" ? activeSubTabQuim2 : "";
      const parcialBE = obtenerParcialBE(subtab);
      return `${id_inscripcion}-${tab}-${parcialBE}`;
    }
    return `${id_inscripcion}-${quimestre}-${parcial}`;
  };  
  
  const makeKeyQuim = ({ id_inscripcion, quimestre }) => {
    const esBe = datosModulo?.nivel?.toLowerCase().includes("be");
    if (esBe) {
      const tab =
        activeMainTab === "quimestre1" ? "Q1" :
        activeMainTab === "quimestre2" ? "Q2" :
        "FINAL";
      return `${id_inscripcion}-${tab}-QUIMESTRAL`;
    }
    return `${id_inscripcion}-${quimestre}`;
  };
  
  const makeKeyFinal = ({ id_inscripcion }) => `${id_inscripcion}`;
  
  const [savedKeys, setSavedKeys] = useState(new Set());
  const [savedKeysQuim, setSavedKeysQuim] = useState(new Set());
  const [savedKeysFinal, setSavedKeysFinal] = useState(new Set());

  const handleActualizarParcial1Quim1 = React.useCallback((datos) => {
    setParcial1Quim1Data(datos);
  }, []);
  const handleActualizarParcial2Quim1 = React.useCallback((datos) => {
    setParcial2Quim1Data(datos);
  }, []);
  const handleActualizarParcial1Quim2 = React.useCallback((datos) => {
    setParcial1Quim2Data(datos);
  }, []);
  const handleActualizarParcial2Quim2 = React.useCallback((datos) => {
    setParcial2Quim2Data(datos);
  }, []);
  const handleActualizarQuim1 = React.useCallback((datos) => {
    setQuim1Data(datos);
  }, []);
  const handleActualizarQuim2 = React.useCallback((datos) => {
    setQuim2Data(datos);
  }, []);
  const handleActualizarFinal = React.useCallback((datos) => {
    setFinalData(datos);
  }, []);

  const modules = React.useMemo(() => {
    if (!usuario) return [];

    const esSecretaria = usuario.subRol?.toLowerCase() === "secretaria";
    
    if (esSecretaria) {
      // Para secretarias, usar los módulos reales de Secretaria
      return transformModulesForLayout(getModulos("Secretaria", true));
    } else {
      // Para profesores, usar los módulos estándar
      return transformModulesForLayout(getModulos("Profesor", true));
    }
  }, [usuario]);

  useEffect(() => {
    if (localStorage.getItem("inputsLocked") === null) {
      localStorage.setItem("inputsLocked", "false");
    }
  }, []);

  useEffect(() => {
    const obtenerSolicitud = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/solicitud/ultima/obtener`);
        const solicitud = resp.data;
        setSolicitudAceptada(solicitud);
    
        // Obtener fecha actual del backend
        const fechaResp = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/fecha_actual`);
        const hoy = parseFecha(fechaResp.data.fechaActual);
        const fechaInicio = parseFecha(solicitud.fecha_inicio);
        const fechaFin = parseFecha(solicitud.fecha_fin);
        const dentroDeRango = hoy >= fechaInicio && hoy <= fechaFin;
    
        setSolicitudEnRango(dentroDeRango);
      } catch (error) {
        console.log("No hay solicitud aprobada o falló la petición");
        setSolicitudAceptada(null);
        setSolicitudEnRango(false);
      }
    };    
    obtenerSolicitud();
  }, []);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken && moduloSeleccionado) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setUsuario(JSON.parse(storedUser));
      setDatosModulo(moduloSeleccionado);
    } else {
      navigate("/profesor/panelcursos"); // Si falta módulo seleccionado o usuario/token, regresamos.
    }
  }, [moduloSeleccionado, navigate]);

  // Función para guardar datos del tab activo
  const handleSave = () => {
    let activeData = [];
    let isQuimestral = false;
    let isFinal = false;
    const esBe = datosModulo?.nivel?.toLowerCase().includes("be");

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
    // A) Lógica para parciales y quimestrales (no finales)
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
        requiredFields = ["insumo1", "insumo2", "evaluacion"];
        if (!esBe) {
          requiredFields.push("comportamiento"); // Solo si NO es BE
        }
      }
      // 2) Verificar que ninguno de los campos requeridos esté vacío o nulo
      const camposVacios = newRows.some(row =>
        requiredFields.some(field => {
          if (field === "comportamiento") {
            // Validamos cada elemento dentro del array de comportamiento
            return !Array.isArray(row[field]) || row[field].some(v => v == null || v === "");
          } else {
            return row[field] == null || row[field] === "";
          }
        })
      );
      if (camposVacios) {
        return Swal.fire({
          icon: "warning",
          title: "Campos vacíos",
          text: "Por favor completa todos los campos obligatorios antes de guardar (Debe ingresar las notas de todos los alumnos)."
        });
      }
      // 3) Realizar el POST
      const endpoint = esBE
        ? isQuimestral
          ? `${import.meta.env.VITE_URL_DEL_BACKEND}/quimestralesbe/bulk`
          : `${import.meta.env.VITE_URL_DEL_BACKEND}/parcialesbe/bulk`
        : isQuimestral
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
            }).then(() => { setInputsDisabled(true); localStorage.setItem("inputsLocked", "true"); });
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
      return; // Sale, porque no es Final
    }
    // B) Lógica para Nota Final (Examen Supletorio)
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
      const rowsToSave = activeData.filter(row => {
        const promedioAnual = parseFloat(row._promedioAnual) || 0;
        if (promedioAnual < 4 || promedioAnual >= 7) {
          return false;
        }
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
            Swal.fire({
              icon: "info",
              title: "Sin cambios",
              text: "Para editar una calificación ya guardada usa el botón ✏️ y guarda con el botón 💾 en Acciones."
            });
          }
          else {
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
    if (!path) return;
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  if (loading) {
    return <Loading />;
  }

  const [forceEdit, setForceEdit] = useState(false);
  // Al cambiar de pestaña o subpestaña, volvemos a bloquear los inputs globalmente:
  useEffect(() => {
    setForceEdit(false);
    setInputsDisabled(true);
  }, [activeMainTab, activeSubTabQuim1, activeSubTabQuim2]);

  const tieneDatosGuardados = () => {
    const tieneCamposLlenos = (data, campos) =>
      data.length > 0 && data.every(row =>
        campos.every(campo => row[campo] !== null && row[campo] !== "")
      );
    if (activeMainTab === "quimestre1") {
      if (activeSubTabQuim1 === "parcial1-quim1") {
        return tieneCamposLlenos(parcial1Quim1Data, ["insumo1", "insumo2", "evaluacion", "comportamiento"]);
      } else if (activeSubTabQuim1 === "parcial2-quim1") {
        return tieneCamposLlenos(parcial2Quim1Data, ["insumo1", "insumo2", "evaluacion", "comportamiento"]);
      } else if (activeSubTabQuim1 === "quimestral-quim1") {
        return tieneCamposLlenos(quim1Data, ["examen"]);
      }
    } else if (activeMainTab === "quimestre2") {
      if (activeSubTabQuim2 === "parcial1-quim2") {
        return tieneCamposLlenos(parcial1Quim2Data, ["insumo1", "insumo2", "evaluacion", "comportamiento"]);
      } else if (activeSubTabQuim2 === "parcial2-quim2") {
        return tieneCamposLlenos(parcial2Quim2Data, ["insumo1", "insumo2", "evaluacion", "comportamiento"]);
      } else if (activeSubTabQuim2 === "quimestral-quim2") {
        return tieneCamposLlenos(quim2Data, ["examen"]);
      }
    } else if (activeMainTab === "notaFinal") {
      return tieneCamposLlenos(finalData, ["examen_recuperacion"]);
    }
    return false;
  };

  const handleEditar = () => {
    ejecutarHandleEditar({
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
    });
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
        // Obtener las fechas definidas en el backend
        const resp = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/obtener_todo`);
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
        // Obtener la fecha actual del backend
        const fechaResp = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/fecha_actual`);
        const hoy = parseFecha(fechaResp.data.fechaActual);
        const fechaInicio = parseFecha(registro.fecha_inicio);
        const fechaFin = parseFecha(registro.fecha_fin);
        const estaDentro = hoy >= fechaInicio && hoy <= fechaFin;
        const formatearFecha = (fechaStr) => {
          const [anio, mes, dia] = fechaStr.split("-");
          const diaF = dia.padStart(2, "0");
          const mesF = mes.padStart(2, "0");
          return `${diaF}/${mesF}/${anio}`;
        };
        const rangoTexto = `Disponible del ${formatearFecha(registro.fecha_inicio)} al ${formatearFecha(registro.fecha_fin)}`;
        setEstadoFechas(prev => ({ ...prev, [activeSubTab]: estaDentro }));
        setTextoRangoFechas(prev => ({ ...prev, [activeSubTab]: rangoTexto }));
      } catch (error) {
        ErrorMessage(error);
        setEstadoFechas(prev => ({ ...prev, [activeSubTab]: false }));
        setTextoRangoFechas(prev => ({ ...prev, [activeSubTab]: "Error al obtener fechas" }));
      }
    };
    verificarFechas();
  }, [activeMainTab, activeSubTabQuim1, activeSubTabQuim2]);

  const handleEditarFila = (rowIndex, rowData) => {
    localStorage.removeItem("inputsLocked");
    setInputsDisabled(false);
  };

  const esBE = datosModulo?.nivel?.toLowerCase().includes("be");

  const ComponenteNotas = esBE ? NotasBE : Notas;

  return (
    <ComponenteNotas
      usuario={usuario}
      modules={modules}
      datosModulo={datosModulo}
      handleSidebarNavigation={handleSidebarNavigation}
      handleExportExcel={handleExportExcel}
      handleExportPDF={handleExportPDF}
      handleSave={handleSave}
      handleEditar={handleEditar}
      forceEdit={forceEdit}
      inputsDisabled={inputsDisabled}
      estadoFechas={estadoFechas}
      textoRangoFechas={textoRangoFechas}
      activeMainTab={activeMainTab}
      activeSubTabQuim1={activeSubTabQuim1}
      activeSubTabQuim2={activeSubTabQuim2}
      setActiveMainTab={setActiveMainTab}
      setActiveSubTabQuim1={setActiveSubTabQuim1}
      setActiveSubTabQuim2={setActiveSubTabQuim2}
      parcial1Quim1Data={parcial1Quim1Data}
      parcial2Quim1Data={parcial2Quim1Data}
      parcial1Quim2Data={parcial1Quim2Data}
      parcial2Quim2Data={parcial2Quim2Data}
      quim1Data={quim1Data}
      quim2Data={quim2Data}
      finalData={finalData}
      handleActualizarParcial1Quim1={handleActualizarParcial1Quim1}
      handleActualizarParcial2Quim1={handleActualizarParcial2Quim1}
      handleActualizarParcial1Quim2={handleActualizarParcial1Quim2}
      handleActualizarParcial2Quim2={handleActualizarParcial2Quim2}
      handleActualizarQuim1={handleActualizarQuim1}
      handleActualizarQuim2={handleActualizarQuim2}
      handleActualizarFinal={handleActualizarFinal}
      handleEditarFila={handleEditarFila}
      soloLectura={soloLectura}
      getRangoValido={getRangoValido}
    />
  );
}

export default Calificaciones;