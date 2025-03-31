import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "./ContenedorCursos";
import { modulesSettings } from "../Components/Modulos"
import { ObtenerTodo } from "../../../Utils/CRUD/ObjetenerTodo";



function Index() {
  const [usuario, setUsuario] = useState(null);
  const [asignaciones, setAsignaciones] = useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const [loading, setLoading] = useState(false);
  const PK = "ID"
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    ObtenerTodo(setAsignaciones, `${API_URL}/asignacion/obtener`, setLoading)
    setUsuario(parsedUser);
  }, [API_URL]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
      {loading ? <Loading /> :<Contenedor data={asignaciones}  setData={setAsignaciones} setLoading={setLoading} apiEndpoint={"asignacion"}  PK={PK} />}

      </Layout>
    </div>
  )
}

export default Index