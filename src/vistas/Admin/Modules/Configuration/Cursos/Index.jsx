import React, { useState, useEffect, useRef } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import ContenedorCursos from "./ContenedorCursos";
import { moduloInicio, modulesSettingsBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import { useNavigate } from "react-router-dom";
import Paginación from "../../../Components/Paginación";
import axios from "axios";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import '../../../Styles/TablasResponsivas.css';

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [cursos, setCursos] = useState([]);

  // paginación y filtros - PAGINACIÓN FIJA
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // FIJO - no más recálculos dinámicos
  const [search, setSearch] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [grupo, setGrupo] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

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

  // ======= Obtener cursos con paginación fija =======
  useEffect(() => {
    if (!periodo) {
      setCursos([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchCursos = async () => {
      try {
        setLoading(true);
        
        if (grupo) {
          const grupos = {
            "BE": ["1ro BE", "2do BE"],
            "BM": ["1ro BM", "2do BM", "3ro BM"],
            "BS": ["1ro BS", "2do BS", "3ro BS"],
            "BCH": ["1ro BCH", "2do BCH", "3ro BCH"],
            "Agr": ["BM", "BS", "BCH", "BS BCH"],
          };

          const niveles = grupos[grupo] ?? [];
          const resultados = await Promise.all(
            niveles.map(nivel =>
              axios.get(
                `${API_URL}/asignacion/nivel/${encodeURIComponent(nivel)}/${periodo}`,
                { headers: { Authorization: `Bearer ${token}` } }
              ).then(r => r.data)
            )
          );

          const combinados = resultados.flatMap(r => Array.isArray(r) ? r : (r.data ?? []));
          const total = combinados.length;
          const totalPags = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
          
          if (!mounted) return;
          setCursos(combinados);
          setTotalPages(totalPags);
        } else {
          const { data } = await axios.get(`${API_URL}/asignacion/obtener/periodo/${periodo}`, {
            params: { page, limit: ITEMS_PER_PAGE },
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!mounted) return;
          setCursos(data.data ?? data);
          setTotalPages(data.totalPages ?? 1);
        }
      } catch (error) {
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCursos();
    return () => {
      mounted = false;
    };
  }, [page, periodo, grupo, API_URL, token]);

  // ======= Filtros =======
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePeriodoChange = (periodo) => {
    setPeriodo(periodo);
    setPage(1);
  };

  const handleGrupoChange = (grupo) => {
    setGrupo(grupo);
    setPage(1);
  };

  // ======= Filtrar datos =======
  const filteredData = cursos.filter((curso) =>
    JSON.stringify(curso).toLowerCase().includes(search.toLowerCase())
  );

  // ======= Paginación local para grupos =======
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = grupo ? filteredData.slice(startIndex, endIndex) : filteredData;

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        <div className="vista-cursos">
          <div className="cursos-container">
            <div className="cursos-content">
              <ContenedorCursos
                search={search}
                filtrar={handleSearch}
                data={paginatedData}
                setData={setCursos}
                periodo={periodo}
                setPeriodo={handlePeriodoChange}
                grupo={grupo}
                setGrupo={handleGrupoChange}
                loading={loading}
              />
            </div>
            
            <div className="cursos-pagination" ref={pagerRef}>
              {totalPages > 1 && (
                <Paginación totalPages={totalPages} page={page} setPage={setPage} />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Index