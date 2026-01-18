import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from "../../../../../layout/Layout";
import MateriasIndividuales from "./MateriasIndividuales";
import { moduloInicio, modulesMatriculaBase, construirModulosConPrefijo } from "../../../Components/Modulos"
import { useNavigate } from "react-router-dom";


function Index() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate()
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Administrador" && parsedUser.subRol !== "Secretaria" && parsedUser.subRol !== "Profesor") {
      navigate("/")
    }
    setUsuario(parsedUser);
    const modulosDinamicos = [
      moduloInicio,
      ...construirModulosConPrefijo(parsedUser.subRol, modulesMatriculaBase)
    ];
    setModulos(modulosDinamicos);
  }, [navigate]);
  

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulos}>
        <MateriasIndividuales />
      </Layout>
    </div>
  )
}

export default Index