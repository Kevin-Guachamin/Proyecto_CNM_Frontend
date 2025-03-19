import React from 'react';
import Boton from '../../../components/Boton';

function ViewData({onCancel, entity }) {

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="modal-title">Información completa de {`${entity.primer_nombre} ${entity.primer_apellido}`}</h2>
  
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

export default ViewData