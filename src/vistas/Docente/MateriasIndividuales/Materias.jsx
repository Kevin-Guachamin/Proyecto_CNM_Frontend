import React,{useState} from 'react'

    ;
import Paginación from '../../Admin/Components/Paginación';

function Materias({ docente, inscripciones, page, totalPages, setPage }) {

 const [search, setSearch] = useState('');

 const filteredData = inscripciones.filter((item) =>
    `${item.Matricula.Estudiante.primer_nombre} ${item.Matricula.Estudiante.primer_apellido}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
    return (
        <div className='Contenedor-general'>
            <h1 className='periodo-title'>{`Materias individuales de ${docente.primer_nombre} ${docente.primer_apellido}`}</h1>
            <div className="filter-container">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                    placeholder={`Filtrar por estudiante`}
                />
                
            </div>
            <div className="Contenedor-tabla">
                {filteredData.length === 0 ? (
                    <p className="no-registros">No hay registros disponibles.</p>
                ) : (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th className='tabla-head'>Estudiante</th>
                                <th className='tabla-head'>Nivel</th>
                                <th className='tabla-head'>Materia</th>
                                <th className='tabla-head'>Docente</th>
                                <th className='tabla-head'>Días</th>
                                <th className='tabla-head'>Hora inicio</th>
                                <th className='tabla-head'>Hora fin</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td className='tabla-celda'>{`${item.Matricula.Estudiante.primer_nombre} ${item.Matricula.Estudiante.primer_apellido}`}</td>
                                    <td className='tabla-celda'>{item.Matricula.Estudiante.nivel}</td>
                                    <td className='tabla-celda'>{item.Asignacion.Materia.nombre}</td>
                                    <td className='tabla-celda'>{`${docente.primer_nombre} ${docente.primer_apellido}`}</td>
                                    <td className='tabla-celda'>{`${item.Asignacion.dias[0]}${item.Asignacion.dias[1] ? `-${item.Asignacion.dias[1]}` : ''}`}</td>
                                    <td className='tabla-celda'>{item.Asignacion.horaInicio}</td>
                                    <td className='tabla-celda'>{item.Asignacion.horaFin}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}
                {Paginación && inscripciones.length > 0 && <Paginación totalPages={totalPages} page={page} setPage={setPage} />}


            </div>
        </div>
    )
}

export default Materias