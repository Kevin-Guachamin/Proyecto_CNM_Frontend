import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Tabla.css";

const Tabla = ({
  columnas, columnasAgrupadas, datos, onChange, columnasEditables = [],
  mostrarEditar = true, mostrarGuardar = true, onEditar, onGuardar, inputsDisabled,
  isWithinRange, rangoTexto, globalEdit, forceEdit, clasePersonalizada = "", soloLectura, esPorSolicitud = false, esFilaDeshabilitada }) => {
  
  const [editingRow, setEditingRow] = useState(null);
  const columnasRepetidas = ["Nro", "Nómina de Estudiantes"];
  const columnaFinal = "Acciones";
  
  const columnasFinales = (mostrarEditar || mostrarGuardar) && !soloLectura
    ? [...columnasRepetidas, ...columnas, columnaFinal]
    : [...columnasRepetidas, ...columnas];

  const columnasFormateables = [
    "INSUMO 1",
    "INSUMO 2",
    "EVALUACIÓN SUMATIVA",
    "EVALUACIÓN MEJORAMIENTO",
    "Examen Supletorio",
    "Examen"
  ];

  const esNotaBaja = (col, fila) => {
    const columnasEvaluadas = ["PROMEDIO PARCIAL", "Promedio Final", "PROMEDIO", "Primer Parcial","Segundo Parcial","Promedio Quimestral"];
    return columnasEvaluadas.includes(col) && !isNaN(parseFloat(fila[col])) && parseFloat(fila[col]) < 7;
  };

  return (
    <div className="table-responsive mt-3">
      <table className={`table table-bordered table-striped custom-table tabla-parciales tabla-parciales-be ${clasePersonalizada} ${soloLectura ? 'ocultar-acciones' : ''}`}>
        <thead>
          {columnasAgrupadas && (
            <tr>
              {columnasAgrupadas.map((grupo, index) => (
                <th key={index} colSpan={grupo.colspan} className="text-center grouped-header">
                  {grupo.titulo}
                </th>
              ))}
              {(mostrarEditar || mostrarGuardar) && (
                <th className="text-center columna-final">{columnaFinal}</th>
              )}
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
                  if ((col === columnaFinal) && (mostrarEditar || mostrarGuardar)) {
                    if (soloLectura) return null;
                    return (
                      <td key={j} className="text-center columna-final">
                        <div className="d-flex justify-content-around">
                          {mostrarEditar && (
                            <button
                              className="btn btn-sm btn-primary text-white"
                              onClick={() => {
                                // Permitir edición si está dentro del rango O si forceEdit está activo (solicitud aprobada)
                                if (!isWithinRange && !forceEdit) {
                                  Swal.fire({
                                    icon: rangoTexto ? "warning" : "info",
                                    title: rangoTexto ? "Fuera de fecha" : "Fechas no definidas",
                                    text: rangoTexto
                                      ? "No se puede editar fuera del rango de fechas establecido."
                                      : "Aún no se han definido fechas para esta sección.",
                                  });
                                  return;
                                }
                                setEditingRow(i); // Habilita la edición para esta fila.
                                if (onEditar) onEditar(i, fila);
                                
                                // Mostrar alerta de confirmación diferenciando si es por solicitud o por fechas normales
                                Swal.fire({
                                  icon: "success",
                                  title: esPorSolicitud ? "Edición por solicitud aprobada" : "Edición habilitada",
                                  text: esPorSolicitud 
                                    ? "Los campos están habilitados gracias a tu solicitud de permiso aprobada. Recuerda guardar los cambios con el botón 💾" 
                                    : "Los campos de esta fila están habilitados para edición. Recuerda guardar los cambios con el botón 💾",
                                  confirmButtonText: "OK"
                                });
                              }}>
                              <i className="bi bi-pencil-fill" ></i>
                            </button>
                          )}
                          {mostrarGuardar && (
                            <button
                              className="btn btn-success-light btn-sm text-white"
                              onClick={() => {
                                if (onGuardar) onGuardar(i, fila);
                                setEditingRow(null); // Sale del modo edición.
                              }}>
                              <i className="bi bi-floppy2-fill" ></i>
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  } else {
                    // Renderizamos las celdas normales
                    const esEditable = columnasEditables.includes(col);
                    return (
                      <td key={j} className={`text-center ${esNotaBaja(col, fila) ? "text-danger-strong" : ""}`}>
                        {/* Texto que solo se muestra en PDF */}
                        <span className="pdf-only">
                          {fila[col] !== undefined && fila[col] !== "" ? fila[col] : "-"}
                        </span>
                        {/* Vista normal: input si es editable, texto si no */}
                        {esEditable && !soloLectura ? (
                          col === "Examen Supletorio" ? (
                            (() => {
                              // Calculamos el promedio anual para decidir si mostrar input o no
                              const valor = fila["Promedio Anual"];
                              const promedio =
                                typeof valor === "string"
                                  ? parseFloat(valor)
                                  : parseFloat(valor?.props?.children) || 0;
                              // Si el promedio anual es mayor o igual a 7, mostramos solo "-" y no input
                              if (promedio >= 7) {
                                return <span className="screen-only">-</span>;
                              } else {
                                return (
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
                                      esFilaDeshabilitada 
                                        ? esFilaDeshabilitada(fila) || (promedio < 4)
                                        : inputsDisabled || editingRow !== i || (promedio < 4)
                                    }
                                  />
                                );
                              }
                            })()
                          ) : (
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
                                esFilaDeshabilitada
                                  ? esFilaDeshabilitada(fila)
                                  : inputsDisabled || (globalEdit ? false : editingRow !== i)
                              }
                            />
                          )
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