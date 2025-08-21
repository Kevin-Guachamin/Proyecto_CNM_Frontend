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

  // ======= Obtener docentes con paginación fija =======
  useEffect(() => {
    let mounted = true;
    const fetchDocentes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/docente/obtener`, {
          params: { page, limit: ITEMS_PER_PAGE },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setDocentes(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDocentes();
    return () => {
      mounted = false;
    };
  }, [page, API_URL, token]);

  // ======= Filtros =======
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // ======= Filtrar datos =======
  const filteredData = docentes.filter((docente) =>
    docente[filterKey]?.toLowerCase().includes(search.toLowerCase())
  );

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
                  data={filteredData}
                  setData={setDocentes}
                  headers={headers}
                  columnsToShow={colums}
                  filterKey={filterKey}
                  apiEndpoint={"docente"}
                  CrearEntidad={CrearDocente}
                  PK={PK}
                />
              </div>
              
              <div className="docentes-pagination" ref={pagerRef}>
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
