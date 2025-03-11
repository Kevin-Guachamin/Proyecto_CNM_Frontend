import React, { useState, useEffect } from "react";
import Layout from '../../layout/containers/Layout';
import Tabla from '../Representante/components/Tabla_Representante';
import { Home, Users, Settings, Eye, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { div } from 'framer-motion/client';
import Header from "../../components/Header";


function Index() {
  // Estado para almacenar la información del usuario conectado
  const [usuario, setUsuario] = useState(null);
  const [datosEstudiante, setDatosEstudiante] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const datos = 2;

  const handleVerClick = (estudiante) => {
    console.log("ver detalles de: ", estudiante);
    // logica
  }

  // Simulación de usuario ficticio mientras se conecta con el backend
  useEffect(() => {
    // Aquí se realizará la petición al backend cuando esté disponible
    // axios.get("URL_DEL_BACKEND/usuarioConectado", { headers: { Authorization: `Bearer ${TOKEN}` } })
    //   .then(response => {
    //     setUsuario(response.data); // Guardar la información del usuario en el estado
    //   })
    //   .catch(error => {
    //     console.error("Error al obtener los datos del usuario:", error);
    //   });

    // Mientras no se conecte al backend, dejamos un usuario de prueba
    const cargarDatos = async () => {
      try {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setUsuario({ nombre: "Maria Pérez", rol: "Representante" });
        setDatosEstudiante([
          {
            Estudiante: "Jose Andres Perez Jimenez", 
            Curso: "el curso", 
            Especialidad: "la especialidad",
            Acciones: (
              <button
                className = "btn btn-primary btn-sm"
                onClick = {() => handleVerClick("Jose Andres Perez Jimenez")}
              >
              <Eye size={16} className="me-1"/>
              Ver calificaciones
              </button>
            )
          },
          {Estudiante: "Ana Maria Perez Jimenez", Curso: "el curso", Especialidad: "la especialidad"}
        ]);
      } catch (error) {
        console.error("Error al cargar datos: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  cargarDatos();  
    
  }, []);
    
    const modules = [
        { name: "Inicio", icon: <Home size={20} /> },
        { name: "Usuarios", icon: <Users size={20} /> },
        { name: "Configuración", icon: <Settings size={20} /> },
    ];
    return(
        <div>
            {/* Encabezado */}
            <div className="container-fluid p-0">
              {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>

            <Layout modules = {modules}>
              <Tabla datos={datosEstudiante} isLoading={isLoading}></Tabla>
            </Layout>
        </div>
    )
}

export default Index