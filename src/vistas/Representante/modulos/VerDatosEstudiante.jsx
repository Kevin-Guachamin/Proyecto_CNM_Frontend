import React, { useEffect } from 'react';
import Boton from '../../../components/Boton';
import Loading from '../../../components/Loading';
import { useState } from 'react';

function ViewDataEstudiante({onCancel, isLoading, entity }) {
  const [nroCedula,setNroCedula] = useState(""); // Inicializar con cadena vacia si es que hay valores undefined en entity
  const [primer_nombre, setPrimerNombre] = useState("");
  const [primer_apellido, setPrimerApellido] = useState("");
  const [segundo_nombre, setSegundoNombre] =  useState("");
  const [segundo_apellido, setSegundoApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [anioMatricula, setAnioMatricula] = useState("");
  const [jornada, setJornada] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [grupo_etnico, setGrupoEtnico] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [nroMatricula, setNroMatricula] = useState("");
  const [IER, setIER] = useState("");
  // matricula IER PDF --->
  const [nroCedula_representante, setNroCedulaRepresentante] = useState("");
  const [direccion, setDireccion] = useState("");
  
  /* 
    OJO FALTA COMPROBAR EL FUNCIONAMIENTO CON LOS ARCHIVOS PDFS SUBIDOS
  */

  if (isLoading) { 
    <Loading></Loading>
  }

  useEffect(() => {
   if (entity) {
      setNroCedula(entity.nroCedula || ""); // Set cadena vacia en caso de que haya un dato undefined
      setPrimerNombre(entity.primer_nombre || "");
      setPrimerApellido(entity.primer_apellido || "");
      setSegundoNombre(entity.segundo_nombre || "");
      setSegundoApellido(entity.segundo_apellido || "");
      setGenero(entity.genero || "");
      setAnioMatricula(entity.anioMatricula || "");
      setJornada(entity.jornada || "");
      setFechaNacimiento(entity.fecha_nacimiento || "");
      setGrupoEtnico(entity.grupo_etnico || "");
      setEspecialidad(entity.especialidad || "");
      setNroMatricula(entity.nroMatricula || "");
      setIER(entity.IER || "");
      setNroCedulaRepresentante(entity.nroCedula_representante || "");
      setDireccion(entity.direccion || "");

    } 
  }, [entity]);

  const handleSubmit = () => {
    // Comprobar que el formualrio es valido

    // Comprobar que la actualizacion de datos este habilitada en la fecha establecida
  }

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="modal-title">Información completa de {`${primer_nombre} ${primer_apellido}`}</h2>
  
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
                <label htmlFor="fecha_nacimiento">Fecha de nacimiento :</label>
                <input id="fecha_nacimiento" value={fecha_nacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} placeholder="Ingrese fecha de nacimiento" />
              </div>
              <div className="form-group">
                <label htmlFor="genero">Genero :</label>
                <input id="genero" value={genero} onChange={(e) => setGenero(e.target.value)} placeholder="Ingrese el genero" />
              </div>
            </div>
            
            <div className='rows'>
              <div className="form-group">
                <label htmlFor="grupo_etnico">Grupo étnico :</label>
                <input id="grupo_etnico" value={grupo_etnico} onChange={(e) => setGrupoEtnico(e.target.value)} placeholder="Ingrese el grupo étnico" />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección :</label>
                <input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ingrese la dirección" />
              </div>
            </div>

            <div className='rows'>
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad :</label>
                <input id="especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="jornada">Jornada :</label>
                <input id="jornada" value={jornada} onChange={(e) => setJornada(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className='rows'>
              <div className="form-group">
                <label htmlFor="nroMatricula">#Matrícula :</label>
                <input id="nroMatricula" value={nroMatricula} onChange={(e) => setNroMatricula(e.target.value)} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="anioMatricula">Año de matrícula :</label>
                <input id="anioMatricula" value={anioMatricula} onChange={(e) => setAnioMatricula(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className='rows'>
              <div className="form-group">
                <label htmlFor="IER">IER :</label>
                <input id="IER" value={IER} onChange={(e) => setIER(e.target.value)} placeholder="Ingrese el IER" />
              </div>
              <div className="form-group">
                <label htmlFor="nroCedula_representante"># de cédula representante :</label>
                <input id="nroCedula_representante" value={nroCedula_representante} onChange={(e) => setNroCedulaRepresentante(e.target.value)} placeholder="Ingrese el nro de cédula del representante" />
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
                  
                  //onChange={handleFileChange}
                  accept="application/pdf"
                />
              </label>
              <label>
                Croquis:
                <input
                  type="file"
                  name="croquis"
                  //onChange={handleFileChange}
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

export default ViewDataEstudiante;