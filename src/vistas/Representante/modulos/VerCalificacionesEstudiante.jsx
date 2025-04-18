// Modal para desplegar calificaciobes de un estudiante
import TablaEstudianteCalificaciones from "../components/Tabla_EstudianteCalificaciones";
import Boton from "../../../components/Boton";
import { useState } from "react";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const VerCalificacionesEstudiante = ({onCancel, estudiante, periodosMatriculados}) => {
  const [notasEstudiante, setNotasEstudiante] = useState([]);

  //let inscripciones = [];

  const handleCalificaciones = async (matriculaID) => {
    console.log('Este es el id de la matricula: ', matriculaID);

    console.log("Datos de periodos:", periodosMatriculados);
    
    // Obtener las inscripciones de un estudiante por ID de matricula
    try {
      const token = localStorage.getItem("token");
      const baseURL = import.meta.env.VITE_URL_DEL_BACKEND;
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      // Obtiene las inscripciones
      const { data: respuestaInscripciones } = await axios.get(
        `${baseURL}/inscripcion/obtener/matricula/${matriculaID}`, 
        headers
      ); 
      console.log("Inscripciones de la matricula: ", respuestaInscripciones);

      // Obtener los datos necesarios de inscripciones
      const inscripciones = respuestaInscripciones.map(inscripcion => {
        return {
          ID_inscripcion: inscripcion.ID,
          ID_asignacion: inscripcion.ID_asignacion,
          nombreMateria: inscripcion.Asignacion.Materia.nombre,
          nivel: inscripcion.Asignacion.Materia.nivel
        };
      })
      console.log("Datos de inscripciones formateados: ", inscripciones);
      
      // Obtener calificaciones parciales de una materia con el ID_asignacion
      // mediante peticiones a endpoints
      const notas = await Promise.all(
        inscripciones.map(async inscripcion => {
          try {
            const esBasicoElemental = 
              inscripcion.nivel.includes('Básico Elemental') ||
              inscripcion.nivel.includes('BE');
              
            const endpoint = esBasicoElemental
              ? `/parcialesbe/inscripcion/${inscripcion.ID_inscripcion}`
              : `/parciales/inscripcion/${inscripcion.ID_inscripcion}`;
  
            const { data } = await axios.get(`${baseURL}${endpoint}`, headers);
            
            // Devolver un objeto con información completa
            return {
              ID_inscripcion: inscripcion.ID_inscripcion,
              ID_asignacion: inscripcion.ID_asignacion,
              nombreMateria: inscripcion.nombreMateria,
              nivel: inscripcion.nivel,
              calificaciones: data
            };
          } catch (error) {
            console.error(`Error al obtener notas para ${inscripcion.nombreMateria}:`, error);
            // Devolver objeto con información de error
            return {
              ID_asignacion: inscripcion.ID_asignacion,
              nombreMateria: inscripcion.nombreMateria,
              error: true,
              mensaje: error.message
            };
          }
        })
      ); 

      // Procesar resultados
      const resultadosCompletos = notas.filter(nota => !nota.error);
      const resultadosConError = notas.filter(nota => nota.error);

      console.log('Resultados completos:', resultadosCompletos);
      if (resultadosConError.length > 0) {
        console.log('Materias con error:', resultadosConError);
      }

      // Datos recuperadas 
      // return resultadosCompletos;

      // Campos de notas necesarios
      /* const datos = resultadosCompletos.map(notasMaterias => ({
        nombreMateria: notasMaterias.nombreMateria,
        ID_asignacion: notasMaterias.ID_asignacion,
        nivel: notasMaterias.nivel,
        calificaciones: notasMaterias.calificaciones
      }));
 */
      setNotasEstudiante(resultadosCompletos);
      
    } catch (error) {
      console.log("Error al obtener las calificaciones del estudiante: ", error);
      throw error; // Propagar el error para manejarlo en el componente padre
    }
    
    
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title"> Reporte de calificaciones de {`${estudiante.primer_nombre} ${estudiante.primer_apellido}`}</h2>
        
        {/* Se despliega lista para que se seleccione un periodo matriculado del cual ver las notas */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
            Selecciona una opción
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {periodosMatriculados.length > 0 ? (
              periodosMatriculados.map((periodo, i) =><Dropdown.Item key={i} onClick={() => handleCalificaciones(periodo.ID)}> {periodo.descripcion} </Dropdown.Item> )
            ) : (
                <Dropdown.Item href="#"> No hay periodos matriculados </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        
        <div>
        </div>
        <div /* className="modal-form" */>
          <TablaEstudianteCalificaciones notasEstudiante={notasEstudiante}></TablaEstudianteCalificaciones>
        </div>

        <div className="botones">
          <Boton texto="Guardar" onClick={() => handleSubmit()} estilo="boton-crear" />
          <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
        </div>
      </div>
    </div>
  );
}

export default VerCalificacionesEstudiante;