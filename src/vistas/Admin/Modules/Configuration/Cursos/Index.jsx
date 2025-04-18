import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import ContenedorCursos from "./ContenedorCursos";
import { moduloInicio, modulesSettingsBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import { useNavigate } from "react-router-dom";

import Paginación from "../../../Components/Paginación";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([])
  const [modulos, setModulos] = useState([])
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
    const modulosDinamicos = [
      moduloInicio,
      ...construirModulosConPrefijo(parsedUser.subRol, modulesSettingsBase)
    ];
    setModulos(modulosDinamicos);

  },
    [navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulos}>


        <ContenedorCursos apiEndpoint={"asignacion"} PK={PK} data={cursos} setData={setCursos} />


      </Layout>
    </div>
  )
}

export default Index