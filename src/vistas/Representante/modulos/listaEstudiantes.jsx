import React, { useState, useEffect } from "react";
import axios from 'axios';
import Tabla from '../../Representante/components/Tabla_Representante';
import Header from "../../../components/Header";
import VerDatosEstudiante from '../../Representante/modulos/VerDatosEstudiante';
import { useNavigate } from "react-router-dom";
import VerCalificacionesEstudiante from "./VerCalificacionesEstudiante";

function ListaEstudiantes() {
  // Estado para almacenar la información del usuario conectado
  const [usuario, setUsuario] = useState(null);
  const [datosEstudiante, setDatosEstudiante] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalificacionesOpen, setIsCalificacionesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleVerCalificaciones = (estudianteCedula) => {
    console.log("ver calificaciones de: ", estudianteCedula);
    try {
      /* const respuesta = await axios.get(`http://localhost:8000/estudiante/obtener/${estudianteCedula}`);
      setEstudianteSeleccionado(respuesta.data); */
      setIsCalificacionesOpen(true);

    } catch (error) {
      console.log('Error al obtener las calificaciones del estudiante para el modal', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerDatosEstudiante = async (estudianteCedula) => {
   try {
    const respuesta = await axios.get(`http://localhost:8000/estudiante/obtener/${estudianteCedula}`);
    setEstudianteSeleccionado(respuesta.data);
    setIsModalOpen(true);

   } catch (error) { 
    console.log('Error al obtener los datos del estudiante para el modal', error);
   } finally {
    setIsLoading(false);
   }
 
  }

  // Mientras no se conecte al backend, dejamos un usuario de prueba
  const cargarDatos = async () => {
    try {
      setIsLoading(true);

      // Peticion para obtener datos del representante logeado
      const representante = await axios.get('http://localhost:8000/representante/obtener/0102030405');

      // Peticion para obtener los estudiantes a cargo del representante logeado
      const respuesta = await axios.get('http://localhost:8000/api/representantes/0102030405/estudiantes');

      setUsuario({ primer_nombre: representante.data.primer_nombre,
                    primer_apellido: representante.data.primer_apellido, 
                    rol: "Representante" 
      });
      setDatosEstudiante(respuesta.data);
      
      
    } catch (error) {
      console.error("Error al cargar datos: ", error);
    } finally {
      setIsLoading(false);
    }
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

    
    
    cargarDatos();  
    
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCalificacionesOpen(false);
    setEstudianteSeleccionado(null);
  }
     
    return(
      <div> 
        <div className="container-fluid p-0">
          {usuario && <Header isAuthenticated={true} usuario={usuario} />}
        </div>
        <Tabla 
          datos={datosEstudiante} 
          isLoading={isLoading}
          handleVerCalificaciones={handleVerCalificaciones}
          handleVerDatosEstudiante={handleVerDatosEstudiante}
        ></Tabla> 

        {/* Modal de datos del estudiante */}
        {isModalOpen && (
          <VerDatosEstudiante
            onCancel={handleCloseModal}
            isLoading={isLoading}
            entity={estudianteSeleccionado}
          />
        )}
        
        {/* Modal de calificaciones */}
        {isCalificacionesOpen && (
          <VerCalificacionesEstudiante
            onCancel={handleCloseModal} 
          />
        )}

      </div>
    )
}

export default ListaEstudiantes; 