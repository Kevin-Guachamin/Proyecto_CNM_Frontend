import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import { IoEyeOutline } from "react-icons/io5";
import "../../../Styles/Tabla.css";


function TablaEstudiantil({ filteredData, OnDelete, OnEdit, headers, columnsToShow, OnView }) {

  return (
    <div className="Contenedor-tabla">
      {filteredData.length === 0 ? (
        <p className="no-registros">No hay registros disponibles.</p>
      ) : (
        <div className="tabla-scroll"> {/* Nuevo contenedor con scroll */}
          <table className="tabla_registros">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th className='tabla-head' key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  {columnsToShow.map((col, subIndex) => (
                    <td className="tabla-celda" key={subIndex}>{item[col]}</td>
                  ))}
                  <td className='botones-icon'>
                    <FaEdit size={20} title='editar' className="icon edit-icon" onClick={() => OnEdit(item)} />
                    <FaTrash size={20} title='eliminar' className="icon delete-icon" onClick={() => OnDelete(item)} />
                    <IoEyeOutline size={20} title='ver información' className='view-icon' onClick={() => OnView(item)} />
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

export default TablaEstudiantil;
