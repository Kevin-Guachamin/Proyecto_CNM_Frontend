import React, { useEffect, useRef, useState } from "react";
import Header from "../../../../../components/Header";
import Layout from "../../../../../layout/Layout";
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { moduloInicio, modulesSettingsBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import CrearPeriodo from "./CrearPeriodo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paginación from "../../../Components/Paginación";
import '../../../Styles/TablasResponsivas.css';

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos] = useState([]);

  // paginación y filtros - PAGINACIÓN FIJA
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // FIJO - no más recálculos dinámicos
  const [search, setSearch] = useState("");

  const [modulos, setModulos] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["Descripción", "Fecha inicio", "Fecha fin", "Estado", "Acciones"];
  const colums  = ["descripcion", "fecha_inicio", "fecha_fin", "estado"];
  const filterKey = "descripcion";
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

  // ======= Obtener períodos con paginación fija =======
  useEffect(() => {
    let mounted = true;
    const fetchPeriodos = async () => {
      try {
        setLoading(true);
        // Si hay búsqueda activa, no sobreescribir datos filtrados desde Contenedor
        if (search && search.trim().length > 0) {
          if (mounted) setLoading(false);
          return;
        }
        const { data } = await axios.get(`${API_URL}/periodo_academico/obtener`, {
          params: { page, limit: ITEMS_PER_PAGE },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setPeriodos(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPeriodos();
    return () => {
      mounted = false;
    };
  }, [page, API_URL, token]);

  // ======= Filtros =======
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Resetear a la primera página cuando cambia el filtro
  };

  // ======= Filtrar datos =======
  const filteredData = periodos.filter((periodo) =>
    periodo[filterKey]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        <div className="vista-periodos">
          {loading ? (
            <Loading />
          ) : (
            <div className="periodos-container">
              <div className="periodos-content">
                <Contenedor
                  data={periodos}
                  setData={setPeriodos}
                  headers={headers}
                  columnsToShow={colums}
                  filterKey={filterKey}
                  apiEndpoint={"periodo_academico"}
                  CrearEntidad={CrearPeriodo}
                  PK={PK}
                  page={page}
                  limit={ITEMS_PER_PAGE}
                  setTotalPages={setTotalPages}
                  // Mantener el filtro entre páginas y evitar sobrescritura
                  externalSearch={search}
                  onFilterChange={handleSearch}
                />
              </div>
              
              <div className="periodos-pagination" ref={pagerRef}>
                {totalPages > 1 && (
                  <Paginación totalPages={totalPages} page={page} setPage={setPage} />
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
