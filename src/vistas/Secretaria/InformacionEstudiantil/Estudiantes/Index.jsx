import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Layout from '../../../../layout/Layout'
import Loading from "../../../../components/Loading";
import ContenedorEstudiante from "./ContenedorEstudiante";
import { modulesEstudiates } from "../../../Admin/Components/Modulos"
import axios from 'axios'
import CrearEstudiante from "./CrearEstudiante";

import { ErrorMessage } from "../../../../Utils/ErrorMesaje";
import Paginación from '../../../Admin/Components/Paginación';
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
  const [estudiante,setEstudiante]=useState({})

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido", "Fecha de nacimiento", "Género", "Jornada", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "fecha_nacimiento", "genero", "jornada"]
  const filterKey = "primer_nombre"
  const PK = "ID"
  

  const DatosEstudiante =(estudiante)=>{
    setActiveTabId("tab2")
    openTab("tab2")
    setEstudiante(estudiante)
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
        />
      ),
    },
    {
      id: 'tab2',
      label: `${estudiante.primer_nombre} ${estudiante.primer_apellido} `,
      component: <ViewData estudiante={estudiante}/>,
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
    if (!parsedUser || parsedUser.subRol !== "Secretaria") {
      navigate("/");
    } else {
      setUsuario(parsedUser);
    }
  }, [navigate]);
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/estudiante/obtener?page=${page}`)
      .then(response => {
        setEstudiantes(response.data.estudiantes);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(error => {
        ErrorMessage(error);
        setLoading(false);
      });
  }, [page]); 

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesEstudiates}>
        <TabSwitcher tabs={tabs} activeTabId={activeTabId} setActiveTabId={setActiveTabId} activeTabs={activeTabs} setActiveTabs={setActiveTabs}/>
      </Layout>
    </div>
  )
}

export default Index