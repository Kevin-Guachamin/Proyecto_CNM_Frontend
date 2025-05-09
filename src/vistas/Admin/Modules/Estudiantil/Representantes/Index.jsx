import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import ContenedorRepresentantes from "./ContenedorRepresentantes";
import { moduloInicio, modulesEstudiantesBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import axios from 'axios'
import CrearRepresentante from "./CrearRepresentante";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Paginación from '../../../Components/Paginación';
import { useNavigate } from "react-router-dom";
import TabSwitcher from "../Estudiantes/Tabulador";
import InfoRepresentante from "../Estudiantes/InfoRepresentante";


function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [representantes, setRepresentantes] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()
  const [representante, setRepresentante] = useState({})
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido", "Celular", "Correo", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "celular", "email"]
  const filterKey = "primer_nombre"
  const PK = "nroCedula"
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

  const DatosRepresentante = (representante) => {
    setActiveTabId("tab2")
    openTab("tab2")
    setRepresentante(representante)
  }
  


  const tabs = [
    {
      id: 'tab1',
      label: 'Representantes',
      component: loading ? (
        <Loading />
      ) : (
        <ContenedorRepresentantes
          data={representantes}
          setData={setRepresentantes}
          headers={headers}
          columnsToShow={colums}
          filterKey={filterKey}
          apiEndpoint={"representante"}
          CrearEntidad={CrearRepresentante}
          OnView={DatosRepresentante}
          PK={PK}
          Paginación={
            <Paginación
              totalPages={totalPages}
              page={page}
              setPage={setPage}
             
            />
          }
          search={search}
          filtrar={filtrar}
        
        />
      ),
    },
    {
      id: 'tab2',
      label: `${representante.primer_nombre} ${representante.primer_apellido} `,
      component: <InfoRepresentante  representante={representante}/>,
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
    const fetchRepresentantes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/representante/obtener?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("estos son los respresentates", response)
        setRepresentantes(response.data.representantes);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRepresentantes();
  }, [page,limit]);
  
const filtrar= async (e) => {
  e.preventDefault()
  setSearch(e.target.value)
  try {
    const response = await axios.get(`${API_URL}/representante/obtener?page=${page}&limit=${limit}&search=${e.target.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("estos son los respresentates", response)
    setRepresentantes(response.data.representantes);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    ErrorMessage(error);
  } }

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