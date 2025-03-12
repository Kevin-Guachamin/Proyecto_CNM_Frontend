import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Boton from '../../../components/Boton';
import Input from '../../../components/Input';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../Styles/CrearEntidad.css';

function CrearPeriodo({ onCancel, entityToUpdate, onSave }) {
    const [descripcion, setDescripcion] = useState("");
    const [fecha_inicio, setFecha_inicio] = useState(null);
    const [fecha_fin, setFecha_fin] = useState(null);
    const [estado, setEstado] = useState("");

     // Función para convertir una fecha de formato dd/mm/yyyy a un objeto Date
     const convertirFecha = (fecha) => {
      if (!fecha) return null;
      const [dia, mes, año] = fecha.split('/');
      return new Date(`${año}-${mes}-${dia}`); // Convertir a formato ISO (yyyy-mm-dd)
  };

  useEffect(() => {
      if (entityToUpdate) {
          setDescripcion(entityToUpdate.descripcion || "");
          // Convertir las fechas de dd/mm/yyyy a objetos Date
          setFecha_fin(convertirFecha(entityToUpdate.fecha_fin));
          setFecha_inicio(convertirFecha(entityToUpdate.fecha_inicio));
          setEstado(entityToUpdate.estado || "");
      }
  }, [entityToUpdate]);

    const handleSubmit = () => {
        // Convertir las fechas a formato ISO (yyyy-MM-dd) antes de enviarlas
        const formattedFechaInicio = fecha_inicio ? fecha_inicio.toISOString().split('T')[0] : null;
        const formattedFechaFin = fecha_fin ? fecha_fin.toISOString().split('T')[0] : null;

        const newPeriodo = { descripcion, fecha_inicio: formattedFechaInicio, fecha_fin: formattedFechaFin, estado };
        onSave(newPeriodo);
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container'>
            <h2 className='modal-title'>{entityToUpdate ? 'Editar periodo' : 'Agregar periodo'}</h2>
            <div className="modal-form">
                
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
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

                    <div className="form-group">
                        <label htmlFor="fecha_inicio">Fecha inicio</label>
                        <DatePicker
                          selected={fecha_inicio}
                          onChange={(date) => setFecha_inicio(date)} // Establecer directamente como Date
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

            <div className="botones">
                <Boton texto="Guardar" onClick={() => handleSubmit()} estilo="boton-crear" />
                <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
            </div>
            </div>
            
        </div>
    );
}

export default CrearPeriodo;
