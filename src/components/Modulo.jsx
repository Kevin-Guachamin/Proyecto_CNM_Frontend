import React from "react";
import { useNavigate } from "react-router-dom";
import "./Modulo.css"; // Asegúrate de que existe un archivo CSS para estilos

const Modulo = ({ modulos }) => {
  const navigate = useNavigate();

  return (
    <div className="contenedor-modulos">
      {modulos.map((modulo) => (
        <div key={modulo.id} className="modulo-card" onClick={() => navigate(modulo.ruta)}>
          <div className="modulo-icono">{modulo.icono}</div>
          <div className="modulo-titulo">{modulo.titulo}</div>
        </div>
      ))}
    </div>
  );
};

export default Modulo;
