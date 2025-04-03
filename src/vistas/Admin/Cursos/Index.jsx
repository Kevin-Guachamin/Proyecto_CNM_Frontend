import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import Contenedor from "./ContenedorCursos";
import { modulesSettings } from "../Components/Modulos"




function Index() {
  const [usuario, setUsuario] = useState(null);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const PK = "ID"
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    
    setUsuario(parsedUser);
  }, [API_URL]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
      <Contenedor   apiEndpoint={"asignacion"}  PK={PK} />

      </Layout>
    </div>
  )
}

export default Index