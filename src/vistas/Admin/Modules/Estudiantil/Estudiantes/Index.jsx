import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { modulesEstudiates } from "../../../Components/Modulos"
import axios from 'axios'
import CrearEstudiante from "./CrearEstudiante";
import { IoEyeOutline } from "react-icons/io5";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Paginación from '../../../Components/Paginación';
import { useNavigate } from "react-router-dom";
import TabSwitcher from "./Tabulador";

function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [estudiantes, setEstudiantes] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido", "Fecha de nacimiento", "Género", "Jornada", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "fecha_nacimiento", "genero", "jornada"]
  const filterKey = "primer_nombre"
  const PK = "ID"

  const ViewData =()=>{
    
  }
  const tabs = [
    {
      id: 'tab3',
      label: 'Pestaña 3',
      component: loading ? (
        <Loading />
      ) : (
        <Contenedor
          data={estudiantes}
          setData={setEstudiantes}
          headers={headers}
          columnsToShow={colums}
          filterKey={filterKey}
          apiEndpoint={"estudiante"}
          CrearEntidad={CrearEstudiante}
          PK={PK}
          extraIcon={() => (
            <IoEyeOutline
              size={20}
              onClick={ViewData}
              className="icon view-icon"
            />
          )}
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
      label: 'Pestaña 2',
      component: <div>Este es el contenido de la pestaña 2</div>,
    },
    {
      id: 'tab1',
      label: 'Pestaña 1',
      component: <div>Contenido dinámico de la pestaña 1</div>,
    },
  ];


  useEffect(() => {
    setLoading(true)
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/")
    }
    axios.get(`${API_URL}/estudiante/obtener?page=${page}`)
      .then(response => {

        setEstudiantes(response.data.estudiantes); // Guardar la información del usuario en el estado
        setTotalPages(response.data.totalPages)
        setLoading(false);
      })
      .catch(error => {
        ErrorMessage(error)
        setLoading(false);
      });

    // Mientras no se conecte al backend, dejamos un usuario de prueba

    setUsuario(parsedUser);
  }, [API_URL, page, navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesEstudiates}>
        <TabSwitcher tabs={tabs}/>
      </Layout>
    </div>
  )
}

export default Index