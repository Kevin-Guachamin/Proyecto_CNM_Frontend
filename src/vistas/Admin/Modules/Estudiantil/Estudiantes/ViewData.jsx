import React from 'react';
import Boton from '../../../../../components/Boton';
import DatePicker from 'react-datepicker';
import '../../../Styles/CrearEntidad.css';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';


function ViewData({ estudiante }) {


  const handleDownload = async (filePath) => {
    const parts = filePath.split("\\");
    const folder = parts[1]; // Subcarpeta (ej: "Estudiantes")
    const filename = parts[2]; // Nombre del archivo (ej: "ProyectoCNM.pdf")

    try {
      const response = await axios.get(
        `http://localhost:8000/estudiante/download/${folder}/${filename}`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      ErrorMessage(error)
    }
  }

  function calcularEdad(fechaNacimiento) {
    console.log("esta fue la fecha", fechaNacimiento)
    let fechaNac = fechaNacimiento; // Convertir la fecha a objeto Date
    let hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear(); // Restar años

    // Ajustar si aún no ha pasado el cumpleaños este año
    let mesActual = hoy.getMonth();
    let diaActual = hoy.getDate();
    let mesNac = fechaNac.getMonth();
    let diaNac = fechaNac.getDate();

    if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
      edad--;
    }

    return edad;
  }

  const convertirFecha = (fecha) => {
    if (!fecha) return null;
    const [dia, mes, año] = fecha.split('/');
    return new Date(`${año}-${mes}-${dia}`); // Convertir a formato ISO (yyyy-mm-dd)
  };
  const generarCodigoEstudiante = (anio, idEstudiante) => {
    const secuencial = String(idEstudiante).padStart(4, "0"); // Asegura 4 dígitos
    return `${anio}${secuencial}`;
  };

  return (
    <div className="Contenedor-general">

      <h2 className="modal-title">Información Estudiantil</h2>

      <div className="modal-form">
        <div className='rows'>
          <div className="form-group">
            <label htmlFor="nroCedula">Número de cédula:</label>
            <label htmlFor="">{estudiante.nroCedula}</label>
          </div>
          <div className="form-group">
            <label htmlFor="nroMatricula">Código estudiante:</label>
            <label htmlFor="">{generarCodigoEstudiante(estudiante.anioMatricula, estudiante.ID)}</label>
          </div>
        </div>
        <div className='rows'>
          <div className="form-group">
            <label htmlFor="primer_nombre">Primer nombre:</label>
            <label htmlFor="">{estudiante.primer_nombre}</label>
          </div>

          <div className="form-group">
            <label htmlFor="primer_apellido">Primer apellido:</label>
            <label htmlFor="">{estudiante.primer_apellido}</label>
          </div>
        </div>

        <div className='rows'>
          <div className="form-group">
            <label htmlFor="segundo_nombre">Segundo nombre:</label>
            <label htmlFor="">{estudiante.segundo_nombre}</label>
          </div>

          <div className="form-group">
            <label htmlFor="segundo_apellido">Segundo apellido:</label>
            <label htmlFor="">{estudiante.segundo_apellido}</label>
          </div>

        </div>
        <div className='rows'>
          <div className="form-group">
            <label htmlFor="edad">Edad:</label>
            <label htmlFor="">{calcularEdad(convertirFecha(estudiante.fecha_nacimiento))}</label>
          </div>

          <div className="form-group">
            <label htmlFor="Nro matrícula">Nro. matrícula:</label>
            <label htmlFor="">{generarCodigoEstudiante(estudiante.anioMatricula, estudiante.ID)}</label>
          </div>
        </div>
        <div className='rows'>

          <div className="form-group">
            <label htmlFor="jornada">Jornada :</label>
            <label htmlFor="">{estudiante.jornada}</label>
          </div>
          <div className="form-group">
            <label htmlFor="genero">Genero:</label>
            <label htmlFor="">{estudiante.genero}</label>
          </div>
        </div>
        <div className='rows'>
          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de nacimiento:</label>
            <label htmlFor="">{estudiante.fecha_nacimiento}</label>
          </div>
          <div className="form-group">
            <label htmlFor="grupo_etnico">Grupo Etnico:</label>
            <label htmlFor="">{estudiante.grupo_etnico}</label>
          </div>
        </div>
        <div className='rows'>
          <div className="form-group">
            <label htmlFor="especialidad">Especialidad:</label>
            <label htmlFor="">{estudiante.especialidad}</label>
          </div>
          <div className="form-group">
            <label htmlFor="IER">Institución de eduación regular:</label>
            <label htmlFor="">{estudiante.IER}</label>
          </div>
        </div>
        <div className='rows'>
          <label htmlFor="direccion">Dirección:</label>
          <label htmlFor="">{estudiante.direccion}</label>
        </div>
        <div className="file-upload-container">
          <div className="file-upload">
            <label htmlFor="copiaCedula" className="custom-file-label">
              Copia de Cédula:
            </label>
            <button className="download-button" onClick={() => handleDownload(estudiante.cedula_PDF)}>
              <FontAwesomeIcon icon={faDownload} className="icon" />
              Descargar documento
            </button>

          </div>
          <div className="file-upload">
            <label htmlFor="matricula_IER" className="custom-file-label">
              Matrícula IER:
            </label>
            <button className="download-button" onClick={() => handleDownload(estudiante.matricula_IER_PDF)}>
              <FontAwesomeIcon icon={faDownload} className="icon" />
              Descargar documento
            </button>

          </div>
        </div>


      </div>

    </div>
  )

}

export default ViewData