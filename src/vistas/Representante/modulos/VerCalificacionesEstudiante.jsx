// Modal para desplegar calificaciobes de un estudiante
import TablaEstudianteCalificaciones from "../components/Tabla_EstudianteCalificaciones";
import Boton from "../../../components/Boton";
import { useState } from "react";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const VerCalificacionesEstudiante = ({onCancel, estudiante, periodosMatriculados}) => {
  const [notasEstudiante, setNotasEstudiante] = useState([]);
  const handleCalificaciones = async (peridodoMAtriculadoID) => {
    // Tenemos los periodos matriculados, id del estudiante
    console.log('Este es el id del periodo academico: ', peridodoMAtriculadoID);
    
    // Necesitamos las notas de cada periodo seleccionado

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
          <TablaEstudianteCalificaciones></TablaEstudianteCalificaciones>
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