import React, { useState,useEffect } from 'react'
import MatriculaIndividual from '../Matriculacion/MatriculaIndividual'
import { FaEdit } from 'react-icons/fa'; // Importar íconos
import axios from 'axios';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import Swal from 'sweetalert2';

function Materias({docente, inscripciones, setInscripciones}) {
    console.log("estas son las inscripciones",inscripciones)
    const [isModalOpoen,setIsModalOpen]=useState(false)
    const [asignacion,setAsignacion]=useState("")
    const [periodo,setPeriodo]=useState("")
    const token=localStorage.getItem("token")

    const toggleModal = (item) => {
        console.log("este es el item",item)
        setIsModalOpen((prev) => !prev);
        setAsignacion(item)
      };
      console.log("este es el docente",docente)
      const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
      useEffect(() => {
  
          axios.get(`${API_URL}/periodo_academico/activo`, {
              headers: { Authorization: `Bearer ${token}` },
          })
              .then(response => {
                  setPeriodo(response.data);
              })
              .catch(error => {
                  ErrorMessage(error)
  
              });
      }, [API_URL, token]);
      const EditarInscripcion =(newAsignacion)=>{
        console.log("esta es la asignación",asignacion)
        axios.put(`${API_URL}/asignacion/editar/${asignacion.ID}`,newAsignacion,{headers: { Authorization: `Bearer ${token}` },
        })
            .then(res=>{
                setIsModalOpen(false)
                setInscripciones((prevData) => {
                    return prevData.map((inscripcion) => {
                        console.log("este es el primer ID",inscripcion.Asignacion.ID)
                        
                      if (inscripcion.Asignacion.ID === asignacion.ID) {
                        console.log("esta fue la",inscripcion)
                        return {
                          ...inscripcion,
                          Asignacion: res.data, // actualiza solo el atributo Asignacion
                        };
                      }
                      return inscripcion; // si no coincide, devuelve la inscripción tal cual
                    });
                  });
                Swal.fire({
                                icon: "success",
                                title: "Edición exitosa",
                                iconColor: "#218838",
                                confirmButtonText: "Entendido",
                                confirmButtonColor: "#003F89",
                            });
            })
            .catch(err=>{
                ErrorMessage(err)
            })

      }
    return (
        <div className='Contenedor-general'>
            <h1>{`Materias individuales de ${docente.primer_nombre} ${docente.primer_apellido}`}</h1>
            {isModalOpoen&& <MatriculaIndividual entityToUpdate={asignacion} onCancel={toggleModal} docente={docente} periodo={periodo.ID} onSave={EditarInscripcion}/>}
            <div className="Contenedor-tabla">
                {inscripciones.length === 0 ? (
                    <p className="no-registros">No hay registros disponibles.</p>
                ) : (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th className='tabla-head'>Estudiante</th>
                                <th className='tabla-head'>Materia</th>
                                <th className='tabla-head'>Docente</th>
                                <th className='tabla-head'>Días</th>
                                <th className='tabla-head'>Hora inicio</th>
                                <th className='tabla-head'>Hora fin</th>
                                <th className='tabla-head'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscripciones.map((item, index) => (
                                <tr key={index}>
                                    <td className='tabla-celda'>{`${item.Matricula.Estudiante.primer_nombre} ${item.Matricula.Estudiante.primer_apellido}`}</td>
                                    <td className='tabla-celda'>{item.Asignacion.Materia.nombre}</td>
                                    <td className='tabla-celda'>{`${docente.primer_nombre} ${docente.primer_apellido}`}</td>
                                    <td className='tabla-celda'>{`${item.Asignacion.dias[0]}${item.Asignacion.dias[1] ? `-${item.Asignacion.dias[1]}` : ''}`}</td>
                                    <td className='tabla-celda'>{item.Asignacion.horaInicio}</td>
                                    <td className='tabla-celda'>{item.Asignacion.horaFin}</td>
                                    <td className='botones-icon'>
                                        <FaEdit
                                            size={20}
                                            className="icon edit-icon"
                                            onClick={()=>toggleModal(item.Asignacion)}
                                        />
                
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}



            </div>
        </div>
    )
}

export default Materias