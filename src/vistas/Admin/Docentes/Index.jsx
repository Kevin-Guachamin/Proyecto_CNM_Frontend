import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "../Components/Contenedor";
import { modulesSettings } from "../Components/Modulos"
import { ObtenerTodo } from "../../../Utils/CRUD/ObjetenerTodo";
import CrearDocente from "./CrearDocente";


function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [docentes, setDocentes] = useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Primer nombre", "Primer Apellido", "Segundo Nombre", "Segundo Apellido", "Email", "Celular", "Rol", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "segundo_nombre", "segundo_apellido", "email", "celular", "rol"]
  const filterKey = "nroCedula"
  const PK = "nroCedula"

  useEffect(() => {

    ObtenerTodo(setDocentes, `${API_URL}/docente/obtener`, setLoading)
    // Mientras no se conecte al backend, dejamos un usuario de prueba

    setUsuario({ nombre: "Juan Pérez", rol: "Estudiante" });
  }, [API_URL]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> : <Contenedor data={docentes} setData={setDocentes} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"docente"} CrearEntidad={CrearDocente} PK={PK} />}

      </Layout>
    </div>
  )
}

export default Index