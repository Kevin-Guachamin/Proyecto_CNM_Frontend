import React from 'react';
import Boton from '../../../../../components/Boton';
import DatePicker from 'react-datepicker';
import '../../../Styles/CrearEntidad.css';
import "react-datepicker/dist/react-datepicker.css";

import InfoEstudiante from './InfoEstudiante';

function ViewData({ estudiante }) {

  

  return (
    <div className="Contenedor-general">
      <InfoEstudiante estudiante={estudiante}/>
    </div>

    
  )

}

export default ViewData