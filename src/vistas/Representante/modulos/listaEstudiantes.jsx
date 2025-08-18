import React, { useState, useEffect } from "react";
import axios from 'axios';
import Tabla from '../../Representante/components/Tabla_Representante';
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import VerDatosEstudiante from '../../Representante/modulos/VerDatosEstudiante';
import { useLocation, useNavigate } from "react-router-dom";
import { modulosRepresentante } from "../components/ModulosRepresentante";

function ListaEstudiantes() {
  // Estado para almacenar la información del usuario conectado
  const [usuario, setUsuario] = useState(null);  
  const [datosEstudiante, setDatosEstudiante] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalificacionesOpen, setIsCalificacionesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let periodosMatriculados = [];
  //let periodosDatos = [];
  const [periodosDatos, setPeriodosDatos] = useState([]);
  const navigate = useNavigate();

  // ✅ Verificación de autenticación
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (!parsedUser) {
      navigate("/login");
      return;
    }
    setUsuario(parsedUser);
  }, [navigate]);
  

  const handleVerCalificaciones = async (estudianteCedula) => {
    console.log("ver calificaciones de: ", estudianteCedula);
     
    try {
      const token = localStorage.getItem("token");
      const baseURL = import.meta.env.VITE_URL_DEL_BACKEND;
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      
      // Solicitud para obtener los datos de un estudiante en caso
      // de que se haga click en su correspondiente boton
      // de Ver calificaciones
      const { data: estudiante } = await axios.get(
        `${baseURL}/estudiante/obtener/${estudianteCedula}`, 
        headers
      );
      setEstudianteSeleccionado(estudiante);
      
      // Solicitud para ver todos los periodos academicos en los que un estudiante se matriculo 
      const { data: periodosMatriculados } = await axios.get(
        `${baseURL}/matricula/estudiante/${estudiante.ID}`, 
        headers
      ); 
      // Devuelve un array con objetos. 
      // Formato de objetos {ID de la matricula:, ID periodo academico:} 
      // Ejemplo [{ID: 21, ID_periodo_academico: "Periodo academico 2024-2025"}]

      // Solicitud par obtener datos de los periodos academicos en los que se matriculo el estudiante
      const respuestaPeriodosDatos = await Promise.all(
        periodosMatriculados.map(matricula => 
          axios.get(`${baseURL}/periodo_academico/obtener/${matricula.ID_periodo_academico}`, headers)
            .then(response => ({
              ...matricula,
              descripcion: response.data.descripcion
            }))
        )
      );
  
      navigate(
        `/representante/calificaciones`,
        { state: { estudiante, respuestaPeriodosDatos } }
      );


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
      if(!usuario || usuario.length == 0) {
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
      <div className="section-container">
        <div className="container-fluid p-0">
          {usuario && <Header isAuthenticated={true} usuario={usuario} />}
        </div>

        <Layout modules={modulosRepresentante}>
          <div className="vista-estudiantes">
            {isLoading ? (
              <Loading />
            ) : (
              <Tabla 
                datos={datosEstudiante} 
                isLoading={isLoading}
                handleVerCalificaciones={handleVerCalificaciones}
                handleVerDatosEstudiante={handleVerDatosEstudiante}
              />
            )}

            {/* Modal de datos del estudiante */}
            {isModalOpen && (
              <VerDatosEstudiante
                onCancel={handleCloseModal}
                isLoading={isLoading}
                entity={estudianteSeleccionado}
              />
            )}
          </div>
        </Layout>
      </div>
    )
}

export default ListaEstudiantes; 
