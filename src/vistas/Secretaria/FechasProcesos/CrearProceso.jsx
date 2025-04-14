import React, { useEffect, useState } from "react";
import Boton from "../../../components/Boton";
import "../../Admin/Styles/CrearEntidad.css";

function CrearProceso({ onCancel, entityToUpdate, onSave }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [proceso, setProceso] = useState("");

  const parseToYYYYMMDD = (strFecha) => {
    if (!strFecha) return "";
    if (strFecha.includes("-") && strFecha.length === 10) return strFecha;
    const [dia, mes, anio] = strFecha.split("/");
    return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  useEffect(() => {
    if (entityToUpdate) {
      setFechaInicio(parseToYYYYMMDD(entityToUpdate.fecha_inicio));
      setFechaFin(parseToYYYYMMDD(entityToUpdate.fecha_fin));
      setProceso(entityToUpdate.proceso || "");
    }
  }, [entityToUpdate]);

  const handleSubmit = () => {
    onSave({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      proceso
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">
          {entityToUpdate ? "Editar Proceso" : "Agregar Proceso"}
        </h2>
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="proceso">Nombre del Proceso:</label>
            <input
              id="proceso"
              type="text"
              value={proceso}
              onChange={(e) => setProceso(e.target.value)}
              required
            />
          </div>
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
        </div>
        <div className="botones">
          <Boton texto="Guardar" onClick={handleSubmit} estilo="boton-crear" />
          <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
        </div>
      </div>
    </div>
  );
}

export default CrearProceso;