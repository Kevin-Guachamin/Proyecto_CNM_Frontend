import React from "react";
import { useNavigate } from "react-router-dom";
import "./Modulo.css";

const Modulo = ({ modulos, onModuloClick }) => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    if (onModuloClick) {
      onModuloClick(link);
    } else {
      navigate(link);
    }
  };

  return (
    <div className="contenedor-modulos">
      {modulos.map((modulo) => (
        <div key={modulo.id} className="modulo-card" onClick={() => handleClick(modulo)}>
          <div className="modulo-icono">{modulo.icono}</div>
          <div className="modulo-titulo">{modulo.titulo}</div>
        </div>
      ))}
    </div>
  );
};

export default Modulo;
