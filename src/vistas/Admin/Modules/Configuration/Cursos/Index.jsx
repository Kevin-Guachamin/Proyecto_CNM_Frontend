import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import ContenedorCursos from "./ContenedorCursos";
import { modulesSettings } from "../../../Components/Modulos"
import { useNavigate } from "react-router-dom";

import Paginación from "../../../Components/Paginación";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([])
  
  const [page, setPage] = useState(1);
  
  
  
  
  const PK = "ID"
  const navigate = useNavigate()
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/")
    }
    setUsuario(parsedUser);
  }, [navigate]);
  
  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        
          
        <ContenedorCursos apiEndpoint={"asignacion"} PK={PK} data={cursos} setData={setCursos}   />
        

      </Layout>
    </div>
  )
}

export default Index