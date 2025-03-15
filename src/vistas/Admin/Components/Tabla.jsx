import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import "../Styles/Tabla.css";
import Paginación from './Paginación';

function Tabla({ filteredData, OnDelete, OnEdit, headers, columnsToShow,extraIcon,setPage,page,totalPages }) {
  console.log("Estos son los datos:", filteredData)
  return (
    <div className="Contendor-tabla">
      {filteredData.length === 0 ? (
        <p className="no-registros">No hay registros disponibles.</p>
      ) : (
        <table className="tabla_registros">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                {columnsToShow.map((col, subIndex) => (
                  <td key={subIndex}>{item[col]}</td>
                ))}
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
      <Paginación totalPages={totalPages} page={page} setPage={setPage}/>
    </div>
  );
}

export default Tabla;
