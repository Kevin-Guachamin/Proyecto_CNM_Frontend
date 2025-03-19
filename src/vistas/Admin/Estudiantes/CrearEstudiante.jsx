import React, { useEffect, useState } from 'react';
import Boton from '../../../components/Boton';
import DatePicker from 'react-datepicker';
import '../Styles/CrearEntidad.css';
import "react-datepicker/dist/react-datepicker.css";

function CrearEstudiante({ onCancel, entityToUpdate, onSave }) {
  const [nroCedula, setNroCedula] = useState("")
  const [primer_nombre, setPrimerNombre] = useState("");
  const [primer_apellido, setPrimerApellido] = useState("");
  const [segundo_nombre, setSegundoNombre] = useState("");
  const [segundo_apellido, setSegundoApellido] = useState("");
  const [genero, setGenero] = useState("")
  const [jornada, setJornada] = useState("")
  const [fecha_nacimiento, setFechaNacimiento] = useState("")
  const [grupo_etnico, setGrupoEtnico] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [IER, setIER] = useState("")
  const [direccion, setDireccion] = useState("")


  useEffect(() => {
    if (entityToUpdate) {
      setNroCedula(entityToUpdate.nroCedula || "");
      setPrimerNombre(entityToUpdate.primer_nombre || "");
      setPrimerApellido(entityToUpdate.primer_apellido || "");
      setSegundoNombre(entityToUpdate.segundo_nombre || "");
      setSegundoApellido(entityToUpdate.segundo_apellido || "");
      setGenero(entityToUpdate.genero || "");
      setJornada(entityToUpdate.jornada || "")
      setFechaNacimiento(entityToUpdate.fecha_nacimiento || "")
      setGrupoEtnico(entityToUpdate.grupo_etnico || "")
      setEspecialidad(entityToUpdate.especialidad || "")
      setIER(entityToUpdate.IER || "")
      setDireccion(entityToUpdate.direccion || "")
    }
  }, [entityToUpdate]);
  const generarNumeroMatricula = (anio, idEstudiante) => {
    const secuencial = String(idEstudiante).padStart(4, "0"); // Asegura 4 dígitos
    return `${anio}${secuencial}`;
  };

  const [files, setFiles] = useState({
    copiaCedula: null,
    matricula_IER: null,
  });
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFiles((prevState) => ({
      ...prevState,
      [name]: files[0], // Solo se selecciona un archivo por input
    }));
  };
  const handleSubmit = () => {
    const formattedFechaNacimiento = fecha_nacimiento ? fecha_nacimiento.toISOString().split('T')[0] : null;
    const formData = new FormData();
    formData.append("copiaCedula", files.copiaCedula);
    formData.append("matricula_IER", files.matricula_IER);
    formData.append("nroCedula", nroCedula)
    formData.append("primer_nombre", primer_nombre)
    formData.append("primer_apellido", primer_apellido)
    formData.append("segundo_nombre", segundo_nombre)
    formData.append("segundo_apellido", segundo_apellido)
    formData.append("genero", genero)
    formData.append("jornada", jornada)
    formData.append("fecha_nacimiento", formattedFechaNacimiento)
    formData.append("grupo_etnico", grupo_etnico)
    formData.append("especialidad", especialidad)
    formData.append("IER", IER)
    formData.append("direccion", direccion)

    onSave(formData, { headers: { "Content-Type": "multipart/form-data" } });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{entityToUpdate ? 'Editar estudiante' : 'Agregar estudiante'}</h2>

        <div className="modal-form">
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="nroCedula">Número de cédula:</label>
              <input id="nroCedula" value={nroCedula} onChange={(e) => setNroCedula(e.target.value)} placeholder="Ingrese un número de cédula" />
            </div>
            <div className="form-group">
              <label htmlFor="nroMatricula">Nro. Matricula:</label>
              <input id="nroMatricula" value={entityToUpdate ? generarNumeroMatricula(entityToUpdate.anioMatricula, entityToUpdate.ID) : ""} placeholder="Se genera automaticamente" readOnly />
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
              <label htmlFor="jornada">Jornada :</label>
              <select id="jornada" value={jornada} onChange={(e) => setJornada(e.target.value)}>
                <option value="">Selecciona una jornada</option>
                <option value="Matutina">Matutina</option>
                <option value="Vespertina">Vespertina</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="genero">Genero:</label>
              <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value="">Selecciona un genero</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <DatePicker
                selected={fecha_nacimiento}
                onChange={(date) => setFechaNacimiento(date)} // Establecer directamente como Date
                dateFormat="dd/MM/yyyy"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="grupo_etnico">Grupo Etnico:</label>
              <select id="genero" value={grupo_etnico} onChange={(e) => setGrupoEtnico(e.target.value)}>
                <option value="">Selecciona un grupo étnico</option>
                <option value="Indígena">Indígena</option>
                <option value="Meztizo">Meztizo</option>
                <option value="Afroecuatoriano">Afroecuatoriano</option>
              </select>
            </div>
          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad:</label>
              <input id="especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ingrese la especialidad" />
            </div>
            <div className="form-group">
              <label htmlFor="IER">Institución de eduación regular:</label>
              <input id="IER" value={IER} onChange={(e) => setIER(e.target.value)} placeholder="Ingrese una institución de educación" />
            </div>
          </div>
          <div className="form-group">
              <label htmlFor="direccion">Institución de eduación regular:</label>
              <input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ingrese la dirección del domicilio" />
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
              Matrícula IER:
              <input
                type="file"
                name="matricula_IER"
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


export default CrearEstudiante