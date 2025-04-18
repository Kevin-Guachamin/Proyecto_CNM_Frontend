import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Layout from '../../../../layout/Layout'
import Busqueda from "./Busqueda";
import { moduloInicio, modulesMatriculaBase, construirModulosConPrefijo } from "../../Components/Modulos"
import { useNavigate } from "react-router-dom";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const navigate = useNavigate()
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser || (parsedUser.subRol !== "Administrador" && parsedUser.subRol !== "Secretaria")) {
      navigate("/");
    } else {
      setUsuario(parsedUser);

      const modulosDinamicos = [
        moduloInicio,
        ...construirModulosConPrefijo(parsedUser.subRol, modulesMatriculaBase)
      ];
      setModulos(modulosDinamicos);
    }
  }, [API_URL, navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulos}>
        <Busqueda />
      </Layout>
    </div>
  )
}

export default Index