import React, { useState } from 'react';
import Boton from '../../../components/Boton';

function CrearSolicitud({ nroCedula, onSave, onCancel }) {
    const [motivo, setMotivo] = useState("");
    const [descripcion, setDescripcion] = useState(""); // NUEVO: descripción seleccionada

    const descripcionLegible = {
        parcial1_quim1: "Parcial 1 - Quimestre 1",
        parcial2_quim1: "Parcial 2 - Quimestre 1",
        quimestre1: "Quimestre 1",
        parcial1_quim2: "Parcial 1 - Quimestre 2",
        parcial2_quim2: "Parcial 2 - Quimestre 2",
        quimestre2: "Quimestre 2",
        nota_final: "Nota Final"
    };

    const handleSubmit = () => {
        if (!descripcion || !motivo) {
            alert("Debes llenar todos los campos");
            return;
        }

        const solicitud = {
            nroCedula_docente: nroCedula,
            fechaSolicitud: new Date(),
            motivo,
            descripcion, // ← NUEVO campo enviado
            fecha_inicio: null,
            fecha_fin: null
        };
        onSave(solicitud);
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container'>
                <h2>Crear solicitud</h2>
                <div className="formulario">
                    <div className='rows'>
                        <div className="form-group">
                            <label htmlFor="descripcion">Seleccione qué desea editar</label>
                            <select
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            >
                                <option value="">-- Seleccione una opción --</option>
                                {Object.entries(descripcionLegible).map(([clave, valor]) => (
                                    <option key={clave} value={clave}>
                                        {valor}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="motivo">Ingrese el motivo</label>
                            <input
                                id="motivo"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                            />
                        </div>
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

export default CrearSolicitud;