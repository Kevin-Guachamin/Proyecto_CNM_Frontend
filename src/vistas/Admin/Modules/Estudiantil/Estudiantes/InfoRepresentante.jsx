import React from 'react';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import { Card, Row, Col } from "react-bootstrap";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function InfoRepresentante({ representante }) {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

  const handleDownload = async (filePath) => {
    const parts = filePath.split("\\");
    const folder = parts[1];   // Subcarpeta (ej: "Estudiantes")
    const filename = parts[2]; // Nombre del archivo

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
      <h5 className="mb-4">Información del Representante</h5>

      {/* Fila 1 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Cédula/Pasaporte:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.nroCedula}
        </Col>

        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Email:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info info-wrap">
          {representante.email}
        </Col>
      </Row>

      {/* Fila 2 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Primer nombre:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.primer_nombre}
        </Col>

        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Primer apellido:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.primer_apellido}
        </Col>
      </Row>

      {/* Fila 3 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Segundo nombre:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.segundo_nombre}
        </Col>

        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Segundo apellido:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.segundo_apellido}
        </Col>
      </Row>

      {/* Fila 4 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Celular:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.celular}
        </Col>

        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Número emergencia:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.emergencia}
        </Col>
      </Row>

      {/* Fila 5 */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Número convencional:</strong>
        </Col>
        <Col xs={12} md={6} lg={3} className="info">
          {representante.convencional}
        </Col>
      </Row>

      {/* Fila 6: Botones */}
      <Row className="mb-2 gy-2">
        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Copia de Cédula:</strong>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <button
            className="download-button"
            onClick={() => handleDownload(representante.cedula_PDF)}
          >
            <FontAwesomeIcon icon={faDownload} className="icon" />
            Descargar documento
          </button>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <strong className="info-label">Croquis:</strong>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <button
            className="download-button"
            onClick={() => handleDownload(representante.croquis_PDF)}
          >
            <FontAwesomeIcon icon={faDownload} className="icon" />
            Descargar documento
          </button>
        </Col>
      </Row>
    </Card>
  );
}

export default InfoRepresentante;
