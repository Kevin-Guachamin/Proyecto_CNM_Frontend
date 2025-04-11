import React from 'react'
import { calcularEdad, convertirFecha, generarCodigoEstudiante } from '../../../../../Utils/Funciones';
import { Card, Row, Col } from "react-bootstrap";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../Styles/TarjetaEstudiante.css'

function InfoEstudiante({estudiante}) {
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
  return (
    <Card className="student-card">
    <h5 className="mb-4">Información del Estudiante</h5>

    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Cédula/Pasaporte:</strong></Col>
      <Col sm={3} className="info" >{estudiante.nroCedula}</Col>

      <Col sm={3}><strong className="info-label">Código Estudiante:</strong></Col>
      <Col className="info" sm={3}>{generarCodigoEstudiante(estudiante.anioMatricula, estudiante.ID)}</Col>
    </Row>
    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Nacionalidad:</strong></Col>
      <Col sm={3} className="info" >{estudiante.nacionalidad}</Col>

      <Col sm={3}><strong className="info-label">Nro matrícula:</strong></Col>
      <Col className="info" sm={3}>{estudiante.nroMatricula}</Col>
    </Row>

    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Primer Nombre:</strong></Col>
      <Col sm={3} className="info">{estudiante.primer_nombre}</Col>

      <Col sm={3}><strong className="info-label">Primer Apellido:</strong></Col>
      <Col sm={3} className="info">{estudiante.primer_apellido}</Col>
    </Row>

    <Row  className="mb-2">
      <Col sm={3}><strong className="info-label">Segundo Nombre:</strong></Col>
      <Col sm={3} className="info">{estudiante.segundo_nombre}</Col>

      <Col sm={3}><strong className="info-label">Segundo Apellido:</strong></Col>
      <Col sm={3} className="info">{estudiante.segundo_apellido}</Col>
    </Row>

    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Edad:</strong></Col>
      <Col sm={3} className="info">{calcularEdad(convertirFecha(estudiante.fecha_nacimiento))} años</Col>

      <Col sm={3}><strong className="info-label">Jornada:</strong></Col>
      <Col sm={3} className="info">{estudiante.jornada}</Col>
    </Row>

    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Fecha de Nacimiento:</strong></Col>
      <Col sm={3} className="info">{estudiante.fecha_nacimiento}</Col>

      <Col sm={3}><strong className="info-label">Grupo Etnico:</strong></Col>
      <Col sm={3} className="info">{estudiante.grupo_etnico}</Col>
    </Row>

    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Especialidad:</strong></Col>
      <Col sm={3} className="info">{estudiante.especialidad}</Col>

      <Col sm={3}><strong className="info-label">Institución Educativa Regular:</strong></Col>
      <Col sm={3} className="info">{estudiante.IER}</Col>
    </Row>
    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Dirección:</strong></Col>
      <Col sm={3} className="info">{estudiante.direccion}</Col>
    </Row>
    <Row   className="mb-2">
      <Col sm={3}><strong className="info-label">Copia de Cédula:</strong></Col>
      <Col sm={3} className="info"><button className="download-button" onClick={() => handleDownload(estudiante.cedula_PDF)}>
        <FontAwesomeIcon icon={faDownload} className="icon" />
        Descargar documento
      </button></Col>
      <Col sm={3}><strong className="info-label">Matrícula IER:</strong></Col>
      <Col sm={3} className="info"><button className="download-button" onClick={() => handleDownload(estudiante.matricula_IER_PDF)}>
        <FontAwesomeIcon icon={faDownload} className="icon" />
        Descargar documento
      </button></Col>
    </Row>
  </Card>

  )
}

export default InfoEstudiante