import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { modulesSettings } from "../../../Components/Modulos"
import { ObtenerTodo } from "../../../../../Utils/CRUD/ObjetenerTodo";
import CrearDocente from "./CrearDocente";
import { useNavigate } from "react-router-dom";


function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [docentes, setDocentes] = useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Primer nombre", "Primer Apellido", "Segundo Nombre", "Segundo Apellido", "Email", "Celular", "Rol", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "segundo_nombre", "segundo_apellido", "email", "celular", "rol"]
  const filterKey = "nroCedula"
  const PK = "nroCedula"
  const navigate = useNavigate()


  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/")
    }
    ObtenerTodo(setDocentes, `${API_URL}/docente/obtener`, setLoading)
    setUsuario(parsedUser);
  }, [API_URL, navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> : <Contenedor data={docentes} setData={setDocentes} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"docente"} CrearEntidad={CrearDocente} PK={PK} />}

      </Layout>
    </div>
  )
}

export default Index