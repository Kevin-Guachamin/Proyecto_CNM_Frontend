import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Boton from '../../../../../components/Boton';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../../../Styles/CrearEntidad.css';
import { convertirFecha } from '../../../../../Utils/Funciones';

function CrearPeriodo({ onCancel, entityToUpdate, onSave }) {
    const [descripcion, setDescripcion] = useState("");
    const [fecha_inicio, setFecha_inicio] = useState("");
    const [fecha_fin, setFecha_fin] = useState("");
    const token = localStorage.getItem("token")

    // Función para convertir una fecha de formato dd/mm/yyyy a un objeto Date

    useEffect(() => {
        //console.log("esto es lo que entro",entityToUpdate.fecha_fin)
        console.log("esto se intenta crear", fecha_fin);
    }, [fecha_fin]);  // Esto se activará cuando fecha_fin cambie
    useEffect(() => {
        if (entityToUpdate) {
            setDescripcion(entityToUpdate.descripcion || "");
            // Convertir las fechas de dd/mm/yyyy a objetos Date
            setFecha_fin(convertirFecha(entityToUpdate.fecha_fin) || "");
            setFecha_inicio(convertirFecha(entityToUpdate.fecha_inicio) || "");

        }
    }, [entityToUpdate]);

    const handleSubmit = () => {


        const newPeriodo = { descripcion, fecha_inicio, fecha_fin };
        onSave(newPeriodo, {
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container'>
                <h2 className='modal-title'>{entityToUpdate ? 'Editar periodo' : 'Agregar periodo'}</h2>
                <div className="modal-form">
                    <div className='rows'>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <input
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}

                            />
                        </div>



                        <div className="form-group">
                            <label htmlFor="fecha_inicio">Fecha inicio</label>
                            <DatePicker
                                selected={fecha_inicio}
                                onChange={(date) => {

                                    setFecha_inicio(date)
                                }} // Establecer directamente como Date
                                dateFormat="dd/MM/yyyy"
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_fin">Fecha fin</label>
                            <DatePicker
                                selected={fecha_fin}
                                onChange={(date) => setFecha_fin(date)} // Establecer directamente como Date
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

        </div>
    );
}

export default CrearPeriodo;
