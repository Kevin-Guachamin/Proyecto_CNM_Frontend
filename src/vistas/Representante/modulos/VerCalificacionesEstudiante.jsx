// Modal para desplegar calificaciobes de un estudiante
import TablaEstudianteCalificaciones from "../components/Tabla_EstudianteCalificaciones";
import Boton from "../../../components/Boton";
import { useState } from "react";

const VerCalificacionesEstudiante = ({onCancel, estudiante}) => {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="modal-title"> Reporte de calificaciones de {`${estudiante.primer_nombre} ${estudiante.primer_apellido}`}</h2>
  
          <div className="modal-form">
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