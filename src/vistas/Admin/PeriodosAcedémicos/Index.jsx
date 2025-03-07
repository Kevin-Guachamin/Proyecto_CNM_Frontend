import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from '../../../layout/containers/Layout'
import { Users, Clipboard, GraduationCap, Book, UserRoundPen} from "lucide-react";
import { FaBuilding } from 'react-icons/fa';
import Loading from "../../../components/Loading";
import Contenedor from "./Contenedor";
import axios from "axios";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";

function Index() {
  const modules = [
    { name: "Periodos académicos", icon: <GraduationCap size={20} /> },
    { name: "Asignaturas", icon: <Book size={20} /> },
    { name: "Cursos", icon: <FaBuilding size={20} /> },
    { name: "Docentes", icon: <UserRoundPen size={20}/>},
    { name: "Estdudiantes", icon: <Users size={20} /> },
    { name: "Califiaciones", icon:<Clipboard size={20}/> }
    
  ];
  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos]=useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  
  
  useEffect(() => {
      // Aquí se realizará la petición al backend cuando esté disponible
      axios.get(`${API_URL}/periodo_academico/obtener`)
        .then(response => {
          console.log(response)
          setPeriodos(response.data); // Guardar la información del usuario en el estado
          setLoading(false);
        })
        .catch(error => {
          ErrorMessage(error)
          setLoading(false);
        });
  
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
        {loading ? <Loading /> :<Contenedor periodos={periodos} setPeriodos={setPeriodos} />}
         
        </Layout>
    </div>
  )
}

export default Index