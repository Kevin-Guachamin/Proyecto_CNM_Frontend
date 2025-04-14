import React, { useEffect, useState } from 'react';
import Boton from '../../components/Boton';
import "react-datepicker/dist/react-datepicker.css"; // Si deseas usar react-datepicker o su CSS
import '../Admin/Styles/CrearEntidad.css';

function CrearFechas({ onCancel, entityToUpdate, onSave, fechas }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("parcial1_quim1");

  const parseToYYYYMMDD = (strFecha) => {
    if (!strFecha) return "";
    // Si ya es "YYYY-MM-DD", se regresa tal cual
    if (strFecha.includes("-") && strFecha.length === 10) return strFecha;

    // Si es "DD/MM/YYYY"
    const [dia, mes, anio] = strFecha.split("/");
    return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  useEffect(() => {
    if (entityToUpdate) {
      setFechaInicio(parseToYYYYMMDD(entityToUpdate.fecha_inicio));
      setFechaFin(parseToYYYYMMDD(entityToUpdate.fecha_fin));
      setDescripcion(entityToUpdate.descripcion || "parcial1_quim1");
    }
  }, [entityToUpdate]);

  const handleSubmit = () => {
    // Al guardar, puedes enviar en formato yyyy-mm-dd si tu backend lo acepta directamente.
    const newFecha = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      descripcion
    };
    onSave(newFecha);
  };

  const descripcionLegible = {
    parcial1_quim1: "Parcial 1 - Quimestre 1",
    parcial2_quim1: "Parcial 2 - Quimestre 1",
    quimestre1: "Quimestre 1",
    parcial1_quim2: "Parcial 1 - Quimestre 2",
    parcial2_quim2: "Parcial 2 - Quimestre 2",
    quimestre2: "Quimestre 2",
    nota_final: "Nota Final"
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">
          {entityToUpdate ? 'Editar Fecha' : 'Agregar Fecha'}
        </h2>
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="fechaInicio">Fecha de inicio:</label>
            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaFin">Fecha de fin:</label>
            <input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <select
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            >
              {Object.entries(descripcionLegible).map(([key, label]) => (
                <option
                  key={key}
                  value={key}
                  disabled={!entityToUpdate && fechas.some(f => f.descripcion === key)}
                >
                  {label}
                </option>
              ))}
            </select>

          </div>
        </div>
        <div className="botones">
          <Boton texto="Guardar" onClick={handleSubmit} estilo="boton-crear" />
          <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
        </div>
      </div>
    </div>
  );
}

export default CrearFechas;