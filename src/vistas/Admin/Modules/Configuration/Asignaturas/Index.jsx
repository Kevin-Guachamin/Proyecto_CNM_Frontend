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

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);

  const [search, setSearch] = useState("");
  const [modulos, setModulos] = useState([]);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["ID", "Nivel", "Nombre", "Tipo", "Edad mínima", "Acciones"];
  const colums = ["ID", "nivel", "nombre", "tipo", "edadMin"];
  const filterKey = "nombre";
  const PK = "ID";

  // Refs para aplicar el patrón de tabla + paginación externa
  const wrapperRef = useRef(null);
  const pagerRef = useRef(null);
  const [pagerH, setPagerH] = useState(70); // alto real de la barra de paginación

  // ✅ Verificar usuario autenticado + módulos
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

  // ✅ Medir altura real de la paginación (para que nunca tape las últimas filas)
  useEffect(() => {
    const updatePagerH = () => {
      const h = pagerRef.current ? pagerRef.current.offsetHeight : 70;
      setPagerH(h + 16); // un poco de respiro
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

  // ✅ Calcular limit por ALTO disponible (sin scroll vertical interno)
  useEffect(() => {
    const calcRows = () => {
      const ROW_H = 69; // alto aprox de fila
      const GAP = 30;

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

  // ✅ Si cambia el limit (por resize), vuelve a la página 1
  useEffect(() => {
    if (limit) setPage(1);
  }, [limit]);

  // ✅ Obtener asignaturas (page/limit/search) con debounce
  useEffect(() => {
    if (!limit) return;

    const delay = setTimeout(() => {
      const fetchAsignaturas = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_URL}/materia/obtener`, {
            params: { page, limit, search },
            headers: { Authorization: `Bearer ${token}` },
          });
          setAsignaturas(data.data ?? []);
          setTotalPages(data.totalPages ?? 1);
        } catch (error) {
          ErrorMessage(error);
        } finally {
          setLoading(false);
        }
      };

      fetchAsignaturas();
    }, 350);

    return () => clearTimeout(delay);
  }, [page, limit, search, API_URL, token]);

  // 🔎 handler del filtro
  const handleSearchChange = (e) => {
    const value = e?.target?.value ?? "";
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        {loading ? (
          <Loading />
        ) : (
          // ⬇️ Usamos las clases de Contenedor.css: .tabla-layout / .tabla-wrapper / .pagination-bar
          <div className="tabla-layout">
            <div className="tabla-wrapper" ref={wrapperRef}>
              <Contenedor
                data={asignaturas}
                setData={setAsignaturas}
                headers={headers}
                columnsToShow={colums}
                filterKey={filterKey}
                apiEndpoint="materia"
                CrearEntidad={CrearAsignatura}
                PK={PK}
                // 👇 La paginación va afuera; aquí NO pasamos <Paginación />
                page={page}
                limit={limit}
                setTotalPages={setTotalPages}
                setPage={setPage}
                // filtro controlado
                search={search}
                filtrar={handleSearchChange}
              />
            </div>

            <div className="pagination-bar" ref={pagerRef}>
              {asignaturas.length > 0 && (
                <Paginación totalPages={totalPages} page={page} setPage={setPage} />
              )}
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default Index;
