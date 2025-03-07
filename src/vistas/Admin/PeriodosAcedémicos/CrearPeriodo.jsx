import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Boton from '../../../components/Boton';
import Input from '../../../components/Input';
import './CrearPeriodo.css';
import "./common.css"

function CrearPeriodo({ onCancel, periodoToUpdate, onSave }) {
    const [descripcion, setDescripcion] = useState("");
    const [fecha_inicio, setFecha_inicio] = useState("");
    const [fecha_fin, setFecha_fin] = useState("");
    const [estado, setEstado] = useState("");

    useEffect(() => {
        if (periodoToUpdate) {
            setDescripcion(periodoToUpdate.descripcion || "");
            setFecha_fin(periodoToUpdate.fecha_fin || "");
            setFecha_inicio(periodoToUpdate.fecha_inicio || "");
            setEstado(periodoToUpdate.estado || "");
        }
    }, [periodoToUpdate]);

    const handleSubmit = () => {
        const newPeriodo = { descripcion, fecha_inicio, fecha_fin, estado };
        onSave(newPeriodo);
    };

    return (
        <div className="crear-periodo">
            <h2>{periodoToUpdate ? 'Editar periodo' : 'Crear periodo'}</h2>
            <div className="formulario">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="Descripcion">Descripción</label>
                        <Input
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            fondo="Ingrese la descripción"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="estado">Estado</label>
                        <select
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Selecciona un estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fecha_inicio">Fecha inicio</label>
                        <DatePicker
                            selected={fecha_inicio}
                            onChange={(date) => setFecha_inicio(date)}
                            dateFormat="dd/MM/yyyy"
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_fin">Fecha fin</label>
                        <DatePicker
                            selected={fecha_fin}
                            onChange={(date) => setFecha_fin(date)}
                            dateFormat="dd/MM/yyyy"
                            className="input-field"
                        />
                    </div>
                </div>

            </div>

            <div className="botones">
                <Boton texto="Guardar" onClick={() => handleSubmit()} estilo="boton-crear" />
                <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
            </div>
        </div>
    );
}

export default CrearPeriodo;