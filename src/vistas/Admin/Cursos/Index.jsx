import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "./ContenedorCursos";
import { modulesSettings } from "../Components/Modulos"




function Index() {
  const [usuario, setUsuario] = useState(null);
  const headers = ["Nivel","Paralelo", "Docente", "Materia", "Días","Horario","Cupos","Acciones"];
  const Columns= ["nivel","paralelo","Docente.nombre","dias","horario","cupos"]
  const filterKey = "materia.nombre"
  const PK = "ID"
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    setUsuario(parsedUser);
  }, []);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
         <Contenedor  headers={headers}  filterKey={filterKey} apiEndpoint={"asignacion"}  PK={PK} />

      </Layout>
    </div>
  )
}

export default Index