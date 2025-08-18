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

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);

  const [modulos, setModulos] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["Descripción", "Fecha inicio", "Fecha fin", "Estado", "Acciones"];
  const colums  = ["descripcion", "fecha_inicio", "fecha_fin", "estado"];
  const filterKey = "descripcion";
  const PK = "ID";

  // Refs para calcular espacio visible y la altura real de la paginación
  const wrapperRef = useRef(null);
  const pagerRef = useRef(null);
  const [pagerH, setPagerH] = useState(64); // altura aproximada de paginación

  // ✅ Autenticación + módulos
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

  // ✅ Medir altura real de la barra de paginación y exponerla como CSS var
  useEffect(() => {
    const updatePagerH = () => {
      const h = pagerRef.current ? pagerRef.current.offsetHeight : 64;
      const padded = h + 16; // respiro
      setPagerH(padded);
      document.documentElement.style.setProperty("--pager-h", `${padded}px`);
    };
    updatePagerH();

    const ro = new ResizeObserver(updatePagerH);
    if (pagerRef.current) ro.observe(pagerRef.current);
    window.addEventListener("resize", updatePagerH);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePagerH);
    };
  }, []);

  // ✅ Calcular LIMIT según espacio disponible en viewport (sin scroll interno)
  useEffect(() => {
    const calcRows = () => {
      const ROW_H = 50; // alto aprox. por fila
      const GAP = 24;

      const top = wrapperRef.current
        ? wrapperRef.current.getBoundingClientRect().top
        : 0;

      const available = window.innerHeight - top - pagerH - GAP;
      const rows = Math.max(5, Math.floor(available / ROW_H));
      setLimit(rows);
    };
    calcRows();

    const onResize = () => requestAnimationFrame(calcRows);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pagerH]);

  // ✅ Si cambia el limit (por resize), volver a la página 1
  useEffect(() => {
    if (limit) setPage(1);
  }, [limit]);

  // ✅ Traer periodos (page/limit)
  useEffect(() => {
    if (!limit) return;

    let mounted = true;
    const fetchPeriodos = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/periodo_academico/obtener`, {
          params: { page, limit },
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
  }, [page, limit, API_URL, token]);

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
            <>
              {/* Zona tabla + paginación con el mismo patrón que Cursos */}
              <div className="tabla-layout">
                <div className="tabla-wrapper" ref={wrapperRef}>
                  <Contenedor
                    data={periodos}
                    setData={setPeriodos}
                    headers={headers}
                    columnsToShow={colums}
                    filterKey={filterKey}
                    apiEndpoint={"periodo_academico"}
                    CrearEntidad={CrearPeriodo}
                    PK={PK}

                    /* paginación externa (abajo): NO pasamos Paginación aquí */
                    limit={limit}
                    page={page}
                    setTotalPages={setTotalPages}
                    setPage={setPage}
                  />
                </div>

                <div className="pagination-bar" ref={pagerRef}>
                  {periodos.length > 0 && (
                    <Paginación totalPages={totalPages} page={page} setPage={setPage} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default Index;
