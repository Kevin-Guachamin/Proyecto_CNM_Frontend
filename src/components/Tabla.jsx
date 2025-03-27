import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Tabla.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Tabla = ({
  columnas,
  columnasAgrupadas,
  datos,
  onChange,
  columnasEditables = [],
  mostrarEditar = true,
  mostrarEliminar = true,
  onEditar,
  onEliminar
}) => {
  const columnasRepetidas = ["Nro", "Nómina de Estudiantes"];
  const columnaFinal = "Acciones";
  const columnasFinales = [...columnasRepetidas, ...columnas, columnaFinal];

  const columnasFormateables = [
    "INSUMO 1",
    "INSUMO 2",
    "EVALUACIÓN SUMATIVA",
    "Examen Supletorio",
    "Examen"
  ];

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
              {/* Asigna la clase columna-final en el th */}
              <th className="text-center columna-final">{columnaFinal}</th>
            </tr>
          )}
          <tr className="table-primary">
            {columnasFinales.map((col, index) => (
              <th key={index} className={`text-center ${col === columnaFinal ? "columna-final" : ""}`}>
                {index > 1 && col !== columnaFinal ? (
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
                  if (col === columnaFinal) {
                    // Renderizamos la columna de acciones con la clase columna-final
                    return (
                      <td key={j} className="text-center columna-final">
                        <div className="d-flex justify-content-around">
                          {mostrarEditar && (
                            <button
                              className="btn btn-sm btn-primary text-white"
                              onClick={() =>
                                onEditar ? onEditar(i, fila) : console.log("Editar clicked", i)
                              }
                            >
                              <i className="bi bi-pencil-fill" ></i>
                            </button>
                          )}
                          {mostrarEliminar && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                onEliminar ? onEliminar(i, fila) : console.log("Eliminar clicked", i)
                              }
                            >
                              <i className="bi bi-trash-fill" ></i>
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  } else {
                    // Renderizamos las celdas normales
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
                            onBlur={(e) => {
                              const val = e.target.value;
                              if (columnasFormateables.includes(col)) {
                                const numero = parseFloat(val);
                                if (!isNaN(numero)) {
                                  onChange(i, col, numero.toFixed(2));
                                }
                              }
                            }}
                            className="form-control text-center screen-only"
                            data-columna={col}
                            disabled={
                              col === "Examen Supletorio" &&
                              (() => {
                                const valor = fila["Promedio Anual"];
                                const promedio = typeof valor === "string"
                                  ? parseFloat(valor)
                                  : parseFloat(valor?.props?.children);
                                return promedio < 4;
                              })()
                            }
                          />
                        ) : (
                          <span className="screen-only">
                            {fila[col] !== undefined && fila[col] !== "" ? fila[col] : "-"}
                          </span>
                        )}
                      </td>
                    );
                  }
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
