import React, { useEffect, useState } from 'react';
import Boton from '../../../components/Boton';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../Styles/CrearEntidad.css';

function CrearDocente({ onCancel, entityToUpdate, onSave }) {
   const [nroCedula, setNroCedula]=useState("")
   const [primer_nombre, setPrimerNombre] = useState("");
   const [primer_apellido,setPrimerApellido]=useState("");
   const [segundo_nombre,setSegundoNombre]=useState("");
   const [segundo_apellido,setSegundoApellido]=useState("");
   const [email, setEmail]=useState("");
   const [celular, setCelular]=useState("");
   const [rol,setRol]=useState("");


  
    useEffect(() => {
        if (entityToUpdate) {
            setNroCedula(entityToUpdate.nroCedula || "");
            setPrimerNombre(entityToUpdate.primer_nombre || "");
            setPrimerApellido(entityToUpdate.primer_apellido || "");
            setSegundoNombre(entityToUpdate.segundo_nombre || "");
            setSegundoApellido(entityToUpdate.segundo_apellido || "");
            setCelular(entityToUpdate.celular || "");
            setEmail(entityToUpdate.email || "");
            setRol(entityToUpdate.rol || "");
        }
    }, [entityToUpdate]);
  
      const handleSubmit = () => {
          
          const newAsignatura = {nroCedula,primer_nombre, primer_apellido, segundo_apellido, segundo_nombre, email, celular, rol};
          onSave(newAsignatura);
      };
  
      return (
        <div className="modal-overlay">
        <div className="modal-container">
            <h2 className="modal-title">{entityToUpdate ? 'Editar docente' : 'Agregar docente'}</h2>

            <div className="modal-form">
                <div className="form-group">
                    <label htmlFor="nroCedula">Número de cédula:</label>
                    <input id="nroCedula" value={nroCedula} onChange={(e) => setNroCedula(e.target.value)} placeholder="Ingrese un número de cédula" />
                </div>
                <div className="form-group">
                    <label htmlFor="primer_nombre">Primer nombre:</label>
                    <input id="primer_nombre" value={primer_nombre} onChange={(e) => setPrimerNombre(e.target.value)} placeholder="Ingrese un nombre" />
                </div>

                <div className="form-group">
                    <label htmlFor="primer_apellido">Primer apellido:</label>
                    <input id="primer_apellido" value={primer_apellido} onChange={(e) => setPrimerApellido(e.target.value)} placeholder="Ingrese un apellido" />
                </div>

                <div className="form-group">
                    <label htmlFor="segundo_nombre">Segundo nombre:</label>
                    <input id="segundo_nombre" value={segundo_nombre} onChange={(e) => setSegundoNombre(e.target.value)} placeholder="Ingrese un nombre" />
                </div>

                <div className="form-group">
                    <label htmlFor="segundo_apellido">Segundo apellido:</label>
                    <input id="segundo_apellido" value={segundo_apellido} onChange={(e) => setSegundoApellido(e.target.value)} placeholder="Ingrese un apellido" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese un correo electrónico" />
                </div>

                <div className="form-group">
                    <label htmlFor="celular">Celular:</label>
                    <input id="celular" value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ingrese un celular" />
                </div>

                <div className="form-group">
                    <label htmlFor="rol">Rol:</label>
                    <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="">Selecciona un rol</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Rector">Rector</option>
                        <option value="Vicerector">Vicerector</option>
                        <option value="Secretaria">Secretaria</option>
                    </select>
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

export default CrearDocente