import { FaEdit, FaTrash } from 'react-icons/fa';
import "../../../Styles/Tabla.css";

function Tabla({ filteredData, OnDelete, OnEdit }) {
  return (
    <div className="Contenedor-tabla">
      {filteredData.length === 0 ? (
        <p className="no-registros">No hay registros disponibles.</p>
      ) : (
        // 👇 Wrapper para scroll horizontal (el vertical lo maneja el contenedor padre)
        <div className="tabla-scroll-x">
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
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className='tabla-celda'>{item.Materia?.nivel}</td>
                  <td className='tabla-celda'>{item.paralelo}</td>
                  <td className='tabla-celda'>
                    {`${item.Docente?.primer_nombre ?? ""} ${item.Docente?.primer_apellido ?? ""}`}
                  </td>
                  <td className='tabla-celda'>{item.Materia?.nombre}</td>
                  <td className='tabla-celda'>
                    {Array.isArray(item.dias) && item.dias.length > 0
                      ? item.dias.filter(Boolean).join("-")
                      : ""}
                  </td>
                  <td className='tabla-celda'>{item.horaInicio}</td>
                  <td className='tabla-celda'>{item.horaFin}</td>
                  <td className='tabla-celda'>{item.cupos}</td>
                  <td className='botones-icon'>
                    <FaEdit
                      size={20}
                      className="icon edit-icon"
                      onClick={() => OnEdit(item)}
                      title='editar'
                    />
                    <FaTrash
                      size={20}
                      className="icon delete-icon"
                      onClick={() => OnDelete(item)}
                      title='eliminar'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Tabla;
