import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import SelectInput from './SelectInput';
import Boton from '../../../../../components/Boton';
import SelectorHoraMinuto from './SelectorHoraMinuto';
import AutoCompleteInput from './AutoCompleteInput';

function CrearCurso({ onCancel, entityToUpdate, onSave, periodo }) {
  const [paralelo, setParalelo] = useState("");
  const [docente, setDocente] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [asignaturas, setAsignaturas] = useState([])
  const [dia1, setDia1] = useState("")
  const [dia2, setDia2] = useState("")
  const [horaInicio, setHoraInicio] = useState("07:00")
  const [horaFin, setHoraFin] = useState("08:00")
  const [cupos, setCupos] = useState("")
  const [docentes, setDocentes] = useState([])
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token")
  useEffect(() => {
    axios.get(`${API_URL}/docente/obtener?limit=${1000}`,{
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log("estos son los docentes de la base", response.data.data)
        setDocentes(response.data.data);

      })
      .catch(error => {
        ErrorMessage(error);

      })
    axios.get(`${API_URL}/materia/obtener?limit=${1000}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log("esto se recibio", response.data)
        setAsignaturas(response.data);

      })
      .catch(error => {
        ErrorMessage(error);

      })


  }, [API_URL, setDocentes])
  useEffect(() => {
    if (entityToUpdate) {
      setParalelo(entityToUpdate.paralelo || "");
      
      // Para docente, buscar el objeto completo en la lista de docentes
      if (entityToUpdate.Docente && docentes.length > 0) {
        const docenteCompleto = docentes.find(d => 
          d.nroCedula === entityToUpdate.Docente.nroCedula || 
          d.nroCedula === entityToUpdate.nroCedula_docente
        );
        setDocente(docenteCompleto || null);
      }
      
      // Para asignatura, buscar el objeto completo en la lista de asignaturas
      if (entityToUpdate.Materia && asignaturas.length > 0) {
        const asignaturaCompleta = asignaturas.find(a => 
          a.ID === entityToUpdate.Materia.ID || 
          a.ID === entityToUpdate.ID_materia
        );
        setAsignatura(asignaturaCompleta || null);
      }
      
      setDia1(entityToUpdate.dias[0] || "")
      setDia2(entityToUpdate.dias[1] || "")
      setHoraInicio(entityToUpdate.horaInicio || "")
      setHoraFin(entityToUpdate.horaFin || "")
      setCupos(entityToUpdate.cupos || "")
    }
  }, [entityToUpdate, docentes, asignaturas]);

  const handleSubmit = () => {
    try {
      if (!periodo) {
        throw new Error("No se ha seleccionado un periodo");
      }
      
      if (!asignatura) {
        throw new Error("Debe seleccionar una asignatura");
      }
      
      if (!docente) {
        throw new Error("Debe seleccionar un docente");
      }
      
      if (!paralelo.trim()) {
        throw new Error("Debe ingresar un paralelo");
      }
      
      if (!horaInicio || !horaFin) {
        throw new Error("Debe seleccionar hora de inicio y fin");
      }
      
      // Validar que la hora de fin sea mayor que la hora de inicio
      if (horaFin <= horaInicio) {
        throw new Error("La hora de fin debe ser mayor que la hora de inicio");
      }
      
      if (!cupos || cupos <= 0) {
        throw new Error("Debe ingresar un número válido de cupos");
      }
      
      let dias
      if (dia1 === "") {
        dias = [dia2]
      }
      else if (dia2 === "") {
        dias = [dia1]
      }
      else {
        dias = [dia1, dia2]
      }
      
      if (dias.length === 0) {
        throw new Error("Debe seleccionar al menos un día");
      }
      
      if (dia1 === dia2 && dia1 !== "") {
        throw new Error("Los días deben ser diferentes")
      }
      
      console.log("esta es la asignatura", asignatura.ID)
      const newAsignacion = { 
        paralelo, 
        horaInicio, 
        horaFin, 
        dias, 
        cupos: Number(cupos), 
        ID_periodo_academico: Number(periodo), 
        nroCedula_docente: docente.nroCedula, 
        ID_materia: asignatura.ID 
      };
      onSave(newAsignacion, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      ErrorMessage(error)
    }
  };

  return (
    <div className="modal-overlay">
      <div className='modal-container modal-curso'>
        <h2 className='modal-title'>{entityToUpdate ? 'Editar curso' : 'Agregar curso'}</h2>
        <div className="modal-form">
          <div className='rows'>

            <div className="form-group">
              <label htmlFor="asignaturas">Asignatura:</label>
              <AutoCompleteInput inputValue={asignatura} setInputValue={setAsignatura} opciones={asignaturas} key1="nombre" key2="nivel" />
            </div>

            <div className="form-group">
              <label htmlFor="docentes">Docente:</label>
              <AutoCompleteInput inputValue={docente} setInputValue={setDocente} opciones={docentes} key1="primer_nombre" key2="primer_apellido" />
            </div>
          </div>
          <div className='rows'>

            <div className='form-group'>
              <label htmlFor="">Paralelo:</label>
              <input type="text" value={paralelo} onChange={(e) => setParalelo(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="Dia1">Día 1:</label>
              <select id="Dia1" value={dia1} onChange={(e) => setDia1(e.target.value)}>
                <option value="">Selecciona un día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miercóles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor="">Hora inicio:</label>
              <SelectorHoraMinuto
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                min="07:00"
                max="19:00"
              />


            </div>
          </div>
          <div className='rows'>
            <div className="form-group">
              <label htmlFor="cupos">Cupos:</label>
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
            <div className="form-group">
              <label htmlFor="Dia2">Día 2:</label>
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
              <label htmlFor="">Hora fin:</label>
              <SelectorHoraMinuto
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                min="07:00"
                max="19:00"
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

export default CrearCurso