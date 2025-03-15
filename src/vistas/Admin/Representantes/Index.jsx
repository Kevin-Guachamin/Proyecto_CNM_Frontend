import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/containers/Layout'
import Loading from "../../../components/Loading";
import Contenedor from "../Components/Contenedor";
import {modules} from "../Components/Modulos"
import axios from 'axios'
import CrearRepresentante from "./CrearRepresentante";
import { IoEyeOutline } from "react-icons/io5";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";


function Index() {
  
  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos]=useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const headers = ["Cédula", "Nombre", "Apellido","Email","📱Móvil","🚨 Emergencia","Acciones" ];
  const colums= ["nroCedula","primer_nombre","primer_apellido","email","celular","emergencia"]
  const filterKey="primer_nombre"
  const PK="nroCedula"
  
  useEffect(() => {
      
      
      setLoading(true)
    axios.get(`${API_URL}/representante/obtener?page=${page}`)
        .then(response => {
          setPeriodos(response.data.representantes); // Guardar la información del usuario en el estado
          setTotalPages(response.data.totalPages)
          console.log("estos son los registros", response.data)
          setLoading(false);
        })
        .catch(error => {
          ErrorMessage(error)
          setLoading(false);
        });

      // Mientras no se conecte al backend, dejamos un usuario de prueba
      
      setUsuario({ nombre: "Juan Pérez", rol: "Estudiante" });
    }, [API_URL,page]);
  
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
            apiEndpoint={"representante"} 
            CrearEntidad={CrearRepresentante}
            PK={PK} 
            extraIcon={() => <IoEyeOutline size={20} />}
            setPage={setPage}
            page={page}
            totalPages={totalPages} 
          />
        }
         
        </Layout>
    </div>
  )
}

export default Index