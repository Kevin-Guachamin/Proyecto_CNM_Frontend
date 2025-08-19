import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Busqueda from "./Busqueda";
import { useNavigate } from "react-router-dom";
import { getModulos,transformModulesForLayout} from "../../getModulos";
import { useAuth } from "../../../Utils/useAuth";

function Index() {
  // Protección de ruta
  const auth = useAuth("Profesor");
  
  // Si no está autenticado, no renderizar nada
  if (!auth.isAuthenticated) {
    return null;
  }

  const [usuario, setUsuario] = useState(null);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const navigate = useNavigate()
  const [modulos,setModulos]=useState([])
  

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser || (parsedUser.subRol !== "Profesor")) {
      navigate("/");
    } else {
      setUsuario(parsedUser);
    setModulos(getModulos(parsedUser.subRol,true))
      
    }
  }, [API_URL, navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={transformModulesForLayout(modulos)} activeModule={3}>
        <Busqueda docente={usuario}/>
      </Layout>
    </div>
  )
}

export default Index