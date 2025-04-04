import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "../Components/Contenedor";
import { modulesSettings } from "../Components/Modulos"
import { ObtenerTodo } from "../../../Utils/CRUD/ObjetenerTodo";
import CrearAsignatura from "./CrearAsignatura";
import { useNavigate } from "react-router-dom";

function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [asignaturas, setAsginaturas] = useState([])
  const navigate= useNavigate()
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["ID", "Nombre", "Nivel","Edad mínima","Acciones"];
  const colums = ["ID", "nombre","nivel","edadMin"]
  const filterKey = "nombre"
  const PK = "ID"
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if(!parsedUser || parsedUser.subRol!=="Administrador"){
      navigate("/")
    }
    ObtenerTodo(setAsginaturas, `${API_URL}/materia/obtener`, setLoading)
    // Mientras no se conecte al backend, dejamos un usuario de prueba

    setUsuario(parsedUser);
  }, [API_URL,navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> : <Contenedor data={asignaturas} setData={setAsginaturas} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"materia"} CrearEntidad={CrearAsignatura} PK={PK} />}

      </Layout>
    </div>
  )
}

export default Index