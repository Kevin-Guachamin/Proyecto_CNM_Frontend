import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/containers/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "../Components/Contenedor";
import {modules} from "../Components/Modulos"
import { ObtenerTodo } from "../../../Utils/CRUD/ObjetenerTodo";
import CrearAsignatura from "./CrearAsignatura";


function Index() {
  
  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [asignaturas, setAsginaturas]=useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["ID","Nombre","Acciones"];
  const colums= ["ID","nombre"]
  const filterKey="nombre"
  
  useEffect(() => {
      
      ObtenerTodo(setAsginaturas,`${API_URL}/materia/obtener`,setLoading)
      // Mientras no se conecte al backend, dejamos un usuario de prueba
      
      setUsuario({ nombre: "Juan Pérez", rol: "Estudiante" });
    }, [API_URL]);
  
  return (
    <div className="section-container">
       {/* Encabezado */}
       <div className="container-fluid p-0">
          {usuario && <Header isAuthenticated={true} usuario={usuario} />}
        </div>
        <Layout modules={modules}>
        {loading ? <Loading /> :<Contenedor data={asignaturas} setData={setAsginaturas} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"materia"} CrearEntidad={CrearAsignatura}/>}
         
        </Layout>
    </div>
  )
}

export default Index