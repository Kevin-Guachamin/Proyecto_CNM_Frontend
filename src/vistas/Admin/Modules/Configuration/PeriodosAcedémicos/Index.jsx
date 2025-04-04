import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { modulesSettings } from "../../../Components/Modulos"
import { ObtenerTodo } from "../../../../../Utils/CRUD/ObjetenerTodo";
import CrearPeriodo from "./CrearPeriodo";
import { useNavigate } from "react-router-dom";


function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos] = useState([])
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Descripción", "Fecha inicio", "Fecha fin", "Estado", "Acciones"];
  const colums = ["descripcion", "fecha_inicio", "fecha_fin", "estado"]
  const filterKey = "descripcion"
  const PK = "ID"


  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    console.log("este es el usuario", parsedUser)
    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/")
    }
    ObtenerTodo(setPeriodos, `${API_URL}/periodo_academico/obtener`, setLoading)

    // Mientras no se conecte al backend, dejamos un usuario de prueba
    setUsuario(parsedUser);

  }, [API_URL, navigate]);


  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> : <Contenedor data={periodos} setData={setPeriodos} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"periodo_academico"} CrearEntidad={CrearPeriodo} PK={PK} />}

      </Layout>
    </div>
  )
}

export default Index