import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Layout from '../../../../layout/Layout'
import Busqueda from "./Busqueda";
import { modulesMatricula } from "../../../Admin/Components/Modulos"
import { useNavigate } from "react-router-dom";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (!storedUser) {
      navigate("/");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
      
    } catch (error) {
      console.log("Error parseando el usuario de localStorage: ", error);
      navigate("/");
      return; 

    }

    if (!parsedUser || parsedUser.subRol === 'Admin') {
      navigate("/")
      return;
    }
    setUsuario(parsedUser);

  }, []);

  // Mientras carga, `usuario` es null
  if (usuario === null) {
    return <div>Cargando…</div>;
  }

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout showSidebar={false} modules={modulesMatricula}>
        <Busqueda usuario={usuario} />
      </Layout>
    </div>
  )
}

export default Index