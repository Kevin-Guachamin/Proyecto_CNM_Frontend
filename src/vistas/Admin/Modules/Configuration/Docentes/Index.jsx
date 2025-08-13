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

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [modulos, setModulos] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);

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

  // Refs para el patrón tabla + paginación externa
  const wrapperRef = useRef(null);
  const pagerRef = useRef(null);
  const [pagerH, setPagerH] = useState(70); // alto real de la paginación (+respiro)

  // ✅ Autenticación y módulos
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

  // ✅ Medir altura real de la barra de paginación (para no tapar filas)
  useEffect(() => {
    const updatePagerH = () => {
      const h = pagerRef.current ? pagerRef.current.offsetHeight : 70;
      setPagerH(h + 16); // plus respiro
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

  // ✅ Calcular limit según espacio visible (sin scroll vertical interno)
  useEffect(() => {
    const calcRows = () => {
      const ROW_H = 50; // alto aprox de una fila
      const GAP = 24;

      const top =
        wrapperRef.current?.getBoundingClientRect().top ?? 0;

      const available = window.innerHeight - top - pagerH - GAP;
      const rows = Math.max(5, Math.floor(available / ROW_H));
      setLimit(rows);
    };

    calcRows();
    const onResize = () => requestAnimationFrame(calcRows);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pagerH]);

  // ✅ Si cambia el limit, vuelve a la primera página
  useEffect(() => {
    if (limit) setPage(1);
  }, [limit]);

  // ✅ Obtener docentes (page/limit)
  useEffect(() => {
    if (!limit) return;

    let mounted = true;
    const fetchDocentes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/docente/obtener`, {
          params: { page, limit },
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
  }, [page, limit, API_URL, token]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        {loading ? (
          <Loading />
        ) : (
          // Usa tus clases globales de Contenedor.css
          <div className="tabla-layout">
            <div className="tabla-wrapper" ref={wrapperRef}>
              <Contenedor
                limit={limit}
                page={page}
                data={docentes}
                setData={setDocentes}
                headers={headers}
                columnsToShow={colums}
                filterKey={filterKey}
                apiEndpoint={"docente"}
                CrearEntidad={CrearDocente}
                PK={PK}
                // 👇 La paginación va afuera (en .pagination-bar)
                setTotalPages={setTotalPages}
                setPage={setPage}
              />
            </div>

            <div className="pagination-bar" ref={pagerRef}>
              {docentes.length > 0 && (
                <Paginación
                  totalPages={totalPages}
                  page={page}
                  setPage={setPage}
                />
              )}
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default Index;
