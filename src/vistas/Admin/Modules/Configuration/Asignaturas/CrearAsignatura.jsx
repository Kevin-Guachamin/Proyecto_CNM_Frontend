import React, { useEffect, useState } from 'react';
import Boton from '../../../../../components/Boton';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../../../Styles/CrearEntidad.css';

function CrearAsignatura({ onCancel, entityToUpdate, onSave }) {
    const [nombre, setNombre] = useState("");
    const [nivel, setNivel] = useState("");
    const [edadMin, setEdadMin] = useState("")
    const [tipo, setTipo] = useState("")

    const token = localStorage.getItem("token")
    useEffect(() => {
        if (entityToUpdate) {
            setNombre(entityToUpdate.nombre || "");
            setNivel(entityToUpdate.nivel || "");
            setEdadMin(entityToUpdate.edadMin || "");
            setTipo(entityToUpdate.tipo || "")

        }
    }, [entityToUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault()
        const newAsignatura = { nombre, nivel, edadMin, tipo: tipo };
        onSave(newAsignatura,
            {
                headers: { Authorization: `Bearer ${token}` },
            });
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container modal-asignatura'>
                <h2>{entityToUpdate ? 'Editar asignatura' : 'Agregar asignatura'}</h2>
                <form onSubmit={(e) => handleSubmit(e)} className="modal-form">
                    <div className='rows'>
                        
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                        

                     
                        <div className="form-group">
                            <label htmlFor="edadMin">Edad mínima</label>
                            <input
                                id="edadMin"
                                type="number"
                                min="0"
                                max="120"
                                value={edadMin}
                                onChange={(e) => setEdadMin(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        </div>
                        <div className='rows'>
                        <div className="form-group">
                            <label htmlFor="nivel">Nivel</label>
                            <select
                                id="nivel"
                                value={nivel}
                                onChange={(e) => setNivel(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="" disabled selected>Selecciona un nivel</option>
                                <option value="1ro BE">1ro BE</option>
                                <option value="2do BE">2do BE</option>
                                <option value="1ro BM">1ro BM</option>
                                <option value="2do BM">2do BM</option>
                                <option value="3ro BM">3ro BM</option>
                                <option value="1ro BS">1ro BS</option>
                                <option value="2do BS">2do BS</option>
                                <option value="3ro BS">3ro BS</option>
                                <option value="1ro BCH">1ro BCH</option>
                                <option value="2do BCH">2do BCH</option>
                                <option value="3ro BCH">3ro BCH</option>
                                <option value="BCH">BCH</option>
                                <option value="BM">BM</option>
                                <option value="BS">BS</option>
                                <option value="BE">BE</option>
                                <option value="BS BCH">BS BCH</option>
                                <option value="BM BS">BM BS</option>
                                <option value="BM BCH">BM BS BCH</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo</label>
                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="" disabled selected>Selecciona un tipo</option>
                                <option value="grupal">grupal</option>
                                <option value="individual">individual</option>

                            </select>
                        </div>
                        </div>
                        
                    
                    <div className='rows-botones'>
                        <div className="botones">
                            <button type='submit' className='boton-crear' >Guardar</button>
                            <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
                        </div>
                    </div>
                </form>

            </div>

        </div>
    );
}

export default CrearAsignatura;