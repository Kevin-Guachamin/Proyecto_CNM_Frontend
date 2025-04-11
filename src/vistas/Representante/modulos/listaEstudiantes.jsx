import React, { useState, useEffect } from "react";
import axios from 'axios';
import Tabla from '../../Representante/components/Tabla_Representante';
import Header from "../../../components/Header";
import VerDatosEstudiante from '../../Representante/modulos/VerDatosEstudiante';
import { useNavigate } from "react-router-dom";
import VerCalificacionesEstudiante from "./VerCalificacionesEstudiante";

function ListaEstudiantes() {
  // Estado para almacenar la información del usuario conectado
  const [usuario, setUsuario] = useState([]);  
  const [datosEstudiante, setDatosEstudiante] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState([]);
  const [notasEstudiante, setNotasEstudiante] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalificacionesOpen, setIsCalificacionesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleVerCalificaciones = async (estudianteId) => {
    console.log("ver calificaciones de: ", estudianteId);
    try {
      const token = localStorage.getItem("token");
      // Hacer solicitud a la API para obtener las calificaciones del estudiante
      // y enviarlas al modal
      const respuesta = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/estudiante/obtener/${estudianteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEstudianteSeleccionado(respuesta.data);
      setIsCalificacionesOpen(true);

    } catch (error) {
      console.log('Error al obtener las calificaciones del estudiante para el modal', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerDatosEstudiante = async (estudianteCedula) => {
   try {

    const token = localStorage.getItem("token");
    const respuesta = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/estudiante/obtener/${estudianteCedula}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setEstudianteSeleccionado(respuesta.data);
    setIsModalOpen(true);

   } catch (error) { 
    console.log('Error al obtener los datos del estudiante para el modal', error);
   } finally {
    setIsLoading(false);
   }
 
  }

  
  //  Obtener los datos del representante guardados en localStorage
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        // Obtener datos del representante logeado
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioGuardado) {
          setUsuario(usuarioGuardado);
        } else {
          return console.log('El usuario es NULL');
        }
      } catch (error) {
        console.error("Error al cargar datos: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    cargarDatos();
  }, []);

  // Obtener los estudiantes a cargo de un representante
  useEffect(() => {
    const cargarDatosEstudiantes = async () => {
      if(!usuario || usuario.length ==- 0) {
        return;
      }
      try {
        // Peticion para obtener los estudiantes a cargo del representante logeado
        const token = localStorage.getItem("token");
        const respuesta = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/api/representantes/${usuario.nroCedula}/estudiantes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      setDatosEstudiante(respuesta.data);

      } catch (error) {
       console.error("Error al cargar datos del estudiante: ", error); 
      }  
    }
    cargarDatosEstudiantes();
  }, [usuario]);

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
            estudiante={estudianteSeleccionado}
            // notas
          />
        )}

      </div>
    )
}

export default ListaEstudiantes; 