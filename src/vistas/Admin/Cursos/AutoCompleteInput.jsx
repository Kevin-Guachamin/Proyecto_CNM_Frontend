import React, { useState, useEffect } from "react";
import '../Styles/AutoCompleteInput.css'
const AutoCompleteInput = ({ opciones, inputValue, setInputValue, key1, key2 }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Función que maneja el cambio en el input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setFilteredOptions([]);
      setShowSuggestions(false);
      return;
    }

    // Filtramos las opciones basándonos en los dos atributos proporcionados (key1, key2)
    const matches = opciones.filter((opcion) =>
      `${opcion[key1]} ${opcion[key2]}`.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(matches);
    setShowSuggestions(matches.length > 0);
  };

  // Función que maneja el clic en una opción
  const handleOptionClick = (opcion) => {
    setInputValue(`${opcion[key1]} ${opcion[key2]}`);
    setFilteredOptions([]);
    setShowSuggestions(false);
  };

  // Función para manejar el clic fuera del input
  const handleClickOutside = (e) => {
    if (!e.target.closest(".autocomplete-container")) {
      setShowSuggestions(false);
    }
  };

  // Hook para detectar el clic fuera del componente
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Escribe algo..."
        className="autocomplete-input"
      />
      {showSuggestions && (
        <ul className="suggestions-list">
          {filteredOptions.map((opcion, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(opcion)}
              className="suggestion-item"
            >
              {`${opcion[key1]} ${opcion[key2]}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;



