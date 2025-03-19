import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import "../Styles/Tabla.css";


function Tabla({ filteredData, OnDelete, OnEdit, headers, columnsToShow,extraIcon }) {
  
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
      
      
      
    </div>
  );
}

export default Tabla;
