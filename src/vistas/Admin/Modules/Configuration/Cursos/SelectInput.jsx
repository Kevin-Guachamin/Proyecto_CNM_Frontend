import React from "react";
import './SelectInput.css';

const SelectInput = ({ opciones, value, onChange, key1, key2, placeholder = "Selecciona una opción" }) => {
  
  const handleChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === "") {
      onChange(null);
      return;
    }
    
    // Buscar la opción completa basada en el ID o índice seleccionado
    const selectedOption = opciones.find((opcion, index) => 
      opcion.ID ? opcion.ID.toString() === selectedId : index.toString() === selectedId
    );
    
    onChange(selectedOption);
  };

  // Obtener el valor actual para el select
  const getCurrentValue = () => {
    if (!value) return "";
    
    // Si el objeto tiene ID, usarlo, sino usar el índice
    if (value.ID) {
      return value.ID.toString();
    } else {
      const index = opciones.findIndex(opcion => opcion === value);
      return index !== -1 ? index.toString() : "";
    }
  };

  return (
    <select 
      value={getCurrentValue()}
      onChange={handleChange}
      className="select-input"
    >
      <option value="">{placeholder}</option>
      {opciones.map((opcion, index) => {
        // Usar ID si existe, sino usar el índice
        const optionValue = opcion.ID ? opcion.ID.toString() : index.toString();
        const displayText = key2 ? `${opcion[key1]} ${opcion[key2]}` : opcion[key1];
        
        return (
          <option key={optionValue} value={optionValue}>
            {displayText}
          </option>
        );
      })}
    </select>
  );
};

export default SelectInput;
