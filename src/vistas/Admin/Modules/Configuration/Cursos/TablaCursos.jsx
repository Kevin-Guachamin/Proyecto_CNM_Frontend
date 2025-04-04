import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import "../../../Styles/Tabla.css"

function Tabla({ filteredData, OnDelete, OnEdit, extraIcon }) {

    return (
        <div className="Contendor-tabla">
            {filteredData.length === 0 ? (
                <p className="no-registros">No hay registros disponibles.</p>
            ) : (
                <table className="tabla_registros">
                    <thead>
                        <tr>
                            <th>Nivel</th>
                            <th>Paralelo</th>
                            <th>Docente</th>
                            <th>Materia</th>
                            <th>Días</th>
                            <th>Hora inicio</th>
                            <th>Hora fin</th>
                            <th>Cupos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td >{item.Materia.nivel}</td>
                                <td >{item.paralelo}</td>
                                <td >{`${item.Docente.primer_nombre} ${item.Docente.primer_apellido}`}</td>
                                <td>{item.Materia.nombre}</td>
                                <td>{`${item.dias[0]}${item.dias[1] ? `-${item.dias[1]}` : ''}`}</td>
                                <td>{item.horaInicio}</td>
                                <td>{item.horaFin}</td>
                                <td>{item.cupos}</td>
                                <td>
                                    <FaEdit
                                        className="icon edit-icon"
                                        onClick={() => OnEdit(item)}
                                    />
                                    <FaTrash
                                        className="icon delete-icon"
                                        onClick={() => OnDelete(item)}
                                    />
                                    {extraIcon && extraIcon(item)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            )}



        </div>
    );
}

export default Tabla;