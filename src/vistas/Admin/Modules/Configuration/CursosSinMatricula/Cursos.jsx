import React from 'react';
import { Eliminar } from '../../../../../Utils/CRUD/Eliminar';
import "../../../Styles/Contenedor.css"
import { FaTrash } from 'react-icons/fa'; // Importar íconos


function Cursos({ data,setData }) {
   
    
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;


    const handleDelete = (entity) => {
        Eliminar(entity, `${API_URL}/asignacion/eliminar`, "esta asignación", setData, "ID");
    };

    return (
        <div className='Contenedor-general'>
            <div className="Contenedor-tabla">
                {data.length === 0 ? (
                    <p className="no-registros">No hay registros disponibles.</p>
                ) : (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th className='tabla-head'>Nivel</th>
                                <th className='tabla-head'>Paralelo</th>
                                <th className='tabla-head'>Docente</th>
                                <th className='tabla-head'>Materia</th>
                                <th className='tabla-head'>Días</th>
                                <th className='tabla-head'>Hora inicio</th>
                                <th className='tabla-head'>Hora fin</th>
                                <th className='tabla-head'>Cupos</th>
                                <th className='tabla-head'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className='tabla-celda'>{item.Materia.nivel}</td>
                                    <td className='tabla-celda'>{item.paralelo}</td>
                                    <td className='tabla-celda'>{`${item.Docente.primer_nombre} ${item.Docente.primer_apellido}`}</td>
                                    <td className='tabla-celda'>{item.Materia.nombre}</td>
                                    <td className='tabla-celda'>{`${item.dias[0]}${item.dias[1] ? `-${item.dias[1]}` : ''}`}</td>
                                    <td className='tabla-celda'>{item.horaInicio}</td>
                                    <td className='tabla-celda'>{item.horaFin}</td>
                                    <td className='tabla-celda'>{item.cupos}</td>
                                    <td className='botones-icon'>
                                       
                                        <FaTrash
                                            size={20}
                                            className="icon delete-icon"
                                            onClick={() => handleDelete(item)}
                                            title='eliminar'
                                        />

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}



            </div>


           
        </div>
    );
}

export default Cursos;