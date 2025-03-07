import React from "react";
import { Plus } from "lucide-react"; // Importamos el icono
import "./BotonAdd.css";

const BotonAdd = ({ onClick, type }) => {
  return (
    <button onClick={onClick} className={`boton-add`} type={type}>
      <Plus size={20} className="icono" /> Agregar
      
    </button>
  );
};

export default BotonAdd;