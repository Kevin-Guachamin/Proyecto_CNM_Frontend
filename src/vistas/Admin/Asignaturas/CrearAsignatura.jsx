import React, { useEffect, useState } from 'react';
import Boton from '../../../components/Boton';
import Input from '../../../components/Input';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../Styles/CrearEntidad.css';

function CrearAsignatura({ onCancel, entityToUpdate, onSave }) {
    const [nombre, setNombre] = useState("");

  useEffect(() => {
      if (entityToUpdate) {
          setNombre(entityToUpdate.nombre || "");
      }
  }, [entityToUpdate]);

    const handleSubmit = () => {
        
        const newAsignatura = {nombre};
        onSave(newAsignatura);
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container'>
            <h2>{entityToUpdate ? 'Editar asignatura' : 'Agregar asignatura'}</h2>
            <div className="formulario">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            fondo="Ingrese una materia"
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

export default CrearAsignatura;