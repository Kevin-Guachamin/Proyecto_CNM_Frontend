import React from "react";

const HeaderTabla = ({ datosEncabezado, imagenIzquierda, imagenDerecha }) => {
  return (
    <div className="container border p-3 mt-3">
      <div className="d-flex justify-content-between align-items-center">
        {/* Imagen izquierda (opcional) */}
        {imagenIzquierda && (
          <img src={imagenIzquierda} alt="Logo Izquierdo" style={{ height: "80px" }} />
        )}

        {/* Título centrado */}
        <h4 className="fw-bold flex-grow-1 text-center">{datosEncabezado.titulo}</h4>

        {/* Imagen derecha (opcional) */}
        {imagenDerecha && (
          <img src={imagenDerecha} alt="Logo Derecho" style={{ height: "80px" }} />
        )}
      </div>

      {/* Información en formato de filas y columnas */}
      <div className="row mt-2">
        {Object.entries(datosEncabezado.info).map(([clave, valor], index) => (
          <div key={index} className="col-md-6 mb-1">
            <strong>{clave}: </strong> {valor}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderTabla;
