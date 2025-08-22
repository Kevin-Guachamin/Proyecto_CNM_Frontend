import React, { useEffect, useRef, useState } from "react";
import Header from "../../../../../components/Header";
import Layout from "../../../../../layout/Layout";
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import {
  moduloInicio,
  modulesSettingsBase,
  construirModulosConPrefijo,
} from "../../../Components/Modulos";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import CrearDocente from "./CrearDocente";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paginación from "../../../Components/Paginación";
import '../../../Styles/TablasResponsivas.css';

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [modulos, setModulos] = useState([]);

  // paginación y filtros - PAGINACIÓN FIJA
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // FIJO - no más recálculos dinámicos
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const headers = [
    "Cédula/Pasaporte",
    "Primer nombre",
    "Primer Apellido",
    "Segundo Nombre",
    "Segundo Apellido",
    "Email",
    "Celular",
    "Rol",
    "Acciones",
  ];
  const colums = [
    "nroCedula",
    "primer_nombre",
    "primer_apellido",
    "segundo_nombre",
    "segundo_apellido",
    "email",
    "celular",
    "rol",
  ];
  const filterKey = "primer_nombre";
  const PK = "nroCedula";

  // refs - solo para paginación
  const pagerRef = useRef(null);
  const [pagerH, setPagerH] = useState(70);

  // ======= Auth + módulos =======
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/");
      return;
    }
    setUsuario(parsedUser);

    const modulosDinamicos = [
      moduloInicio,
      ...construirModulosConPrefijo(parsedUser.subRol, modulesSettingsBase),
    ];
    setModulos(modulosDinamicos);
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

  // ======= Obtener docentes - carga inicial completa =======
  useEffect(() => {
    let mounted = true;
    const fetchDocentes = async () => {
      try {
        setLoading(true);
        // Cargar TODOS los docentes de una vez para filtrar en frontend
        const { data } = await axios.get(`${API_URL}/docente/obtener`, {
          params: { page: 1, limit: 1000 }, // Límite alto para obtener todos
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setDocentes(data.data ?? []);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Solo cargar una vez al inicio
    if (docentes.length === 0) {
      fetchDocentes();
    }
    return () => {
      mounted = false;
    };
  }, [API_URL, token]); // Removido 'page' para evitar recargas

  // ======= Filtros =======
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Volver a la primera página cuando cambie el filtro/búsqueda
  useEffect(() => {
    setPage(1);
  }, [search, filterKey]);

  // ======= Filtrar datos (frontend) =======
  const filteredData = docentes.filter((docente) => {
    if (!search.trim()) return true;
    const val = docente[filterKey];
    if (val && val.toString().toLowerCase().includes(search.toLowerCase())) return true;
    const nombreCompleto = `${docente.primer_nombre || ''} ${docente.segundo_nombre || ''} ${docente.primer_apellido || ''} ${docente.segundo_apellido || ''}`.toLowerCase();
    return nombreCompleto.includes(search.toLowerCase());
  });

  // Paginación local sobre datos filtrados
  const totalFilteredPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Asegurar que la página actual no exceda el total de páginas filtradas
  useEffect(() => {
    if (page > totalFilteredPages) {
      setPage(totalFilteredPages);
    }
  }, [totalFilteredPages]);

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        <div className="vista-docentes">
          {loading ? (
            <Loading />
          ) : (
            <div className="docentes-container">
              <div className="docentes-content">
                <Contenedor
                  search={search}
                  filtrar={handleSearch}
                  data={pageData}
                  setData={setDocentes}
                  headers={headers}
                  columnsToShow={colums}
                  filterKey={filterKey}
                  apiEndpoint={"docente"}
                  CrearEntidad={CrearDocente}
                  PK={PK}
                  // Evitar llamadas al backend durante el filtro
                  avoidBackendFilter={true}
                  externalSearch={search}
                  onFilterChange={handleSearch}
                />
              </div>
              
              <div className="docentes-pagination" ref={pagerRef}>
                {totalFilteredPages > 1 && (
                  <Paginación totalPages={totalFilteredPages} page={page} setPage={setPage} />
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default Index;
