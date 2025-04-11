import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import { IoEyeOutline } from "react-icons/io5";
import "../../../Styles/Tabla.css";


function TablaEstudiantes({ filteredData, OnDelete, OnEdit, headers, columnsToShow,OnView}) {
  
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
                <td className='botones-icon'>
                  <FaEdit
                  size={20}
                    className="icon edit-icon"
                    onClick={() => OnEdit(item)}
                  />
                  <FaTrash
                  size={20}
                    className="icon delete-icon"
                    onClick={() => OnDelete(item)}
                  />
                  <IoEyeOutline
                  size={20}
                  className='view-icon'
                  onClick={()=>OnView(item)}
                  />
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      )}
      
      
      
    </div>
  );
}

export default TablaEstudiantes;
