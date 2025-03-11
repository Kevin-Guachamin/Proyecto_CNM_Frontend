import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Boton from '../../../components/Boton';
import Input from '../../../components/Input';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../PeriodosAcedémicos/CrearPeriodo.css';

function CrearAsignatura({ onCancel, asignaturaToUpdate, onSave }) {
    const [nombre, setNombre] = useState("");

  useEffect(() => {
      if (asignaturaToUpdate) {
          setNombre(asignaturaToUpdate.nombre || "");
      }
  }, [asignaturaToUpdate]);

    const handleSubmit = () => {
        
        const newAsignatura = {nombre};
        onSave(newAsignatura);
    };

    return (
        <div className="crear-periodo">
            <h2>{asignaturaToUpdate ? 'Editar asignatura' : 'Agregar asignatura'}</h2>
            <div className="formulario">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            fondo="Ingrese la descripción"
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

export default CrearAsignatura;