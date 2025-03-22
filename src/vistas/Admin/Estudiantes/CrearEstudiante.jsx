import React, { useEffect, useState } from 'react';
import Boton from '../../../components/Boton';
import DatePicker from 'react-datepicker';
import '../Styles/CrearEntidad.css';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';

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
  const [sector, setSector] = useState("")
  const [parroquia, setParroquia] = useState("")
  const [canton, setCanton] = useState("")
  const [edad, setEdad] = useState("")
  const [nroMatricula, setNroMatricula] = useState("")

  function calcularEdad(fechaNacimiento) {
    console.log("esta fue la fecha", fechaNacimiento)
    let fechaNac = fechaNacimiento; // Convertir la fecha a objeto Date
    let hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear(); // Restar años

    // Ajustar si aún no ha pasado el cumpleaños este año
    let mesActual = hoy.getMonth();
    let diaActual = hoy.getDate();
    let mesNac = fechaNac.getMonth();
    let diaNac = fechaNac.getDate();

    if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
      edad--;
    }

    return edad;
  }

  const convertirFecha = (fecha) => {
    if (!fecha) return null;
    const [dia, mes, año] = fecha.split('/');
    return new Date(`${año}-${mes}-${dia}`); // Convertir a formato ISO (yyyy-mm-dd)
  };
  useEffect(() => {
    if (entityToUpdate) {
      setNroCedula(entityToUpdate.nroCedula || "");
      setPrimerNombre(entityToUpdate.primer_nombre || "");
      setPrimerApellido(entityToUpdate.primer_apellido || "");
      setSegundoNombre(entityToUpdate.segundo_nombre || "");
      setSegundoApellido(entityToUpdate.segundo_apellido || "");
      setGenero(entityToUpdate.genero || "");
      setJornada(entityToUpdate.jornada || "")
      setFechaNacimiento(convertirFecha(entityToUpdate.fecha_nacimiento) || "")
      setGrupoEtnico(entityToUpdate.grupo_etnico || "")
      setEspecialidad(entityToUpdate.especialidad || "")
      setIER(entityToUpdate.IER || "")
      const palabras = entityToUpdate.direccion.split(" ")
      setSector(palabras[0] || "")
      setParroquia(palabras[1] || "")
      setCanton(palabras[2] || "")
      setNroMatricula(entityToUpdate.nroMatricula || "")

      setEdad(calcularEdad(convertirFecha(entityToUpdate.fecha_nacimiento)) || "")

    }
  }, [entityToUpdate]);
  const generarCodigoEstudiante = (anio, idEstudiante) => {
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

  const handleDownload = async (filePath) => {
    const parts = filePath.split("\\");
    const folder = parts[1]; // Subcarpeta (ej: "Estudiantes")
    const filename = parts[2]; // Nombre del archivo (ej: "ProyectoCNM.pdf")

    try {
      const response = await axios.get(
        `http://localhost:8000/estudiante/download/${folder}/${filename}`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      ErrorMessage(error)
    }
  }
  const handleSubmit = () => {
    const direccion = [sector, parroquia, canton].join(" ")
    
    console.log("fecha de nacimiento enviada a la base", fecha_nacimiento)
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
    formData.append("fecha_nacimiento", fecha_nacimiento)
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
              <input id="nroCedula" value={nroCedula} onChange={(e) => setNroCedula(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="nroMatricula">Código estudiante:</label>
              <input id="nroMatricula" value={entityToUpdate ? generarCodigoEstudiante(entityToUpdate.anioMatricula, entityToUpdate.ID) : ""} readOnly />
            </div>
          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="primer_nombre">Primer nombre:</label>
              <input id="primer_nombre" value={primer_nombre} onChange={(e) => setPrimerNombre(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="primer_apellido">Primer apellido:</label>
              <input id="primer_apellido" value={primer_apellido} onChange={(e) => setPrimerApellido(e.target.value)} />
            </div>
          </div>

          <div className='rows'>
            <div className="form-group">
              <label htmlFor="segundo_nombre">Segundo nombre:</label>
              <input id="segundo_nombre" value={segundo_nombre} onChange={(e) => setSegundoNombre(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="segundo_apellido">Segundo apellido:</label>
              <input id="segundo_apellido" value={segundo_apellido} onChange={(e) => setSegundoApellido(e.target.value)} />
            </div>

          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="edad">Edad:</label>
              <input id="edad" value={edad} readOnly />
            </div>

            <div className="form-group">
              <label htmlFor="Nro matrícula">Nro. matrícula:</label>
              <input id="nro matrícula" value={nroMatricula} readOnly />
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
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento:</label>
              <DatePicker
                selected={fecha_nacimiento}
                onChange={(date) => setFechaNacimiento(date)}
                dateFormat="dd/MM/yyyy"
                className="input-field"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                openToDate={new Date(new Date().setFullYear(new Date().getFullYear() - 9))} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="grupo_etnico">Grupo Etnico:</label>
              <select id="genero" value={grupo_etnico} onChange={(e) => setGrupoEtnico(e.target.value)}>
                <option value="">Selecciona un grupo</option>
                <option value="Indígena">Indígena</option>
                <option value="Mestizo">Mestizo</option>
                <option value="Afro-descendiente">Afro-descendiente</option>
                <option value="Negro">Negro</option>
                <option value="Blanco">Blanco</option>
              </select>
            </div>
          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad:</label>
              <input id="especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="IER">Institución de eduación regular:</label>
              <input id="IER" value={IER} onChange={(e) => setIER(e.target.value)} />
            </div>
          </div>
          <div className='rows'>
            <label htmlFor="direccion">Dirección:</label>
          </div>
          <div className='rows'>
            <div className='form-group-direccion'>
              <label htmlFor="">Sector: </label>
              <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} />
            </div>
            <div className='form-group-direccion'>
              <label htmlFor="">Parroquia: </label>
              <input type="text" value={parroquia} onChange={(e) => setParroquia(e.target.value)} />
            </div>
            <div className='form-group-direccion'>
              <label htmlFor="">Canton: </label>
              <input type="text" value={canton} onChange={(e) => setCanton(e.target.value)} />
            </div>


          </div>
          <div className="file-upload-container">
            <div className="file-upload">
              <label htmlFor="copiaCedula" className="custom-file-label">
                Copia de Cédula:
              </label>
              <input
                type="file"
                id="copiaCedula"
                name="copiaCedula"
                onChange={handleFileChange}
                accept="application/pdf"
                className="custom-file-input"
              />
              {/* Botón de descarga condicional */}
              {entityToUpdate && (
                <button className="download-button" onClick={() => handleDownload(entityToUpdate.cedula_PDF)}>
                  <FontAwesomeIcon icon={faDownload} className="icon" />
                  Descargar documento
                </button>
              )}
            </div>

            <div className="file-upload">
              <label htmlFor="matricula_IER" className="custom-file-label">
                Matrícula IER:
              </label>
              <input
                type="file"
                id="matricula_IER"
                name="matricula_IER"
                onChange={handleFileChange}
                accept="application/pdf"
                className="custom-file-input"
                required
              />
              {/* Botón de descarga condicional */}
              {entityToUpdate && (
                <button className="download-button" onClick={() => handleDownload(entityToUpdate.matricula_IER_PDF)}>
                  <FontAwesomeIcon icon={faDownload} className="icon" />
                  Descargar documento
                </button>
              )}
            </div>
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