import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Tabla.css";

const Tabla = ({ columnas, columnasAgrupadas, datos, onChange, columnasEditables = [] }) => {
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
              <th key={index} className={`text-center ${index > 1 ? "vertical-text" : ""}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, i) => (
              <tr key={i}>
                {columnas.map((col, j) => {
                  const esEditable = columnasEditables.includes(col);

                  return (
                    <td key={j} className="text-center">
                      {esEditable ? (
                        <input
                          type="text"
                          value={fila[col] || ""}
                          onChange={(e) => onChange(i, col, e.target.value)}
                          className="form-control text-center"
                          data-columna={col} /* Agrega este atributo para CSS */
                        />
                      ) : (
                        fila[col] || "-"
                      )}
                    </td>

                  );
                })}
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
