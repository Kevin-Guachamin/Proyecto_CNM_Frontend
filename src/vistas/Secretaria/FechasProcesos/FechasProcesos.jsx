import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import axios from "axios";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import CrearProceso from "./CrearProceso";
import Filtro from "../../Admin/Components/Filtro";
import Tabla from "../../Admin/Components/Tabla";
import Paginación from "../../Admin/Components/Paginación";
import Swal from "sweetalert2";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import { Eliminar } from "../../../Utils/CRUD/Eliminar";
import "../../Admin/Styles/TablasResponsivas.css";
import "./FechasProcesos.css";

function FechasProcesos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [allProcesos, setAllProcesos] = useState([]); // Todos los datos sin paginar
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);

  // Paginación y filtros - PAGINACIÓN FIJA
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // FIJO - no más recálculos dinámicos
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [procesoToUpdate, setProcesoToUpdate] = useState(null);
  const filterKey = "proceso";

  // refs - solo para paginación
  const pagerRef = useRef(null);
  const [pagerH, setPagerH] = useState(70);

  // ======= Auth + módulos =======
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      setModules(transformModulesForLayout(getModulos(parsedUser.subRol, true)));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // ======= Paginación - altura del paginador =======
  useEffect(() => {
    const updatePagerH = () => {
      const h = pagerRef.current ? pagerRef.current.offsetHeight : 70;
      setPagerH(h);
    };
    updatePagerH();

    const onResize = () => requestAnimationFrame(updatePagerH);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const parseFecha = (strFecha) => {
    if (!strFecha) return "";
    const [year, month, day] = strFecha.split("-");
    return `${day}/${month}/${year}`;
  };

  // ======= Obtener todos los procesos (solo una vez) =======
  useEffect(() => {
    let mounted = true;
    const fetchAllProcesos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/obtener_todo`);
        
        if (!mounted) return;
        
        // Transformar todos los datos
        const allData = response.data.map(item => ({
          ...item,
          fecha_inicio: parseFecha(item.fecha_inicio),
          fecha_fin: parseFecha(item.fecha_fin)
        }));
        
        setAllProcesos(allData);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAllProcesos();
    return () => {
      mounted = false;
    };
  }, []); // Solo se ejecuta una vez al montar

  // ======= Manejar filtrado y paginación =======
  useEffect(() => {
    if (allProcesos.length === 0) return;

    // Filtrar datos
    const filteredData = allProcesos.filter(p =>
      p.proceso?.toLowerCase().includes(search.toLowerCase())
    );
    
    // Calcular paginación
    const totalFilteredPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    setTotalPages(totalFilteredPages);
    
    // Si la página actual es mayor que el total de páginas, resetear a la primera
    const currentPage = page > totalFilteredPages ? 1 : page;
    if (currentPage !== page) {
      setPage(currentPage);
      return;
    }
    
    // Paginar datos filtrados
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    setProcesos(paginatedData);
  }, [allProcesos, search, page]);

  const handleAddProceso = () => {
    setProcesoToUpdate(null);
    setShowModal(true);
  };

  const handleEditProceso = (proceso) => {
    setProcesoToUpdate(proceso);
    setShowModal(true);
  };

  const handleDeleteProceso = async (proceso) => {
    try {
      const URL = `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/eliminar`;
      await Eliminar(proceso, URL, proceso.proceso, setAllProcesos, "ID");
      // Recargar todos los datos después de eliminar
      const response = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/obtener_todo`);
      const allData = response.data.map(item => ({
        ...item,
        fecha_inicio: parseFecha(item.fecha_inicio),
        fecha_fin: parseFecha(item.fecha_fin)
      }));
      setAllProcesos(allData);
      setPage(1); // Volver a la primera página
    } catch (error) {
      ErrorMessage(error);
    }
  };

  const handleSaveProceso = async (data) => {
    try {
      setLoading(true);
      if (procesoToUpdate) {
        await axios.put(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/editar/${procesoToUpdate.ID}`, data);
        Swal.fire("Actualizado", "El proceso fue actualizado correctamente", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/crear`, data);
        Swal.fire("Creado", "El proceso fue creado correctamente", "success");
      }
      
      // Recargar todos los datos después de crear/actualizar
      const response = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/obtener_todo`);
      const allData = response.data.map(item => ({
        ...item,
        fecha_inicio: parseFecha(item.fecha_inicio),
        fecha_fin: parseFecha(item.fecha_fin)
      }));
      setAllProcesos(allData);
      setPage(1); // Volver a la primera página
      setSearch(""); // Limpiar búsqueda
      setProcesoToUpdate(null);
      setShowModal(false);
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setProcesoToUpdate(null);
    setShowModal(false);
  };

  // ======= Filtros =======
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Resetear a la primera página cuando cambia el filtro
  };

  // Los datos ya están filtrados y paginados en el useEffect

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules}>
        <div className="vista-procesos">
          {loading ? (
            <Loading />
          ) : (
            <div className="procesos-container">
              <div className="procesos-content">
                <h2 className="mb-4">Administrar Fechas de Procesos</h2>
                <Filtro
                  search={search}
                  filtrar={handleSearch}
                  toggleModal={handleAddProceso}
                  filterKey={filterKey}
                />
                <Tabla
                  key={procesos.length}
                  filteredData={procesos}
                  OnEdit={handleEditProceso}
                  OnDelete={handleDeleteProceso}
                  headers={["Proceso", "Fecha Inicio", "Fecha Fin", "Acciones"]}
                  columnsToShow={["proceso", "fecha_inicio", "fecha_fin"]}
                />
              </div>
              
              <div className="procesos-pagination" ref={pagerRef}>
                {totalPages > 1 && (
                  <Paginación totalPages={totalPages} page={page} setPage={setPage} />
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>

      {showModal && (
        <CrearProceso
          onCancel={handleCancelModal}
          entityToUpdate={procesoToUpdate}
          onSave={handleSaveProceso}
        />
      )}
    </div>
  );
}

export default FechasProcesos;