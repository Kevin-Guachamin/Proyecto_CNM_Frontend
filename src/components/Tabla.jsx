import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Tabla.css";

const Tabla = ({ columnas, columnasAgrupadas, datos, onChange, columnasEditables = [] }) => {
  // Columnas que se repiten en todas las tablas
  const columnasRepetidas = ["Nro", "Nómina de Estudiantes"];
  // Concatenamos las columnas fijas con las columnas específicas pasadas desde el padre
  const columnasFinales = [...columnasRepetidas, ...columnas];

  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered table-striped custom-table tabla-parciales">
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
            {columnasFinales.map((col, index) => (
              <th key={index} className="text-center">
                {/* Para las dos primeras columnas, texto normal;
                    para las demás, texto en vertical */}
                {index > 1 ? (
                  <span className="vertical-text">{col}</span>
                ) : (
                  col
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, i) => (
              <tr key={i}>
                {columnasFinales.map((col, j) => {
                  const esEditable = columnasEditables.includes(col);
                  return (
                    <td key={j} className="text-center">
                      {/* Texto que solo se muestra en PDF */}
                      <span className="pdf-only">
                        {fila[col] !== undefined && fila[col] !== "" ? fila[col] : "-"}
                      </span>
                      {/* Vista normal: input si es editable, texto si no */}
                      {esEditable ? (
                        <input
                          type="text"
                          value={fila[col] || ""}
                          onChange={(e) => onChange(i, col, e.target.value)}
                          className="form-control text-center screen-only"
                          data-columna={col}
                        />
                      ) : (
                        <span className="screen-only">
                          {fila[col] !== undefined && fila[col] !== "" ? fila[col] : "-"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnasFinales.length} className="text-center">
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
