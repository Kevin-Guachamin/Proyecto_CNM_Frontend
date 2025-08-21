import React, { useEffect, useRef, useState } from "react";
import Header from "../../../../../components/Header";
import Layout from "../../../../../layout/Layout";
import Loading from "../../../../../components/Loading";
import ContenedorEstudiante from "./ContenedorEstudiante";
import {
  moduloInicio,
  modulesEstudiantesBase,
  construirModulosConPrefijo,
} from "../../../Components/Modulos";
import axios from "axios";
import CrearEstudiante from "./CrearEstudiante";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Paginación from "../../../Components/Paginación";
import { useNavigate } from "react-router-dom";
import TabSwitcher from "./Tabulador";
import ViewData from "./ViewData";
import '../../../Styles/TablasResponsivas.css';

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiante, setEstudiante] = useState({});

  // paginación y filtros - PAGINACIÓN FIJA
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10; // FIJO - no más recálculos dinámicos
  const [search, setSearch] = useState("");
  const [nivel, setNivel] = useState("");

  const [modulos, setModulos] = useState([]);

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

    if (
      !parsedUser ||
      (parsedUser.subRol !== "Administrador" && parsedUser.subRol !== "Secretaria")
    ) {
      navigate("/");
      return;
    }

    setUsuario(parsedUser);
    const modulosDinamicos = [
      moduloInicio,
      ...construirModulosConPrefijo(parsedUser.subRol, modulesEstudiantesBase),
    ];
    setModulos(modulosDinamicos);
  }, [navigate]);

  // ======= Medir altura de la paginación =======
  useEffect(() => {
    const updatePagerH = () => {
      const h = pagerRef.current ? pagerRef.current.offsetHeight : 70;
      const padded = h + 16;
      setPagerH(padded);
      document.documentElement.style.setProperty("--pager-h", `${padded}px`);
    };

    updatePagerH();

    const ro = new ResizeObserver(updatePagerH);
    if (pagerRef.current) ro.observe(pagerRef.current);
    
    return () => {
      ro.disconnect();
    };
  }, []);

  // ======= Reset a página 1 solo por filtros =======
  useEffect(() => { setPage(1); }, [search, nivel]);

  // ======= Fetch con paginación fija =======
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);

        const baseUrl = nivel
          ? `${API_URL}/estudiante/nivel/${encodeURIComponent(nivel)}`
          : `${API_URL}/estudiante/obtener`;

        const { data } = await axios.get(baseUrl, {
          params: { page, limit: ITEMS_PER_PAGE, search },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;
        const list = data?.data ?? data?.estudiantes ?? [];
        setEstudiantes(Array.isArray(list) ? list : []);
        setTotalPages(data?.totalPages ?? 1);
      } catch (error) {
        console.error('Error fetching students:', error);
        ErrorMessage(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const t = setTimeout(fetchData, 300); // debounce
    return () => { mounted = false; clearTimeout(t); };
  }, [API_URL, token, page, search, nivel, ITEMS_PER_PAGE]);

  // ======= Handlers =======
  const filtrar = (e) => setSearch(e?.target?.value ?? "");
  const handleCursos = (nuevoNivel) => setNivel(nuevoNivel || "");
  const DatosEstudiante = (estu) => {
    setEstudiante(estu);
    setActiveTabId("tab2");
    openTab("tab2");
  };

  // ======= Tabs =======
  const tabs = [
    {
      id: "tab1",
      label: "Estudiantes",
      component: loading ? (
        <Loading />
      ) : (
        <div className="estudiantes-container">
          <div className="estudiantes-content">
            <ContenedorEstudiante
              data={estudiantes}
              setData={setEstudiantes}
              headers={[
                "Cédula/Pasaporte",
                "Nombre",
                "Apellido",
                "Jornada",
                "Especialidad",
                "Nivel",
                "Acciones",
              ]}
              columnsToShow={[
                "nroCedula",
                "primer_nombre",
                "primer_apellido",
                "jornada",
                "especialidad",
                "nivel",
              ]}
              filterKey="primer_nombre"
              apiEndpoint={"estudiante"}
              CrearEntidad={CrearEstudiante}
              OnView={DatosEstudiante}
              PK="ID"
              handleCursos={handleCursos}
              filtrar={filtrar}
              search={search}
            />
          </div>

          <div
            className="estudiantes-pagination"
            ref={pagerRef}
            role="navigation"
            aria-label="Paginación de estudiantes"
          >
            {estudiantes.length > 0 && (
              <Paginación totalPages={totalPages} page={page} setPage={setPage} />
            )}
          </div>
        </div>
      ),
    },
    {
      id: "tab2",
      label: `${estudiante.primer_nombre ?? ""} ${estudiante.primer_apellido ?? ""}`,
      component: <ViewData estudiante={estudiante} />,
    },
    {
      id: "tab3",
      label: "Pestaña 1",
      component: <div>Contenido dinámico de la pestaña 1</div>,
    },
  ];

  const firstTabId = tabs[0]?.id;
  const [activeTabId, setActiveTabId] = useState(firstTabId);
  const [activeTabs, setActiveTabs] = useState([firstTabId]);
  const openTab = (id) => {
    if (!activeTabs.includes(id)) setActiveTabs((arr) => [...arr, id]);
    setActiveTabId(id);
  };

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulos}>
        <TabSwitcher
          tabs={tabs}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
        />
      </Layout>
    </div>
  );
}

export default Index;
