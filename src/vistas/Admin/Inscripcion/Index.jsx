import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import BuscarTutor from "./BuscarTutor";
import { modulesEstudiates } from "../Components/Modulos"
import { useNavigate } from "react-router-dom";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const navigate=useNavigate()
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if(!parsedUser || parsedUser.subRol!=="Administrador"){
      navigate("/")
    }
    setUsuario(parsedUser);
  }, [API_URL,navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesEstudiates}>
      <BuscarTutor/>

      </Layout>
    </div>
  )
}

export default Index