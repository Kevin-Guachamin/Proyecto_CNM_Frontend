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
import CrearAsignatura from "./CrearAsignatura";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Paginación from "../../../Components/Paginación";
import '../../../Styles/TablasResponsivas.css';

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);

  // paginación y filtros - PAGINACIÓN FIJA
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // FIJO - no más recálculos dinámicos
  const [search, setSearch] = useState("");

  const [modulos, setModulos] = useState([]);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["ID", "Nivel", "Nombre", "Tipo", "Edad mínima", "Acciones"];
  const colums = ["ID", "nivel", "nombre", "tipo", "edadMin"];
  const filterKey = "nombre";
  const PK = "ID";

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

  // ======= Obtener asignaturas con paginación fija (solo carga inicial) =======
  useEffect(() => {
    let mounted = true;
    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/materia/obtener`, {
          params: { page: 1, limit: ITEMS_PER_PAGE }, // Siempre página 1 inicial
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setAsignaturas(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Solo cargar datos iniciales una vez
    if (asignaturas.length === 0) {
      const t = setTimeout(fetchAsignaturas, 300);
      return () => { mounted = false; clearTimeout(t); };
    }
    
    return () => { mounted = false; };
  }, [API_URL, token, ITEMS_PER_PAGE]); // Removido 'page' para evitar re-cargas

  // ======= Filtros =======
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // ======= Reset a página 1 cuando cambie el filtro =======
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        <div className="vista-asignaturas" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: 'calc(100vh - 60px)' 
        }}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Contenido con scroll solo en la tabla */}
              <div style={{ 
                flex: '1', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Contenedor
                  search={search}
                  filtrar={handleSearch}
                  data={asignaturas} // ✅ Datos sin filtrar - Contenedor maneja el search
                  setData={setAsignaturas}
                  setTotalPages={setTotalPages} // ✅ Pasamos setTotalPages
                  headers={headers}
                  columnsToShow={colums}
                  filterKey={filterKey}
                  apiEndpoint="materia"
                  CrearEntidad={CrearAsignatura}
                  PK={PK}
                  page={page} // ✅ Pasamos page
                  limit={ITEMS_PER_PAGE} // ✅ Pasamos limit
                />
              </div>
              
              {/* Paginación fija en la parte inferior */}
              <div style={{ 
                flexShrink: 0,
                padding: '15px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }} ref={pagerRef}>
                {totalPages > 1 && (
                  <Paginación totalPages={totalPages} page={page} setPage={setPage} />
                )}
              </div>
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default Index;
