import React from 'react';
import Boton from '../../../../../components/Boton';
import DatePicker from 'react-datepicker';
import '../../../Styles/CrearEntidad.css';
import "react-datepicker/dist/react-datepicker.css";
import InfoRepresentante from './InfoRepresentante';
import InfoEstudiante from './InfoEstudiante';

function ViewData({ estudiante }) {
  return (
    <div className="contenedor-detalle-estudiante">
      <InfoEstudiante estudiante={estudiante} />
      <InfoRepresentante nroCedula={estudiante.nroCedula_representante} />
    </div>    
  );
}

export default ViewData