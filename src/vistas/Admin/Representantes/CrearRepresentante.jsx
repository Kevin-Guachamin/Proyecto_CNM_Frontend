import React, { useEffect, useState } from 'react';
import Boton from '../../../components/Boton';
import '../Styles/CrearEntidad.css';

function CrearRepresentante({ onCancel, entityToUpdate, onSave }) {
  const [nroCedula, setNroCedula] = useState("")
  const [primer_nombre, setPrimerNombre] = useState("");
  const [primer_apellido, setPrimerApellido] = useState("");
  const [segundo_nombre, setSegundoNombre] = useState("");
  const [segundo_apellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [convencional, setConvencional] = useState("");
  const [emergencia, setEmergencia] = useState("");


  useEffect(() => {
    if (entityToUpdate) {
      setNroCedula(entityToUpdate.nroCedula || "");
      setPrimerNombre(entityToUpdate.primer_nombre || "");
      setPrimerApellido(entityToUpdate.primer_apellido || "");
      setSegundoNombre(entityToUpdate.segundo_nombre || "");
      setSegundoApellido(entityToUpdate.segundo_apellido || "");
      setCelular(entityToUpdate.celular || "");
      setEmail(entityToUpdate.email || "");
      setConvencional(entityToUpdate.convencional || "")
      setEmergencia(entityToUpdate.emergencia || "")
    }
  }, [entityToUpdate]);

    const [files, setFiles] = useState({
      copiaCedula: null,
      croquis: null,
    });
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFiles((prevState) => ({
      ...prevState,
      [name]: files[0], // Solo se selecciona un archivo por input
    }));
  };
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("copiaCedula", files.copiaCedula);
    formData.append("croquis", files.croquis);
    formData.append("nroCedula",nroCedula)
    formData.append("primer_nombre",primer_nombre)
    formData.append("primer_apellido",primer_apellido)
    formData.append("segundo_nombre",segundo_nombre)
    formData.append("segundo_apellido",segundo_apellido)
    formData.append("email",email)
    formData.append("celular",celular)
    formData.append("convencional",convencional)
    formData.append("emergencia",emergencia)
    
    onSave(formData,{ headers: { "Content-Type": "multipart/form-data" } });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{entityToUpdate ? 'Editar representante' : 'Agregar representante'}</h2>

        <div className="modal-form">
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="nroCedula">Número de cédula:</label>
              <input id="nroCedula" value={nroCedula} onChange={(e) => setNroCedula(e.target.value)} placeholder="Ingrese un número de cédula" />
            </div>
            <div className="form-group">
              <label htmlFor="celular">#Celular:</label>
              <input id="celular" value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ingrese un celular" />
            </div>

          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="primer_nombre">Primer nombre:</label>
              <input id="primer_nombre" value={primer_nombre} onChange={(e) => setPrimerNombre(e.target.value)} placeholder="Ingrese un nombre" />
            </div>

            <div className="form-group">
              <label htmlFor="primer_apellido">Primer apellido:</label>
              <input id="primer_apellido" value={primer_apellido} onChange={(e) => setPrimerApellido(e.target.value)} placeholder="Ingrese un apellido" />
            </div>
          </div>

          <div className='rows'>
            <div className="form-group">
              <label htmlFor="segundo_nombre">Segundo nombre:</label>
              <input id="segundo_nombre" value={segundo_nombre} onChange={(e) => setSegundoNombre(e.target.value)} placeholder="Ingrese un nombre" />
            </div>

            <div className="form-group">
              <label htmlFor="segundo_apellido">Segundo apellido:</label>
              <input id="segundo_apellido" value={segundo_apellido} onChange={(e) => setSegundoApellido(e.target.value)} placeholder="Ingrese un apellido" />
            </div>

          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="convencional">#Convencional :</label>
              <input id="convencional" value={convencional} onChange={(e) => setConvencional(e.target.value)} placeholder="Este campo es opcional" />
            </div>
            <div className="form-group">
              <label htmlFor="convencional">#Emergencia :</label>
              <input id="convencional" value={emergencia} onChange={(e) => setEmergencia(e.target.value)} placeholder="Ingrese un celular" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese un correo electrónico" />
          </div>
          <div className='rows'>
            
            <label>
              Copia de Cédula:
              <input
                type="file"
                name="copiaCedula"
                
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </label>
            <label>
              Croquis:
              <input
                type="file"
                name="croquis"
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </label>
            
          </div>
        </div>

        <div className="botones">
          <Boton texto="Guardar" onClick={() => handleSubmit()} estilo="boton-crear" />
          <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
        </div>
      </div>
    </div>
  )
}


export default CrearRepresentante