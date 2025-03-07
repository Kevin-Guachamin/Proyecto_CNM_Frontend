import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import "./Tabla.css"
import "./common.css"

function Tabla({filteredPeriodos,OnDelete, OnEdit}) {
  return (
    <div className="Contendor-tabla">
        {filteredPeriodos.length === 0 ? (
          <p className="no-periodos">No hay periodos registrados.</p>
        ) : (
          <table className="tabla_periodos">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeriodos.map((periodo, index) => (
                <tr key={index}>
                  <td>{periodo.descripcion}</td>
                  <td>{periodo.fecha_inicio}</td>
                  <td>{periodo.fecha_fin}</td>
                  <td>
                    <FaEdit
                      className="icon edit-icon"
                      onClick={() => OnEdit(periodo)}
                    />
                    <FaTrash
                      className="icon delete-icon"
                      onClick={() => OnDelete(periodo)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  )
}

export default Tabla