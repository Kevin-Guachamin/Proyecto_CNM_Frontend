import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "../Components/Contenedor";
import { modulesSettings } from "../Components/Modulos"
import axios from 'axios'
import CrearEstudiante from "./CrearEstudiante";
import { IoEyeOutline } from "react-icons/io5";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import Paginación from '../Components/Paginación';

function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [estudiantes, setEstudiantes] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido", "Fecha de nacimiento", "Género", "Jornada", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "fecha_nacimiento", "genero", "jornada"]
  const filterKey = "primer_nombre"
  const PK = "ID"

  const ViewData = () => {

  }

  useEffect(() => {
    setLoading(true)
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
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
  }, [API_URL, page]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> :
          <Contenedor
            data={estudiantes}
            setData={setEstudiantes}
            headers={headers}
            columnsToShow={colums}
            filterKey={filterKey}
            apiEndpoint={"estudiante"}
            CrearEntidad={CrearEstudiante}
            PK={PK}
            extraIcon={() => <IoEyeOutline size={20} onClick={ViewData} className="icon view-icon" />}
            Paginación={<Paginación totalPages={totalPages} page={page} setPage={setPage} />}
          />
        }

      </Layout>
    </div>
  )
}

export default Index