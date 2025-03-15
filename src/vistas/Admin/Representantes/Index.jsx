import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/containers/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "../Components/Contenedor";
import {modules} from "../Components/Modulos"
import { ObtenerTodo } from "../../../Utils/CRUD/ObjetenerTodo";
import CrearRepresentante from "./CrearRepresentante";
import { IoEyeOutline } from "react-icons/io5";



function Index() {
  
  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos]=useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido","Email","📱Móvil","🚨 Emergencia","Acciones" ];
  const colums= ["nroCedula","primer_nombre","primer_apellido","email","celular","emergencia"]
  const filterKey="primer_nombre"
  const PK="nroCedula"
  
  useEffect(() => {
      
      ObtenerTodo(setPeriodos,`${API_URL}/periodo_academico/obtener`,setLoading)
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
        {loading ? <Loading /> : 
          <Contenedor 
            data={periodos} 
            setData={setPeriodos} 
            headers={headers} 
            columnsToShow={colums} 
            filterKey={filterKey} 
            apiEndpoint={"periodo_academico"} 
            CrearEntidad={CrearRepresentante}
            PK={PK} 
            extraIcon={() => <IoEyeOutline size={20} />} 
          />
        }
         
        </Layout>
    </div>
  )
}

export default Index