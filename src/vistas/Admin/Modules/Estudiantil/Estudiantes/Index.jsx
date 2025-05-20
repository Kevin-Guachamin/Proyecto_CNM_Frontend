import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import ContenedorEstudiante from "./ContenedorEstudiante";
import { moduloInicio, modulesEstudiantesBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import axios from 'axios'
import CrearEstudiante from "./CrearEstudiante";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Paginación from '../../../Components/Paginación';
import { useNavigate } from "react-router-dom";
import TabSwitcher from "./Tabulador";
import ViewData from "./ViewData";


function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [estudiantes, setEstudiantes] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()
  const [estudiante, setEstudiante] = useState({})
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido", "Jornada", "Especialidad", "Nivel", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "jornada", "especialidad", "nivel"]
  const filterKey = "primer_nombre"
  const PK = "ID"
  const token = localStorage.getItem("token")
  const [modulos, setModulos] = useState([]);
  const [limit, setLimit] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [search, setSearch] = useState('');


  // ✅ Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Establecer límite de resultados según resolución
  useEffect(() => {

    const isLaptop = width <= 1822;
    setLimit(isLaptop ? 15 : 21);
  }, [width]);

  const DatosEstudiante = (estudiante) => {
    setActiveTabId("tab2")
    openTab("tab2")
    setEstudiante(estudiante)
  }
  const Estudiantes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/estudiante/obtener?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstudiantes(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };
  const filtrar = async (e) => {
    e.preventDefault()
    setSearch(e.target.value)
    try {
      const response = await axios.get(`${API_URL}/estudiante/obtener?page=${page}&limit=${limit}&search=${e.target.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //console.log("estos son los estudiantes",response)
      setEstudiantes(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      ErrorMessage(error);
    }
  }
  const handleCursos = (nivel) => {
    console.log("este es el nivel", nivel)
    if (!nivel) {
      console.log("entre")
      Estudiantes()
      return
    }
    axios.get(`${API_URL}/estudiante/nivel/${nivel}?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res => {
        console.log("esto se recibe", res)
        setEstudiantes(res.data.data)
      }))
      .catch(err => {
        ErrorMessage(err)
      })
  }

  const tabs = [
    {
      id: 'tab1',
      label: 'Estudiantes',
      component: loading ? (
        <Loading />
      ) : (
        <ContenedorEstudiante
          data={estudiantes}
          setData={setEstudiantes}
          headers={headers}
          columnsToShow={colums}
          filterKey={filterKey}
          apiEndpoint={"estudiante"}
          CrearEntidad={CrearEstudiante}
          OnView={DatosEstudiante}
          PK={PK}
          Paginación={
            <Paginación
              totalPages={totalPages}
              page={page}
              setPage={setPage}

            />
          }
          handleCursos={handleCursos}
          filtrar={filtrar}
          search={search}
        />
      ),
    },
    {
      id: 'tab2',
      label: `${estudiante.primer_nombre} ${estudiante.primer_apellido} `,
      component: <ViewData estudiante={estudiante} />,
    },
    {
      id: 'tab1',
      label: 'Pestaña 1',
      component: <div>Contenido dinámico de la pestaña 1</div>,
    },
  ];
  const firstTabId = tabs[0]?.id;
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [activeTabs, setActiveTabs] = useState([firstTabId]);
  const openTab = (id) => {
    if (!activeTabs.includes(id)) {
      setActiveTabs([...activeTabs, id]);
    }
    setActiveTabId(id);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || (parsedUser.subRol !== "Administrador" && parsedUser.subRol !== "Secretaria")) {
      navigate("/");
    } else {
      setUsuario(parsedUser);
      const modulosDinamicos = [
        moduloInicio,
        ...construirModulosConPrefijo(parsedUser.subRol, modulesEstudiantesBase)
      ];
      setModulos(modulosDinamicos);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/estudiante/obtener?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("este es el response",response)
        //console.log("estos son los estudiantes",response)
        setEstudiantes(response.data.estudiantes);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, [page, limit]);

  

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulos}>
        <TabSwitcher tabs={tabs} activeTabId={activeTabId} setActiveTabId={setActiveTabId} activeTabs={activeTabs} setActiveTabs={setActiveTabs} />
      </Layout>
    </div>
  )
}

export default Index