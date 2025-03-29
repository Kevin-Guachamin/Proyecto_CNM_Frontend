import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import AutoCompleteInput from './AutoCompleteInput';
import Boton from '../../../components/Boton';

function CrearCurso({ onCancel, entityToUpdate, onSave, periodo }) {
  const [paralelo, setParalelo] = useState("");
  const [docente, setDocente] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [asignaturas, setAsignaturas] = useState([])
  const [dia1, setDia1] = useState("")
  const [dia2, setDia2] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFin, setHoraFin] = useState("")
  const [cupos, setCupos] = useState("")
  const [docentes, setDocentes] = useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  useEffect(() => {
    axios.get(`${API_URL}/docente/obtener`)
      .then(response => {
        setDocentes(response.data);
        console.log("estos son los docentes:", docentes)
      })
      .catch(error => {
        ErrorMessage(error);

      })
    axios.get(`${API_URL}/materia/obtener`)
      .then(response => {
        setAsignaturas(response.data);

      })
      .catch(error => {
        ErrorMessage(error);

      })


  }, [API_URL, setDocentes])
  useEffect(() => {
    if (entityToUpdate) {

      setParalelo(entityToUpdate.paralelo || "");
      setDocente(entityToUpdate.Docente || "");
      setAsignatura(entityToUpdate.Materia.nombre || "");
      setDia1(entityToUpdate.dias[1] || "")
      setDia2(entityToUpdate.dias[2] || "")
      setHoraInicio(entityToUpdate.horaInicio || "")
      setHoraFin(entityToUpdate.horaFin || "")
      setCupos(entityToUpdate.cupos || "")
    }
  }, [entityToUpdate]);

  const handleSubmit = () => {

    const dias = [dia1, dia2]
    const newAsignacion = { paralelo, horaInicio, horaFin, dias, cupos, id_periodo_academico: periodo.id, nroCedula_docente: docente.nroCedula, id_materia: asignatura.ID };
    onSave(newAsignacion);
  };

  return (
    <div className="modal-overlay">
      <div className='modal-container'>
        <h2 className='modal-title'>{entityToUpdate ? 'Editar curso' : 'Agregar curso'}</h2>
        <div className="modal-form">

          <div className="form-group">
            <label htmlFor="asignaturas">Asignaturas</label>
            <AutoCompleteInput inputValue={asignatura} setInputValue={setAsignatura} opciones={asignaturas} key1="nombre" key2="nivel" />
          </div>
          <div className="form-group">
            <label htmlFor="docentes">Docentes</label>
            <AutoCompleteInput inputValue={docente} setInputValue={setDocente} opciones={docentes} key1="primer_nombre" key2="primer_apellido" />
          </div>
          <div className='form-group'>
            <label htmlFor="">Paralelo</label>
            <input type="text" value={paralelo} onChange={(e) => setParalelo(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="Dia1">Día 1</label>
            <select id="Dia1" value={dia1} onChange={(e) => setDia1(e.target.value)}>
              <option value="">Selecciona un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miercóles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Dia2">Día 2</label>
            <select id="Dia2" value={dia2} onChange={(e) => setDia2(e.target.value)}>
              <option value="">Selecciona un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miercóles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor="">Horar inicio</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              // Intervalos de 15 minutos (900 segundos)
              min="07:00" // Inicio a las 7:00 AM
              max="19:00" // Fin a las 19:00 PM
            />
          </div>
          <div className='form-group'>
            <label htmlFor="">Horar fin</label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              // Intervalos de 15 minutos (900 segundos)
              min="07:00" // Inicio a las 7:00 AM
              max="19:00" // Fin a las 19:00 PM
            />
          </div>
          <div className="form-group">
            <label htmlFor="cupos">Cupos</label>
            <input
              id="cupos"
              type="number"
              min="0"
              max="120"
              value={cupos}
              onChange={(e) => setCupos(e.target.value)}
              className="form-control"
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

export default CrearCurso