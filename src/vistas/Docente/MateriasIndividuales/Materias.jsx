import React, { useState } from 'react'
import MatriculaIndividual from '../Matriculacion/MatriculaIndividual'
function Materias({docente, inscripciones}) {
    const [isModalOpoen,setIsModalOpen]=useState(false)
    const [asignacion,setAsignacion]=useState("")
    const toggleModal = (item) => {
        setIsModalOpen((prev) => !prev);
        setAsignacion(item)
      };
      console.log("este es el docente",docente)
    return (
        <div className='Contenedor-general'>
            <h1>{`Materias individuales de ${docente.primer_nombre} ${docente.primer_apellido}`}</h1>
            {isModalOpoen&& <MatriculaIndividual entityToUpdate={asignacion}/>}
            <div className="Contenedor-tabla">
                {inscripciones.length === 0 ? (
                    <p className="no-registros">No hay registros disponibles.</p>
                ) : (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th className='tabla-head'>Estudainte</th>
                                <th className='tabla-head'>Materia</th>
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
                                    <td className='tabla-celda'>{`${item.Docente.primer_nombre} ${item.Docente.primer_apellido}`}</td>
                                    <td className='tabla-celda'>{`${item.Asignacion.dias[0]}${item.Asignacion.dias[1] ? `-${item.Asignacion.dias[1]}` : ''}`}</td>
                                    <td className='tabla-celda'>{item.Asignacion.horaInicio}</td>
                                    <td className='tabla-celda'>{item.Asignacion.horaFin}</td>
                                    <td className='botones-icon'>
                                        <FaEdit
                                            size={20}
                                            className="icon edit-icon"
                                            onClick={()=>toggleModal(item)}
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