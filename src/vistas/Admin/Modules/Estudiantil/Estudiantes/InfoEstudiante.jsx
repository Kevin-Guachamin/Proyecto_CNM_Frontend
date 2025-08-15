import React from 'react';
import { calcularEdad, convertirFecha, generarCodigoEstudiante } from '../../../../../Utils/Funciones';
import { Card, Row, Col } from "react-bootstrap";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../Styles/TarjetaEstudiante.css';

function InfoEstudiante({ estudiante }) {
  const token = localStorage.getItem("token");

  const handleDownload = async (filePath) => {
    const parts = filePath.split("\\");
    const folder = parts[1]; // Subcarpeta (ej: "Estudiantes")
    const filename = parts[2]; // Nombre del archivo (ej: "ProyectoCNM.pdf")
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

    try {
      const response = await axios.get(`${API_URL}/download/${folder}/${filename}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

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
      ErrorMessage(error);
    }
  };

  return (
    <Card className="student-card">
      <h5 className="mb-4">Información del Estudiante</h5>

      {/* Fila 1 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Cédula/Pasaporte:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.nroCedula}</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Código Estudiante:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">
          {generarCodigoEstudiante(estudiante.anioMatricula, estudiante.ID)}
        </Col>
      </Row>

      {/* Fila 2 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Nacionalidad:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.nacionalidad}</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Nro matrícula:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.nroMatricula}</Col>
      </Row>

      {/* Fila 3 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Primer Nombre:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.primer_nombre}</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Primer Apellido:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.primer_apellido}</Col>
      </Row>

      {/* Fila 4 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Segundo Nombre:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.segundo_nombre}</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Segundo Apellido:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.segundo_apellido}</Col>
      </Row>

      {/* Fila 5 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Edad:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{calcularEdad(convertirFecha(estudiante.fecha_nacimiento))} años</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Jornada:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.jornada}</Col>
      </Row>

      {/* Fila 6 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Fecha de Nacimiento:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.fecha_nacimiento}</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Grupo Etnico:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.grupo_etnico}</Col>
      </Row>

      {/* Fila 7 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Especialidad:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info">{estudiante.especialidad}</Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Institución Educativa Regular:</strong></Col>
        <Col xs={12} md={6} lg={3} className="info info-wrap">{estudiante.IER}</Col>
      </Row>

      {/* Fila 8: Dirección ocupa un par; los otros 2 quedan vacíos en lg */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Dirección:</strong></Col>
        <Col xs={12} md={6} lg={9} className="info info-wrap">{estudiante.direccion}</Col>
      </Row>

      {/* Fila 9: Botones */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}><strong className="info-label">Copia de Cédula:</strong></Col>
        <Col xs={12} md={6} lg={3}>
          <button className="download-button" onClick={() => handleDownload(estudiante.cedula_PDF)}>
            <FontAwesomeIcon icon={faDownload} className="icon" />
            Descargar documento
          </button>
        </Col>

        <Col xs={12} md={6} lg={3}><strong className="info-label">Matrícula IER:</strong></Col>
        <Col xs={12} md={6} lg={3}>
          <button className="download-button" onClick={() => handleDownload(estudiante.matricula_IER_PDF)}>
            <FontAwesomeIcon icon={faDownload} className="icon" />
            Descargar documento
          </button>
        </Col>
      </Row>
    </Card>
  );
}

export default InfoEstudiante;
