import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Tabla.css"

const Tabla = ({ columnas, columnasAgrupadas, datos }) => {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered table-striped custom-table">
        <thead>
          {columnasAgrupadas && (
            <tr>
              {columnasAgrupadas.map((grupo, index) => (
                <th key={index} colSpan={grupo.colspan} className="text-center grouped-header">
                  {grupo.titulo}
                </th>
              ))}
            </tr>
          )}
          <tr className="table-primary">
            {columnas.map((col, index) => (
              <th
                key={index}
                className={`text-center 
                  ${index === 0 ? "nro-columna" : ""} 
                  ${index === 1 ? "nomina-columna" : ""} 
                  ${index > 1 ? "vertical-text" : ""}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, i) => (
              <tr key={i}>
                {columnas.map((col, j) => (
                  <td key={j} className={`text-center 
                    ${j === 0 ? "nro-columna" : ""} 
                    ${j === 1 ? "nomina-columna" : ""}`}>
                    {fila[col] || "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnas.length} className="text-center">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;