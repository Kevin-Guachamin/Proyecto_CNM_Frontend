import React from "react";
import { Plus } from "lucide-react"; // Importamos el icono
import "./BotonAdd.css";

const BotonAdd = ({ onClick, type, disabled = false, title }) => {
  return (
    <button 
      onClick={disabled ? null : onClick} 
      className={`boton-add ${disabled ? 'disabled' : ''}`} 
      type={type}
      disabled={disabled}
      title={title}
    >
      <Plus size={20} className="icono" /> Agregar
    </button>
  );
};

export default BotonAdd;